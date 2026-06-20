import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import Navbar from "@/components/Navbar";

export default function BursaryEdit() {
  const { bursaryId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/bursaries/${bursaryId}`)
      .then(res => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setLink(res.data.link);
        setImage(res.data.image || "");
      })
      .catch(() => {
        toast.error("Bursary not found");
        navigate("/bursaries");
      })
      .finally(() => setLoading(false));
  }, [bursaryId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title required");
    setSaving(true);
    try {
      await api.put(`/bursaries/${bursaryId}`, {
        title: title.trim(),
        description: description.trim(),
        link: link.trim(),
        image,
      });
      toast.success("Updated!");
      navigate("/bursaries");
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
        <h1 className="font-display text-2xl font-semibold mb-6">Edit Opportunity</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
          <div><label className="text-xs font-semibold uppercase">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="neo-input mt-1" required /></div>
          <div><label className="text-xs font-semibold uppercase">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="neo-input mt-1 h-20 resize-none" /></div>
          <div><label className="text-xs font-semibold uppercase">Link (optional)</label><input value={link} onChange={e => setLink(e.target.value)} className="neo-input mt-1" placeholder="https://..." /></div>
          <div><label className="text-xs font-semibold uppercase">Image (optional)</label><ImageUpload images={image ? [image] : []} onChange={imgs => setImage(imgs[0] || "")} maxImages={1} /></div>
          <button type="submit" disabled={saving} className="neo-btn bg-purple-600 border-purple-600 w-full">{saving ? "Saving..." : "Update Post"}</button>
        </form>
      </div>
    </div>
  );
}