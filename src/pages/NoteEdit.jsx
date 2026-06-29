import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import Navbar from "@/components/Navbar";

export default function NoteEdit() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/notes/${noteId}`).then(res => {
      setTitle(res.data.title);
      setCourseName(res.data.course_name);
      setCourseCode(res.data.course_code);
      setPrice(res.data.price);
      setDescription(res.data.description || "");
      setImages(res.data.images || []);
    }).catch(() => { toast.error("Note not found"); navigate("/notes"); })
    .finally(() => setLoading(false));
  }, [noteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !courseName.trim() || !courseCode.trim() || !price.trim()) {
      return toast.error("All fields are required");
    }
    setSaving(true);
    try {
      await api.put(`/notes/${noteId}`, {
        title: title.trim(),
        course_name: courseName.trim(),
        course_code: courseCode.trim().toUpperCase(),
        price: price.trim(),
        description: description.trim(),
        images,
      });
      toast.success("Updated!");
      navigate(`/notes/${noteId}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen"><Navbar /><div className="p-8 text-center">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-semibold mb-6">Edit Note</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
          <div><label className="text-xs font-semibold uppercase">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="neo-input mt-1" required /></div>
          <div><label className="text-xs font-semibold uppercase">Course Name</label><input value={courseName} onChange={e => setCourseName(e.target.value)} className="neo-input mt-1" required /></div>
          <div><label className="text-xs font-semibold uppercase">Course Code</label><input value={courseCode} onChange={e => setCourseCode(e.target.value)} className="neo-input mt-1" required /></div>
          <div><label className="text-xs font-semibold uppercase">Price</label><input value={price} onChange={e => setPrice(e.target.value)} className="neo-input mt-1" required /></div>
          <div><label className="text-xs font-semibold uppercase">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="neo-input mt-1 h-20 resize-none" /></div>
          <div><label className="text-xs font-semibold uppercase">Images (up to 5)</label><ImageUpload images={images} onChange={setImages} maxImages={5} /></div>
          <button type="submit" disabled={saving} className="neo-btn bg-purple-600 border-purple-600 w-full">{saving ? "Saving..." : "Update Note"}</button>
        </form>
      </div>
    </div>
  );
}