import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function MyMarketListings() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/marketplace/items")
      .then(res => {
        const all = res.data || [];
        setItems(all.filter(item => item.user_id === user?.user_id));
      })
      .catch(err => {
        console.error("Failed to load listings", err);
        toast.error("Could not load your listings");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await api.delete(`/marketplace/items/${itemId}`);
      setItems(prev => prev.filter(item => item.item_id !== itemId));
      toast.success("Listing deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-semibold mb-6">My Listings</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B70]">
            You don't have any listings yet.
            <br />
            <Link to="/market/create" className="text-purple-600 font-medium underline">
              Create your first listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => {
              // Use new images array, fallback to single image field
              const images = item.images?.length ? item.images : item.image ? [item.image] : [];
              return (
                <div
                  key={item.item_id}
                  className="bg-white border border-[#E7E5E0] rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Image – FIXED: object-contain so nothing is cropped */}
                  <div className="relative w-full bg-[#F5F3EE]" style={{ paddingBottom: '100%' }}>
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center text-3xl text-[#6B6B70]">
                        🛒
                      </div>
                    )}
                    {images.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                        {images.length}
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold text-sm leading-tight truncate">{item.title}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-bold text-purple-700">{item.price}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-[#E7E5E0]">
                      <Link
                        to={`/market/edit/${item.item_id}`}
                        className="neo-btn neo-btn-secondary !py-1.5 !px-3 text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.item_id)}
                        className="neo-btn !py-1.5 !px-3 text-xs bg-red-500 border-red-500 text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}