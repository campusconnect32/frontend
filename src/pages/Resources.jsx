import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Search, Plus, Trash2, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

export default function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ course_name: "", course_code: "", google_drive_link: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchResources(); }, [search]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = search ? { search } : {};
      const res = await api.get("/resources", { params });
      setResources(res.data || []);
    } catch (err) {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course_name.trim() || !form.course_code.trim() || !form.google_drive_link.trim()) {
      return toast.error("All fields required");
    }
    setSubmitting(true);
    try {
      await api.post("/resources", form);
      toast.success("Resource added");
      setForm({ course_name: "", course_code: "", google_drive_link: "" });
      setShowForm(false);
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await api.delete(`/resources/${resourceId}`);
      setResources(prev => prev.filter(r => r.resource_id !== resourceId));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-semibold">📁 Resources</h1>
          <button onClick={() => setShowForm(!showForm)} className="neo-btn bg-purple-600 border-purple-600 !px-4 !py-2">
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by course code..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm"
          />
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 mb-6 space-y-4">
            <input className="neo-input" placeholder="Course Name" value={form.course_name} onChange={e => setForm({...form, course_name: e.target.value})} required />
            <input className="neo-input" placeholder="Course Code" value={form.course_code} onChange={e => setForm({...form, course_code: e.target.value})} required />
            <input className="neo-input" placeholder="Google Drive Link" value={form.google_drive_link} onChange={e => setForm({...form, google_drive_link: e.target.value})} required />
            <button type="submit" disabled={submitting} className="neo-btn bg-purple-600 border-purple-600 w-full">
              {submitting ? "Adding..." : "Add Resource"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No resources found.</div>
        ) : (
          <div className="space-y-4">
            {resources.map(res => (
              <div key={res.resource_id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{res.course_name} ({res.course_code})</h3>
                  <a href={res.google_drive_link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" /> Open Drive Link
                  </a>
                  {/* Removed the "by {res.submitted_by}" line */}
                </div>
                {(user?.user_id === res.user_id || user?.is_admin) && (
                  <button onClick={() => handleDelete(res.resource_id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}