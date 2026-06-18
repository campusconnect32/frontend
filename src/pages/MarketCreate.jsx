import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import Navbar from "@/components/Navbar";

export default function MarketCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/marketplace/categories")
      .then(res => setCategories(res.data || []))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !price.trim() || !category) {
      return toast.error("Title, price, and category are required");
    }
    setSaving(true);
    try {
      await api.post("/marketplace/items", {
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        category,
        image,
      });
      toast.success("Listing created!");
      navigate("/market");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create listing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-semibold mb-6">Create a Listing</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="neo-input mt-1" placeholder="e.g. iPhone 12" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="neo-input mt-1 h-20 resize-none" placeholder="Condition, details..." />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Price</label>
            <input value={price} onChange={e => setPrice(e.target.value)} className="neo-input mt-1" placeholder="e.g. R2500 or Free" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="neo-input mt-1" required>
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Image (optional)</label>
            <ImageUpload images={image ? [image] : []} onChange={(imgs) => setImage(imgs[0] || "")} maxImages={1} />
          </div>
          <button type="submit" disabled={saving} className="neo-btn bg-purple-600 border-purple-600 w-full">
            {saving ? "Creating..." : "Post Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}