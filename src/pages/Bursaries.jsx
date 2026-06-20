import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Plus, Edit3, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function Bursaries() {
  const { user } = useAuth();
  const [bursaries, setBursaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasOwnPosts, setHasOwnPosts] = useState(false);

  useEffect(() => {
    fetchBursaries();
    checkOwnPosts();
  }, [user]);

  const fetchBursaries = async (search = "") => {
    setLoading(true);
    try {
      const params = search ? { search } : {};
      const { data } = await api.get("/bursaries", { params });
      setBursaries(data || []);
    } catch (err) {
      console.error("Failed to fetch bursaries", err);
    } finally {
      setLoading(false);
    }
  };

  const checkOwnPosts = async () => {
    if (!user) return;
    try {
      const res = await api.get("/bursaries/my-count");
      setHasOwnPosts(res.data.count > 0);
    } catch (err) {
      setHasOwnPosts(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-semibold">Bursaries & Scholarships</h1>
          <div className="flex gap-2">
            {hasOwnPosts && (
              <Link to="/bursaries/my-posts" className="neo-btn neo-btn-secondary !px-4 !py-2">
                <Edit3 className="w-4 h-4 mr-2" />
                My Posts
              </Link>
            )}
            <Link to="/bursaries/create" className="neo-btn bg-purple-600 border-purple-600 !px-4 !py-2">
              <Plus className="w-4 h-4 mr-2" />
              Post Opportunity
            </Link>
          </div>
        </div>

        {/* Search bar (optional but useful) */}
        <div className="flex items-center border border-[#E7E5E0] rounded-xl bg-white mb-8 overflow-hidden">
          <input
            placeholder="Search by title or description..."
            onChange={(e) => fetchBursaries(e.target.value)}
            className="w-full py-3 pl-4 pr-4 text-sm bg-transparent outline-none border-none"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : bursaries.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B70]">No opportunities posted yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bursaries.map(item => {
              const isOwner = user?.user_id === item.user_id;

              return (
                <div
                  key={item.bursary_id}
                  className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden shadow-sm"
                >
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
                    <div className="mt-2 flex items-center justify-between">
                      {item.link && (
                        <a
                          href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Learn more
                        </a>
                      )}
                      {/* Edit/Delete for owner are not here; they go to "My Posts" */}
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