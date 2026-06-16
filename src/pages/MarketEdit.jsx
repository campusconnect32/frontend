import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import Navbar from "@/components/Navbar";

export default function MarketEdit() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/marketplace/categories")
      .then(res => setCategories(res.data || []))
      .catch(console.error);
    api.get(`/marketplace/items/${itemId}`)
      .then(res => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setPrice(res.data.price);
        setCategory(res.data.category);
        setImage(res.data.image || "");
      })
      .catch(() => {
        toast.error("Item not found");
        navigate("/market");
      })
      .finally(() => setLoading(false));
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !price.trim() || !category) {
      return toast.error("Title, price, and category are required");
    }
    setSaving(true);
    try {
      await api.put(`/marketplace/items/${itemId}`, {
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        category,
        image,
      });
      toast.success("Listing updated!");
      navigate(`/market/${itemId}`);
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
        <h1 className="font-display text-2xl font-semibold mb-6">Edit Listing</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="neo-input mt-1" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="neo-input mt-1 h-20 resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase">Price</label>
            <input value={price} onChange={e => setPrice(e.target.value)} className="neo-input mt-1" required />
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
            {saving ? "Saving..." : "Update Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}