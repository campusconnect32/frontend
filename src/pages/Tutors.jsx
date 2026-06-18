import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Search, Plus, Edit3, Star, MessageCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

export default function Tutors() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async (code = "") => {
    setLoading(true);
    try {
      const params = code ? { search: code } : {};
      const { data } = await api.get("/tutors", { params });
      setTutors(data || []);
    } catch (err) {
      console.error("Failed to fetch tutors", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchTutors(e.target.value);
  };

  const handleDelete = async (tutorId) => {
    if (!window.confirm("Delete this ad?")) return;
    try {
      await api.delete(`/tutors/${tutorId}`);
      setTutors(prev => prev.filter(t => t.tutor_id !== tutorId));
      toast.success("Ad deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="font-display text-3xl font-semibold">Find a Tutor</h1>
          <div className="flex gap-2">
            {user && (
              <Link
                to="/tutors/myads"
                className="neo-btn neo-btn-secondary !px-4 !py-2"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                My Ads
              </Link>
            )}
            <Link
              to="/tutors/create"
              className="neo-btn bg-purple-600 border-purple-600 !px-4 !py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Be a Tutor
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center border border-[#E7E5E0] rounded-xl bg-white mb-8 overflow-hidden">
          <Search className="w-5 h-5 text-[#6B6B70] ml-3 flex-shrink-0" />
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search by course code..."
            className="w-full py-3 pl-2 pr-4 text-sm bg-transparent outline-none border-none"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {/* Results */}
        {!loading && tutors.length === 0 && (
          <div className="text-center py-12 text-[#6B6B70]">
            {search ? "No tutors found for that course code." : "No tutors available yet."}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((t) => {
            const isOwner = user?.user_id === t.user_id;
            const avgRating = t.average_rating || 0;
            const ratingCount = t.rating_count || 0;

            return (
              <div
                key={t.tutor_id}
                className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Image */}
                <div className="aspect-video bg-[#F5F3EE] flex items-center justify-center">
                  {t.image ? (
                    <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-[#6B6B70]">🎓</span>
                  )}
                </div>

                <div className="p-4">
                  {/* Title row with average rating on the right */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg leading-tight">{t.title}</h3>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {[1,2,3,4,5].map(star => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= avgRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                      {ratingCount > 0 && (
                        <span className="text-xs text-[#6B6B70] ml-1">({avgRating})</span>
                      )}
                    </div>
                  </div>

                  {/* Course info */}
                  <p className="text-sm text-[#6B6B70] mt-1">
                    {t.course_name} – {t.course_code}
                  </p>

                  {/* Price + Chat row */}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="chip chip-accent text-xs font-medium">{t.price_range}</span>
                    <Link
                      to={`/tutors/${t.tutor_id}/reviews`}
                      className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Link>
                  </div>

                  {/* Owner actions (Edit / Delete) */}
                  {isOwner && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-[#E7E5E0]">
                      <Link
                        to={`/tutors/edit/${t.tutor_id}`}
                        className="neo-btn neo-btn-secondary !py-1.5 !px-3 text-xs"
                      >
                        <Edit3 className="w-4 h-4 mr-1" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(t.tutor_id)}
                        className="neo-btn !py-1.5 !px-3 text-xs bg-red-500 border-red-500 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}