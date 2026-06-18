import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Users, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function ClubDetail() {
  const { clubId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [myMembership, setMyMembership] = useState(null);

  const [joinProof, setJoinProof] = useState("");
  const [joining, setJoining] = useState(false);
  const proofInputRef = useRef(null);

  // For viewing proof images
  const [viewProofUrl, setViewProofUrl] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("Request timed out. Please check your connection.");
    }, 12000);

    const fetchData = async () => {
      try {
        const [clubRes, membersRes] = await Promise.all([
          api.get(`/clubs/${clubId}`, { signal: controller.signal }),
          api.get(`/clubs/${clubId}/members`, { signal: controller.signal }),
        ]);

        setClub(clubRes.data);
        setMembers(membersRes.data || []);

        const me = (membersRes.data || []).find(m => m.user_id === user?.user_id);
        setMyMembership(me || null);
        setIsAdmin(me?.role === "admin" && me?.status === "approved");
      } catch (err) {
        if (err.name === "AbortError" || err.code === "ERR_CANCELED") return;
        setError(err.response?.data?.detail || err.message);
        toast.error("Could not load club details");
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [clubId, user?.user_id]);

  const handleProofFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setJoinProof(reader.result);
    reader.readAsDataURL(file);
  };

  const handleJoin = async () => {
    if (!joinProof) return toast.error("Please select a proof image");
    setJoining(true);
    try {
      await api.post(`/clubs/${clubId}/join`, { proof_image: joinProof });
      toast.success("Request sent!");
      setJoinProof("");
      const res = await api.get(`/clubs/${clubId}/members`);
      setMembers(res.data || []);
      const me = (res.data || []).find(m => m.user_id === user?.user_id);
      setMyMembership(me || null);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send request");
    } finally {
      setJoining(false);
    }
  };

  const handleMemberAction = async (targetUserId, action, value = null) => {
    const payload = {};
    if (action === "approve") payload.status = "approved";
    else if (action === "reject") payload.status = "rejected";
    else if (action === "promote") payload.role = "admin";
    else if (action === "demote") payload.role = "member";
    else if (action === "suspend") payload.suspend_hours = value;
    else if (action === "unsuspend") payload.suspend_hours = 0;

    try {
      await api.put(`/clubs/${clubId}/members/${targetUserId}`, payload);
      const res = await api.get(`/clubs/${clubId}/members`);
      setMembers(res.data || []);
      toast.success("Done");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed");
    }
  };

  const handleRemove = async (targetUserId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await api.delete(`/clubs/${clubId}/members/${targetUserId}`);
      const res = await api.get(`/clubs/${clubId}/members`);
      setMembers(res.data || []);
      toast.success("Removed");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="neo-btn neo-btn-secondary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!club) return null;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="neo-btn neo-btn-ghost mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden mb-8">
          <div className="aspect-video bg-[#F5F3EE] flex items-center justify-center">
            {club.image ? (
              <img src={club.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl">🏛️</span>
            )}
          </div>
          <div className="p-6">
            <h1 className="font-display text-2xl font-semibold">{club.title}</h1>
            <p className="text-sm text-[#6B6B70] mt-2">{club.description}</p>
            <p className="text-sm mt-2 flex items-center gap-1">
              <Users className="w-4 h-4" /> {club.member_count} members
            </p>

            {/* Join / membership status */}
            {!myMembership && (
              <div className="mt-4 p-4 bg-[#FAFAF7] rounded-xl border border-[#E7E5E0]">
                <p className="text-sm font-semibold mb-2">Join this club</p>
                <p className="text-xs text-[#6B6B70] mb-3">
                  Upload a screenshot of your proof of registration.
                </p>
                <input ref={proofInputRef} type="file" accept="image/*" className="hidden" onChange={handleProofFileChange} />
                <div className="flex items-center gap-3">
                  <button onClick={() => proofInputRef.current?.click()} className="neo-btn neo-btn-secondary !py-1.5 !px-4 text-xs">
                    Choose Image
                  </button>
                  {joinProof && (
                    <div className="flex items-center gap-2">
                      <img src={joinProof} alt="preview" className="h-10 w-10 object-cover rounded border" />
                      <span className="text-xs text-[#6B6B70]">Image selected</span>
                    </div>
                  )}
                </div>
                <button onClick={handleJoin} disabled={joining || !joinProof} className="neo-btn bg-purple-600 border-purple-600 w-full mt-4">
                  {joining ? "Sending..." : "Send Join Request"}
                </button>
              </div>
            )}

            {myMembership && myMembership.status === "pending" && (
              <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-xl text-sm">
                Your request is pending approval.
              </div>
            )}

            {myMembership && myMembership.status === "approved" && (
              <div className="mt-4 flex gap-2">
                <Link to={`/clubs/${clubId}/chat`} className="neo-btn bg-purple-600 border-purple-600">
                  Group Chat
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Members list */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-4">
            Members ({members.length})
          </h2>
          {members.map(m => (
            <div key={m.member_id} className="flex items-center justify-between py-3 border-b border-[#E7E5E0] last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  {m.profile_image ? (
                    <img src={m.profile_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                      {m.display_name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{m.display_name}</p>
                  <p className="text-xs text-[#6B6B70]">
                    {m.role}
                    {m.status !== "approved" ? ` · ${m.status}` : ""}
                  </p>
                </div>
              </div>

              {isAdmin && m.user_id !== user.user_id && (
                <div className="flex gap-1 items-center">
                  {/* Proof image preview for pending members */}
                  {m.status === "pending" && m.proof_image && (
                    <button
                      onClick={() => setViewProofUrl(m.proof_image)}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mr-1 hover:bg-gray-200"
                    >
                      View Proof
                    </button>
                  )}

                  {m.status === "pending" && (
                    <>
                      <button onClick={() => handleMemberAction(m.user_id, "approve")} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Approve
                      </button>
                      <button onClick={() => handleMemberAction(m.user_id, "reject")} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Reject
                      </button>
                    </>
                  )}
                  {m.status === "approved" && m.role === "member" && (
                    <button onClick={() => handleMemberAction(m.user_id, "promote")} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Make Admin
                    </button>
                  )}
                  {m.status === "approved" && m.role === "admin" && (
                    <button onClick={() => handleMemberAction(m.user_id, "demote")} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      Demote
                    </button>
                  )}
                  {m.status === "approved" && (
                    <select
                      className="text-xs border rounded px-1 py-0.5"
                      defaultValue=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "remove") handleRemove(m.user_id);
                        else if (val === "unsuspend") handleMemberAction(m.user_id, "unsuspend");
                        else if (val) handleMemberAction(m.user_id, "suspend", parseFloat(val));
                        e.target.value = "";
                      }}
                    >
                      <option value="">Suspend</option>
                      <option value="1">1 hour</option>
                      <option value="3">3 hours</option>
                      <option value="24">1 day</option>
                      <option value="48">2 days</option>
                      <option value="unsuspend">Unsuspend</option>
                      <option value="remove">Remove</option>
                    </select>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Proof image viewer modal */}
      {viewProofUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setViewProofUrl(null)}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewProofUrl(null)} className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
              <X className="w-5 h-5" />
            </button>
            <img src={viewProofUrl} alt="Proof" className="w-full rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}