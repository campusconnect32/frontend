import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Plus, Edit3, MessageCircle, Info, X, Phone, MapPin, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function Market() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [hasOwnListings, setHasOwnListings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [infoDialog, setInfoDialog] = useState(null);
  const [galleryDialog, setGalleryDialog] = useState(null);

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
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (searchQuery) params.search = searchQuery;
    api.get("/marketplace/items", { params })
      .then(res => setItems(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, searchQuery]);

  const checkOwnListings = async () => {
    try {
      const res = await api.get("/marketplace/myitems/count");
      setHasOwnListings(res.data.count > 0);
    } catch (err) {
      setHasOwnListings(false);
    }
  };

  const openGallery = (images, index = 0) => {
    setGalleryDialog({ images: images || [], currentIndex: index });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
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

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search items by name..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Category filter – scrollable row */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap ${
              activeCategory === "" ? "bg-purple-600 text-white border-purple-600" : "bg-white border-[#E7E5E0]"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap ${
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => {
              const images = item.images?.length ? item.images : item.image ? [item.image] : [];
              return (
                <div key={item.item_id} className="bg-white border border-[#E7E5E0] rounded-xl overflow-hidden shadow-sm">
                  {/* Image – fixed to show full content without cropping */}
                  <div
                    className="relative w-full bg-[#F5F3EE] cursor-pointer"
                    style={{ paddingBottom: '100%' }}
                    onClick={() => openGallery(images)}
                  >
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt=""
                        className="absolute inset-0 w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center text-3xl">
                        🛒
                      </div>
                    )}
                    {images.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                        {images.length}
                      </span>
                    )}
                    {/* Info icon */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setInfoDialog(item); }}
                      className="absolute top-1 left-1 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center z-10"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold text-sm leading-tight truncate">{item.title}</h3>
                    <div className="mt-1 flex items-center justify-between flex-wrap gap-1">
                      <span className="text-sm font-bold text-purple-700">{item.price}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                        {item.category}
                      </span>
                    </div>
                    <Link
                      to={`/market/chat/${item.item_id}?other=${item.user_id}`}
                      className="mt-2 flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Chat
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Gallery Dialog */}
      {galleryDialog && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setGalleryDialog(null)}>
          <div className="relative w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setGalleryDialog(null)} className="absolute -top-10 right-0 text-white"><X className="w-6 h-6" /></button>
            {galleryDialog.images.length > 0 && (
              <img src={galleryDialog.images[galleryDialog.currentIndex]} alt="" className="w-full max-h-[80vh] object-contain rounded-xl" />
            )}
            {galleryDialog.images.length > 1 && (
              <>
                <button
                  onClick={() => setGalleryDialog(prev => ({ ...prev, currentIndex: prev.currentIndex > 0 ? prev.currentIndex - 1 : prev.images.length - 1 }))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setGalleryDialog(prev => ({ ...prev, currentIndex: prev.currentIndex < prev.images.length - 1 ? prev.currentIndex + 1 : 0 }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Info Dialog */}
      {infoDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setInfoDialog(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-fade-in overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold break-words">{infoDialog.title}</h3>
              <button onClick={() => setInfoDialog(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            {infoDialog.description && (
              <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap break-words">{infoDialog.description}</p>
            )}
            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Seller</p>
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
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <p className="text-sm">
                    {[infoDialog.seller_city, infoDialog.seller_country].filter(Boolean).join(", ") || "No location"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}