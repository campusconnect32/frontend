import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Edit3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function TutorDetail() {
  const { tutorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tutors/${tutorId}`)
      .then(res => setTutor(res.data))
      .catch(() => toast.error("Tutor not found"))
      .finally(() => setLoading(false));
  }, [tutorId]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this tutor ad?")) return;
    try {
      await api.delete(`/tutors/${tutorId}`);
      toast.success("Tutor deleted");
      navigate("/tutors");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Cannot delete");
    }
  };

  if (loading) return <div className="min-h-screen"><Navbar /><div className="p-8 text-center">Loading...</div></div>;
  if (!tutor) return <div className="min-h-screen"><Navbar /><div className="p-8 text-center">Tutor not found.</div></div>;

  const isOwner = user?.user_id === tutor.user_id;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="neo-btn neo-btn-ghost mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden">
          <div className="aspect-video bg-[#F5F3EE] flex items-center justify-center">
            {tutor.image ? (
              <img src={tutor.image} alt={tutor.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl">🎓</span>
            )}
          </div>
          <div className="p-6 space-y-4">
            <h1 className="font-display text-2xl font-semibold">{tutor.title}</h1>
            <div>
              <span className="text-sm font-semibold uppercase text-[#6B6B70]">Course</span>
              <p className="text-lg">{tutor.course_name} ({tutor.course_code})</p>
            </div>
            <div>
              <span className="text-sm font-semibold uppercase text-[#6B6B70]">Price Range</span>
              <p className="text-lg font-medium">{tutor.price_range}</p>
            </div>

            {isOwner && (
              <div className="flex gap-2 pt-2">
                <Link to={`/tutors/edit/${tutor.tutor_id}`} className="neo-btn neo-btn-secondary !py-1.5 !px-4">
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