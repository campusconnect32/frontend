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
  const [customCategory, setCustomCategory] = useState("");
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/marketplace/categories")
      .then(res => setCategories(res.data || []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = category === "__custom__" ? customCategory.trim() : category;
    if (!title.trim() || !price.trim() || !finalCategory) {
      return toast.error("Title, price, and category are required");
    }
    setSaving(true);
    try {
      await api.post("/marketplace/items", {
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        category: finalCategory,
        images,
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
            <input value={title} onChange={e => setTitle(e.target.value)} className="neo-input mt-1" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Description (shown in info dialog)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="neo-input mt-1 h-20 resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Price</label>
            <input value={price} onChange={e => setPrice(e.target.value)} className="neo-input mt-1" placeholder="e.g. R2500 or Free" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="neo-input mt-1"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="__custom__">➕ Create your own...</option>
            </select>
          </div>

          {/* Custom category input */}
          {category === "__custom__" && (
            <div>
              <label className="text-xs font-semibold uppercase">Your Category Name</label>
              <input
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                className="neo-input mt-1"
                placeholder="e.g. Sneakers"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase">Images (up to 5)</label>
            <ImageUpload images={images} onChange={setImages} maxImages={5} />
          </div>
          <button type="submit" disabled={saving} className="neo-btn bg-purple-600 border-purple-600 w-full">
            {saving ? "Creating..." : "Post Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}