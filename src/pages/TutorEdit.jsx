import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import Navbar from "@/components/Navbar";

export default function TutorEdit() {
  const { tutorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/tutors/${tutorId}`)
      .then(res => {
        if (res.data.user_id !== user?.user_id) {
          toast.error("You can't edit this ad");
          navigate("/tutors");
          return;
        }
        setTitle(res.data.title);
        setCourseName(res.data.course_name);
        setCourseCode(res.data.course_code);
        setPriceRange(res.data.price_range);
        setImage(res.data.image || "");
      })
      .catch(() => {
        toast.error("Tutor not found");
        navigate("/tutors");
      })
      .finally(() => setLoading(false));
  }, [tutorId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !courseName.trim() || !courseCode.trim() || !priceRange.trim()) {
      return toast.error("All fields are required");
    }
    setSaving(true);
    try {
      await api.put(`/tutors/${tutorId}`, {
        title: title.trim(),
        course_name: courseName.trim(),
        course_code: courseCode.trim().toUpperCase(),
        price_range: priceRange.trim(),
        image: image || "",
      });
      toast.success("Tutor ad updated!");
      navigate(`/tutors/${tutorId}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update ad");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen"><Navbar /><div className="p-8 text-center">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-semibold mb-6">Edit Tutor Ad</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase">Title / Your Name</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="neo-input mt-1" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Course Name</label>
            <input value={courseName} onChange={e => setCourseName(e.target.value)} className="neo-input mt-1" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Course Code</label>
            <input value={courseCode} onChange={e => setCourseCode(e.target.value)} className="neo-input mt-1" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Price Range (or 'Free')</label>
            <input value={priceRange} onChange={e => setPriceRange(e.target.value)} className="neo-input mt-1" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Image (optional)</label>
            <ImageUpload images={image ? [image] : []} onChange={(imgs) => setImage(imgs[0] || "")} maxImages={1} />
          </div>
          <button type="submit" disabled={saving} className="neo-btn bg-purple-600 border-purple-600 w-full">
            {saving ? "Saving..." : "Update Ad"}
          </button>
        </form>
      </div>
    </div>
  );
}