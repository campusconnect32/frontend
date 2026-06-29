import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Plus, Edit3, Star, MessageCircle, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hasOwnAds, setHasOwnAds] = useState(false);

  useEffect(() => {
    fetchNotes();
    checkOwnAds();
  }, [user]);

  const fetchNotes = async (searchTerm = "") => {
    setLoading(true);
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const { data } = await api.get("/notes", { params });
      setNotes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkOwnAds = async () => {
    if (!user) return;
    try {
      const res = await api.get("/notes/my-count");
      setHasOwnAds(res.data.count > 0);
    } catch {
      setHasOwnAds(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchNotes(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="font-display text-3xl font-semibold">Notes Guru</h1>
          <div className="flex gap-2">
            {hasOwnAds && (
              <Link to="/notes/my-ads" className="neo-btn neo-btn-secondary !px-4 !py-2">
                <Edit3 className="w-4 h-4 mr-2" /> My Ads
              </Link>
            )}
            <Link to="/notes/create" className="neo-btn bg-purple-600 border-purple-600 !px-4 !py-2">
              <Plus className="w-4 h-4 mr-2" /> Sell Notes
            </Link>
          </div>
        </div>

        <div className="flex items-center border border-[#E7E5E0] rounded-xl bg-white mb-8 overflow-hidden">
          <Search className="w-5 h-5 text-[#6B6B70] ml-3 flex-shrink-0" />
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search by course code..."
            className="w-full py-3 pl-2 pr-4 text-sm bg-transparent outline-none border-none"
          />
        </div>

        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B70]">{search ? "No notes found." : "No notes available yet."}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => {
              const avgRating = note.average_rating || 0;
              const ratingCount = note.rating_count || 0;
              const images = note.images?.length ? note.images : [];
              return (
                <div key={note.note_id} className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-video bg-[#F5F3EE] flex items-center justify-center">
                    {images[0] ? <img src={images[0]} alt="" className="w-full h-full object-cover" /> : <span className="text-4xl">📝</span>}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg leading-tight">{note.title}</h3>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= avgRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                        ))}
                        {ratingCount > 0 && <span className="text-xs text-[#6B6B70] ml-1">({avgRating})</span>}
                      </div>
                    </div>
                    <p className="text-sm text-[#6B6B70] mt-1">{note.course_name} – {note.course_code}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="chip chip-accent text-xs font-medium">{note.price}</span>
                      <Link to={`/notes/${note.note_id}/reviews`} className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800">
                        <MessageCircle className="w-4 h-4" /> Chat
                      </Link>
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