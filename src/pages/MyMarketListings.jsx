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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div
                key={item.item_id}
                className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="aspect-video bg-[#F5F3EE]">
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
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base leading-tight">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-[#6B6B70] mt-1 line-clamp-3">{item.description}</p>
                  )}
                  <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                    <span className="chip chip-accent text-xs font-medium">{item.price}</span>
                    <span className="chip chip-mint text-xs">{item.category}</span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}