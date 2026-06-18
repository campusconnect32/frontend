import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Plus, Edit3, MessageCircle, Info, X, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function Market() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [hasOwnListings, setHasOwnListings] = useState(false);
  const [infoDialog, setInfoDialog] = useState(null); // item to show info for

  useEffect(() => {
    api.get("/marketplace/categories")
      .then(res => setCategories(res.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      checkOwnListings();
    } else {
      setHasOwnListings(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    const params = activeCategory ? { category: activeCategory } : {};
    api.get("/marketplace/items", { params })
      .then(res => setItems(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const checkOwnListings = async () => {
    try {
      const res = await api.get("/marketplace/myitems/count");
      setHasOwnListings(res.data.count > 0);
    } catch (err) {
      setHasOwnListings(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-semibold">Marketplace</h1>
          <div className="flex gap-2">
            {hasOwnListings && (
              <>
                <Link to="/market/mycustomers" className="neo-btn neo-btn-secondary !px-4 !py-2">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  My Customers
                </Link>
                <Link to="/market/mylistings" className="neo-btn neo-btn-secondary !px-4 !py-2">
                  <Edit3 className="w-4 h-4 mr-2" />
                  My Listings
                </Link>
              </>
            )}
            <Link to="/market/create" className="neo-btn bg-purple-600 border-purple-600 !px-4 !py-2">
              <Plus className="w-4 h-4 mr-2" />
              Create Listing
            </Link>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveCategory("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              activeCategory === "" ? "bg-purple-600 text-white border-purple-600" : "bg-white border-[#E7E5E0]"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                activeCategory === cat ? "bg-purple-600 text-white border-purple-600" : "bg-white border-[#E7E5E0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B70]">No listings yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div
                key={item.item_id}
                className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Image with info icon overlay */}
                <div className="relative aspect-video bg-[#F5F3EE]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-[#6B6B70]">
                      🛒
                    </div>
                  )}
                  {/* Info icon – top left */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoDialog(item);
                    }}
                    className="absolute top-2 left-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white"
                  >
                    <Info className="w-4 h-4 text-[#0F0F10]" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-base leading-tight">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-[#6B6B70] mt-1 line-clamp-3">{item.description}</p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="chip chip-accent text-xs font-medium">{item.price}</span>
                    {/* Chat button – always include ?other=seller_id */}
                    <Link
                      to={`/market/chat/${item.item_id}?other=${item.user_id}`}
                      className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Dialog */}
      {infoDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setInfoDialog(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">Seller Info</h3>
              <button onClick={() => setInfoDialog(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[#6B6B70]">Name</p>
                <p className="text-sm">{infoDialog.seller_name || "Unknown"}</p>
              </div>
              {infoDialog.seller_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  <p className="text-sm">{infoDialog.seller_phone}</p>
                </div>
              )}
              {(infoDialog.seller_city || infoDialog.seller_country) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6B6B70]" />
                  <p className="text-sm">
                    {[infoDialog.seller_city, infoDialog.seller_country].filter(Boolean).join(", ") || "No location"}
                  </p>
                </div>
              )}
              {!infoDialog.seller_phone && !infoDialog.seller_city && !infoDialog.seller_country && (
                <p className="text-sm text-[#6B6B70]">No additional contact info available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}