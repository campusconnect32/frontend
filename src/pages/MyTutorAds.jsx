import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function MyTutorAds() {
  const { user } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tutors")
      .then(res => {
        const allAds = res.data || [];
        const myAds = allAds.filter(ad => ad.user_id === user?.user_id);
        setAds(myAds);
      })
      .catch(() => toast.error("Could not load your ads"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (tutorId) => {
    if (!window.confirm("Delete this ad?")) return;
    try {
      await api.delete(`/tutors/${tutorId}`);
      setAds(prev => prev.filter(a => a.tutor_id !== tutorId));
      toast.success("Ad deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="min-h-screen"><Navbar /><div className="p-8 text-center">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-semibold mb-6">My Tutor Ads</h1>

        {ads.length === 0 && (
          <div className="text-center py-12 text-[#6B6B70]">
            You haven’t created any ads yet.
            <br />
            <Link to="/tutors/create" className="text-purple-600 font-medium underline">
              Create your first ad
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad.tutor_id} className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden shadow-sm">
              <div className="aspect-video bg-[#F5F3EE] flex items-center justify-center">
                {ad.image ? (
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-[#6B6B70]">🎓</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{ad.title}</h3>
                <p className="text-sm text-[#6B6B70]">{ad.course_name} – {ad.course_code}</p>
                <p className="text-sm font-medium mt-1">{ad.price_range}</p>

                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/tutors/edit/${ad.tutor_id}`}
                    className="neo-btn neo-btn-secondary !py-1.5 !px-4 text-xs"
                  >
                    <Edit3 className="w-4 h-4 mr-1" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(ad.tutor_id)}
                    className="neo-btn !py-1.5 !px-4 text-xs bg-red-500 border-red-500 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}