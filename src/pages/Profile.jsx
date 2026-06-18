import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ImageUpload from "@/components/ImageUpload";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile, getLocationStatus, requestAndUpdateGPS, ipLocationFallback, api } from "@/lib/api";
import { toast } from "sonner";
import { Save, Edit3, X, Camera, MapPin, RefreshCw, Trash2 } from "lucide-react";

const Profile = React.memo(() => {
  const { user, refresh, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [locationStatus, setLocationStatus] = useState({ hasLocation: false, isStale: false, loading: false });
  const profilePicInputRef = useRef(null);

  const loadProfile = useCallback(async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setForm(data);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  }, []);

  const checkLocationStatus = useCallback(async () => {
    try {
      const status = await getLocationStatus();
      setLocationStatus({
        hasLocation: status.has_location,
        isStale: status.is_stale || false,
        loading: false
      });
    } catch (err) {
      console.error("Failed to check location status:", err);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    checkLocationStatus();
  }, [loadProfile, checkLocationStatus]);

  const handleRefreshLocation = async () => {
    setLocationStatus(prev => ({ ...prev, loading: true }));
    try {
      const result = await requestAndUpdateGPS();
      if (result.ok) {
        toast.success("Location updated!", { description: `📍 ${result.city}, ${result.country}` });
        await loadProfile();
        await checkLocationStatus();
        await refresh();
        return;
      }
    } catch {
      try {
        const ipResult = await ipLocationFallback();
        if (ipResult.ok) {
          toast.warning("Using approximate location");
          await loadProfile();
          await checkLocationStatus();
          await refresh();
          return;
        }
      } catch {}
    }
    setLocationStatus(prev => ({ ...prev, loading: false }));
    toast.error("Unable to update location");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      await refresh();
      setProfile(form);
      setEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("profile_image", reader.result);
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Permanently delete your account and all data? This cannot be undone.")) return;
    try {
      await api.delete("/auth/me");
      toast.success("Account permanently deleted");
      await logout();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete account");
    }
  };

  if (!profile) return <div className="min-h-screen"><Navbar /><div className="p-8 text-center">Loading...</div></div>;

  const age = profile.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : null;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold">My Profile</h1>
          <button onClick={() => setEditing(!editing)} className={`neo-btn ${editing ? "neo-btn-secondary" : ""}`}>
            {editing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit3 className="w-4 h-4" /> Edit</>}
          </button>
        </div>

        {/* Location Status Card */}
        <div className={`rounded-xl p-4 mb-4 flex items-center justify-between ${locationStatus.hasLocation && !locationStatus.isStale ? 'bg-[#E8F1EC] border border-[#3A7D44]' : 'bg-[#FEFCE8] border border-[#FDE68A]'}`}>
          <div className="flex items-center gap-3">
            <MapPin className={`w-5 h-5 ${locationStatus.hasLocation && !locationStatus.isStale ? 'text-[#3A7D44]' : 'text-[#B8860B]'}`} />
            <div>
              <div className="text-sm font-medium">
                {!locationStatus.hasLocation ? "Location not set" : locationStatus.isStale ? "Location expired" : "Location active"}
              </div>
              <div className="text-xs text-[#6B6B70]">
                {profile.country ? `${profile.city ? `${profile.city}, ` : ''}${profile.country}` : "Using GPS location"}
              </div>
            </div>
          </div>
          <button
            onClick={handleRefreshLocation}
            disabled={locationStatus.loading}
            className="flex items-center gap-1 text-xs bg-white border border-[#E7E5E0] px-3 py-1.5 rounded-lg hover:bg-[#F5F3EE] transition-colors"
          >
            {locationStatus.loading ? (
              <><div className="w-3 h-3 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" /> Updating...</>
            ) : (
              <><RefreshCw className="w-3 h-3" /> Update Location</>
            )}
          </button>
        </div>

        {/* Avatar */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2">
                <img src={form.profile_image || user?.picture} alt="" className="w-full h-full object-cover" />
              </div>
              {editing && (
                <button
                  onClick={() => profilePicInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#0F0F10] rounded-full flex items-center justify-center text-white"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input ref={profilePicInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
            </div>
            <div className="flex-1">
              {editing ? (
                <input value={form.display_name || ""} onChange={e => updateField("display_name", e.target.value)} className="neo-input text-xl font-semibold" />
              ) : (
                <h2 className="text-xl font-semibold">{profile.display_name || profile.name}</h2>
              )}
              <p className="text-sm text-[#6B6B70]">{user?.email}</p>
              {age && <p className="text-sm text-[#6B6B70]">{age} years</p>}
            </div>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-5 mb-4">
          <label className="text-xs font-semibold uppercase">Date of Birth</label>
          {editing ? (
            <input type="date" value={form.date_of_birth || ""} onChange={e => updateField("date_of_birth", e.target.value)} className="neo-input mt-1" />
          ) : (
            <p className="text-sm">{profile.date_of_birth || "Not set"}</p>
          )}
        </div>

        {/* Student Info Section */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-5 mb-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase text-[#6B6B70]">Student Info</h3>

          <div>
            <label className="text-xs font-semibold uppercase">Gender</label>
            {editing ? (
              <select value={form.gender || ""} onChange={e => updateField("gender", e.target.value)} className="neo-input mt-1">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-sm">{profile.gender || "Not set"}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase">Year of Study</label>
            {editing ? (
              <input value={form.year_of_study || ""} onChange={e => updateField("year_of_study", e.target.value)} className="neo-input mt-1" placeholder="e.g. 2nd Year" />
            ) : (
              <p className="text-sm">{profile.year_of_study || "Not set"}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase">Course</label>
            {editing ? (
              <input value={form.course || ""} onChange={e => updateField("course", e.target.value)} className="neo-input mt-1" placeholder="e.g. Computer Science" />
            ) : (
              <p className="text-sm">{profile.course || "Not set"}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase">Campus</label>
            {editing ? (
              <input value={form.campus || ""} onChange={e => updateField("campus", e.target.value)} className="neo-input mt-1" placeholder="e.g. Main Campus" />
            ) : (
              <p className="text-sm">{profile.campus || "Not set"}</p>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-5 mb-4">
          <label className="text-xs font-semibold uppercase mb-2 block">Gallery</label>
          {editing ? (
            <ImageUpload images={form.gallery_images || []} onChange={imgs => updateField("gallery_images", imgs)} maxImages={5} />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {(profile.gallery_images || []).map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border"><img src={img} alt="" className="w-full h-full object-cover" /></div>
              ))}
              {(!profile.gallery_images || profile.gallery_images.length === 0) && <p className="col-span-3 text-sm text-[#6B6B70]">No gallery images</p>}
            </div>
          )}
        </div>

        {editing && (
          <button onClick={handleSave} disabled={saving} className="neo-btn w-full bg-[#7C3AED] border-[#7C3AED]">
            {saving ? "Saving..." : "Save Changes"} <Save className="w-4 h-4" />
          </button>
        )}

        {/* Delete Account – immediate */}
        <div className="mt-8 text-center">
          <button
            onClick={handleDeleteAccount}
            className="text-sm text-red-500 hover:text-red-600 underline flex items-center justify-center gap-1"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </main>
    </div>
  );
});

export default Profile;