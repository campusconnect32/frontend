import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import Navbar from "@/components/Navbar";

export default function NoteCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !courseName.trim() || !courseCode.trim() || !price.trim()) {
      return toast.error("All fields are required");
    }
    setSaving(true);
    try {
      await api.post("/notes", {
        title: title.trim(),
        course_name: courseName.trim(),
        course_code: courseCode.trim().toUpperCase(),
        price: price.trim(),
        description: description.trim(),
        images,
      });
      toast.success("Note posted!");
      navigate("/notes");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-semibold mb-6">Sell Your Notes</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
          <div><label className="text-xs font-semibold uppercase">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="neo-input mt-1" required /></div>
          <div><label className="text-xs font-semibold uppercase">Course Name</label><input value={courseName} onChange={e => setCourseName(e.target.value)} className="neo-input mt-1" required /></div>
          <div><label className="text-xs font-semibold uppercase">Course Code</label><input value={courseCode} onChange={e => setCourseCode(e.target.value)} className="neo-input mt-1" required /></div>
          <div><label className="text-xs font-semibold uppercase">Price (or "Negotiable")</label><input value={price} onChange={e => setPrice(e.target.value)} className="neo-input mt-1" placeholder="e.g. R50 or Negotiable" required /></div>
          <div><label className="text-xs font-semibold uppercase">Description (optional)</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="neo-input mt-1 h-20 resize-none" /></div>
          <div><label className="text-xs font-semibold uppercase">Images (up to 5)</label><ImageUpload images={images} onChange={setImages} maxImages={5} /></div>
          <button type="submit" disabled={saving} className="neo-btn bg-purple-600 border-purple-600 w-full">{saving ? "Posting..." : "Post Note"}</button>
        </form>
      </div>
    </div>
  );
}