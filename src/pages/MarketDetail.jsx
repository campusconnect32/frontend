import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function MarketDetail() {
  const { itemId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/marketplace/items/${itemId}`)
      .then(res => setItem(res.data))
      .catch(() => {
        toast.error("Item not found");
        navigate("/market");
      })
      .finally(() => setLoading(false));
  }, [itemId]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await api.delete(`/marketplace/items/${itemId}`);
      toast.success("Listing deleted");
      navigate("/market");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Cannot delete");
    }
  };

  if (loading) return <div className="min-h-screen"><Navbar /><div className="p-8 text-center">Loading...</div></div>;
  if (!item) return <div className="min-h-screen"><Navbar /><div className="p-8 text-center">Item not found.</div></div>;

  const isOwner = user?.user_id === item.user_id;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="neo-btn neo-btn-ghost mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden">
          <div className="aspect-video bg-[#F5F3EE] flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl">🛒</span>
            )}
          </div>
          <div className="p-6 space-y-4">
            <h1 className="font-display text-2xl font-semibold">{item.title}</h1>
            <div className="flex items-center gap-2">
              <span className="chip chip-accent text-sm font-medium">{item.price}</span>
              <span className="chip chip-mint text-sm">{item.category}</span>
            </div>
            <p className="text-sm text-[#404040] whitespace-pre-wrap">{item.description || "No description provided."}</p>

            {isOwner && (
              <div className="flex gap-2 pt-2">
                <Link to={`/market/edit/${item.item_id}`} className="neo-btn neo-btn-secondary !py-1.5 !px-4">
                  <Edit3 className="w-4 h-4 mr-2" /> Edit
                </Link>
                <button onClick={handleDelete} className="neo-btn !py-1.5 !px-4 bg-red-500 border-red-500 text-white">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}