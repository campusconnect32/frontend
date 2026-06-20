import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Search, UserPlus, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function FindUsers() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    // Load current following list
    api.get("/users/following").then(res => setFollowing(res.data.map(u => u.user_id))).catch(console.error);
  }, []);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length < 2) { setResults([]); return; }
    try {
      const res = await api.get("/users/search", { params: { q: val } });
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFollow = async (targetUserId) => {
    try {
      const res = await api.post("/users/follow", { user_id: targetUserId });
      const isFollowing = res.data.following;
      setFollowing(prev => isFollowing ? [...prev, targetUserId] : prev.filter(id => id !== targetUserId));
      toast.success(isFollowing ? "Followed" : "Unfollowed");
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-semibold mb-6">Find People</h1>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={query}
            onChange={handleSearch}
            placeholder="Search by name or email..."
            className="neo-input pl-10"
          />
        </div>
        <div className="space-y-3">
          {results.map(u => (
            <div key={u.user_id} className="flex items-center justify-between bg-white border border-[#E7E5E0] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {u.profile_image ? <img src={u.profile_image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{(u.display_name||"?")[0].toUpperCase()}</div>}
                </div>
                <span className="font-medium">{u.display_name}</span>
              </div>
              <button
                onClick={() => toggleFollow(u.user_id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                  following.includes(u.user_id) ? "bg-gray-200 text-gray-700" : "bg-purple-600 text-white"
                }`}
              >
                {following.includes(u.user_id) ? (
                  <><UserCheck className="w-4 h-4" /> Following</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> Follow</>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}