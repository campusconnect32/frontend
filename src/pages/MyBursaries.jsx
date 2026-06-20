import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function MyBursaries() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bursaries")
      .then(res => {
        const all = res.data || [];
        setPosts(all.filter(p => p.user_id === user?.user_id));
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load your posts");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (bursaryId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/bursaries/${bursaryId}`);
      setPosts(prev => prev.filter(p => p.bursary_id !== bursaryId));
      toast.success("Post deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-semibold mb-6">My Posts</h1>
        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B70]">
            You haven't posted any opportunities yet.
            <br />
            <Link to="/bursaries/create" className="text-purple-600 font-medium underline">Create your first post</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(item => (
              <div key={item.bursary_id} className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-video bg-[#F5F3EE]">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎓</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base leading-tight">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-[#6B6B70] mt-1 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-[#E7E5E0]">
                    <Link to={`/bursaries/edit/${item.bursary_id}`} className="neo-btn neo-btn-secondary !py-1.5 !px-3 text-xs">
                      <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                    </Link>
                    <button onClick={() => handleDelete(item.bursary_id)} className="neo-btn !py-1.5 !px-3 text-xs bg-red-500 border-red-500 text-white">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
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