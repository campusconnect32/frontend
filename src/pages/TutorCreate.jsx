import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import Navbar from "@/components/Navbar";

export default function TutorCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !courseName.trim() || !courseCode.trim() || !priceRange.trim()) {
      return toast.error("All fields are required");
    }
    setSaving(true);
    try {
      await api.post("/tutors", {
        title: title.trim(),
        course_name: courseName.trim(),
        course_code: courseCode.trim().toUpperCase(),
        price_range: priceRange.trim(),
        image: image || "",
      });
      toast.success("Tutor ad created!");
      navigate("/tutors");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create ad");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-semibold mb-6">Become a Tutor</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase">Title / Your Name</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="neo-input mt-1" placeholder="e.g. John's Math Tutoring" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Course Name</label>
            <input value={courseName} onChange={e => setCourseName(e.target.value)} className="neo-input mt-1" placeholder="e.g. Calculus I" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Course Code</label>
            <input value={courseCode} onChange={e => setCourseCode(e.target.value)} className="neo-input mt-1" placeholder="e.g. MATH101" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Price Range (or 'Free')</label>
            <input value={priceRange} onChange={e => setPriceRange(e.target.value)} className="neo-input mt-1" placeholder="e.g. R50-R100 / Free" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Image (optional)</label>
            <ImageUpload images={image ? [image] : []} onChange={(imgs) => setImage(imgs[0] || "")} maxImages={1} />
          </div>
          <button type="submit" disabled={saving} className="neo-btn bg-purple-600 border-purple-600 w-full">
            {saving ? "Creating..." : "Create Tutor Ad"}
          </button>
        </form>
      </div>
    </div>
  );
}