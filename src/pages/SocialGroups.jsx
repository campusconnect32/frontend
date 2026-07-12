import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Plus, Search, Users, LogOut, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

export default function SocialGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", course_code: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllGroups();
    fetchMyGroups();
  }, [search]);

  const fetchAllGroups = async () => {
    try {
      const params = search ? { search } : {};
      const res = await api.get("/social/groups", { params });
      setGroups(res.data || []);
    } catch {
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGroups = async () => {
    try {
      const res = await api.get("/social/groups/my");
      setMyGroups(res.data || []);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.course_code.trim()) return toast.error("Name and course code required");
    setSubmitting(true);
    try {
      await api.post("/social/groups", form);
      toast.success("Group created!");
      setShowCreate(false);
      setForm({ name: "", description: "", course_code: "" });
      fetchAllGroups();
      fetchMyGroups();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (groupId) => {
    try {
      await api.post(`/social/groups/${groupId}/join`);
      toast.success("Joined");
      fetchAllGroups();
      fetchMyGroups();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed");
    }
  };

  const handleLeave = async (groupId) => {
    if (!window.confirm("Leave this group?")) return;
    try {
      await api.post(`/social/groups/${groupId}/leave`);
      toast.success("Left group");
      fetchAllGroups();
      fetchMyGroups();
    } catch {
      toast.error("Failed to leave");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-semibold">💬 Groups</h1>
          <button onClick={() => setShowCreate(!showCreate)} className="neo-btn bg-purple-600 border-purple-600 !px-4 !py-2">
            <Plus className="w-4 h-4 mr-2" /> Create Group
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

        {showCreate && (
          <form onSubmit={handleCreate} className="bg-white border rounded-xl p-6 mb-6 space-y-4">
            <input className="neo-input" placeholder="Group Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input className="neo-input" placeholder="Course Code" value={form.course_code} onChange={e => setForm({...form, course_code: e.target.value})} required />
            <textarea className="neo-input" placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} />
            <button type="submit" disabled={submitting} className="neo-btn bg-purple-600 border-purple-600 w-full">{submitting ? "Creating..." : "Create Group"}</button>
          </form>
        )}

        {/* My Groups Section */}
        {myGroups.length > 0 && (
          <div className="mb-8">
            <h2 className="font-semibold text-lg mb-4">My Groups</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myGroups.map(g => (
                <div key={g.group_id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <Link to={`/social/group/${g.group_id}`} className="font-semibold hover:underline">{g.name}</Link>
                    <p className="text-sm text-gray-500">{g.course_code} · {g.member_count} members</p>
                  </div>
                  <button onClick={() => handleLeave(g.group_id)} className="text-gray-400 hover:text-red-500"><LogOut className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Groups */}
        <h2 className="font-semibold text-lg mb-4">Discover Groups</h2>
        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No groups found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map(g => (
              <div key={g.group_id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <Link to={`/social/group/${g.group_id}`} className="font-semibold hover:underline">{g.name}</Link>
                  <p className="text-sm text-gray-500">{g.course_code} · {g.member_count} members</p>
                </div>
                {g.is_member ? (
                  <span className="text-green-500 flex items-center gap-1 text-sm"><Check className="w-4 h-4" /> Joined</span>
                ) : (
                  <button onClick={() => handleJoin(g.group_id)} className="neo-btn neo-btn-secondary !py-1 !px-3 text-xs">Join</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}