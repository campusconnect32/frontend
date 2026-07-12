import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ImageUpload from "@/components/ImageUpload";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Save, Edit3, X, Camera, MapPin, Trash2, Building } from "lucide-react";
import { getProfile, updateProfile } from "@/lib/api"; // added imports

const Profile = React.memo(() => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const profilePicInputRef = useRef(null);

  // Default fallback values
  const defaultDisplayName = user?.name || user?.email?.split("@")[0] || "User";
  const defaultEmail = user?.email || "No email";
  const defaultProfileImage =
    user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(defaultDisplayName)}&background=7C3AED&color=fff`;

  // Form state – will be populated from backend
  const [form, setForm] = useState({
    display_name: defaultDisplayName,
    date_of_birth: "",
    gender: "",
    year_of_study: "",
    course: "",
    campus: "",
    gallery_images: [],
    profile_image: defaultProfileImage,
  });

  // Current profile state (displayed when not editing)
  const [profile, setProfile] = useState({
    display_name: defaultDisplayName,
    email: defaultEmail,
    date_of_birth: "",
    gender: "",
    year_of_study: "",
    course: "",
    campus: "",
    gallery_images: [],
    profile_image: defaultProfileImage,
  });

  // Fetch full profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const updatedProfile = {
          display_name: data.display_name || defaultDisplayName,
          email: data.email || defaultEmail,
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          year_of_study: data.year_of_study || "",
          course: data.course || "",
          campus: data.campus || "",
          gallery_images: data.gallery_images || [],
          profile_image: data.profile_image || data.picture || defaultProfileImage,
        };
        setProfile(updatedProfile);
        setForm(updatedProfile); // sync form with fetched data
      } catch (err) {
        toast.error("Could not load profile");
      }
    };
    fetchProfile();
  }, []);

  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Build payload matching backend's ProfileUpdatePayload
      const payload = {
        display_name: form.display_name,
        date_of_birth: form.date_of_birth || undefined,
        gender: form.gender,
        year_of_study: form.year_of_study,
        course: form.course,
        campus: form.campus,
        profile_image: form.profile_image,
        gallery_images: form.gallery_images,
      };

      await updateProfile(payload);
      setProfile(form); // update displayed profile on success
      setEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField("profile_image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Permanently delete your account and all data? This cannot be undone.")) return;
    // You would typically call an API endpoint for deletion here
    toast.success("Account deleted (demo)");
    await logout();
  };

  const age = profile.date_of_birth
    ? Math.floor((new Date() - new Date(profile.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  const savedUniversity = localStorage.getItem("selectedUniversity");
  const currentUniversity = savedUniversity ? JSON.parse(savedUniversity) : null;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold">My Profile</h1>
          <button
            onClick={() => {
              if (editing) {
                // Cancel editing: reset form to current profile
                setForm(profile);
                setEditing(false);
              } else {
                setEditing(true);
              }
            }}
            className="neo-btn"
          >
            {editing ? (
              <><X className="w-4 h-4" /> Cancel</>
            ) : (
              <><Edit3 className="w-4 h-4" /> Edit</>
            )}
          </button>
        </div>

        {/* University Info – Display Only */}
        {currentUniversity && (
          <div className="bg-white border border-[#1a237e]/20 rounded-2xl p-4 mb-4 bg-[#1a237e]/5">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-[#1a237e]" />
              <div>
                <div className="text-sm font-medium text-[#1a237e]">Your University</div>
                <div className="text-sm text-[#6B6B70]">{currentUniversity.name}</div>
              </div>
            </div>
          </div>
        )}

        {/* Location Status – could be expanded */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#6B6B70]" />
            <div>
              <div className="text-sm font-medium">Location</div>
              <div className="text-xs text-[#6B6B70]">Not set</div>
            </div>
          </div>
          <button className="text-xs bg-white border border-[#E7E5E0] px-3 py-1.5 rounded-lg hover:bg-[#F5F3EE] transition-colors">
            Update Location
          </button>
        </div>

        {/* Avatar & Name */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 flex-shrink-0">
                <img
                  src={form.profile_image || defaultProfileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {editing && (
                <button
                  onClick={() => profilePicInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#0F0F10] rounded-full flex items-center justify-center text-white"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input
                ref={profilePicInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <input
                  value={form.display_name}
                  onChange={e => updateField("display_name", e.target.value)}
                  className="w-full text-xl font-semibold border rounded-lg px-3 py-1"
                  placeholder="Your name"
                />
              ) : (
                <h2 className="text-xl font-semibold truncate">{profile.display_name}</h2>
              )}
              <p className="text-sm text-[#6B6B70] truncate">{profile.email}</p>
              {age && <p className="text-sm text-[#6B6B70]">{age} years</p>}
            </div>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-5 mb-4">
          <label className="text-xs font-semibold uppercase text-[#6B6B70]">Date of Birth</label>
          {editing ? (
            <input
              type="date"
              value={form.date_of_birth || ""}
              onChange={e => updateField("date_of_birth", e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          ) : (
            <p className="text-sm">{profile.date_of_birth || "Not set"}</p>
          )}
        </div>

        {/* Student Info – all fields */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-5 mb-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase text-[#6B6B70]">Student Info</h3>

          <div>
            <label className="text-xs font-semibold uppercase text-[#6B6B70]">Gender</label>
            {editing ? (
              <select
                value={form.gender || ""}
                onChange={e => updateField("gender", e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              >
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
            <label className="text-xs font-semibold uppercase text-[#6B6B70]">Year of Study</label>
            {editing ? (
              <input
                value={form.year_of_study || ""}
                onChange={e => updateField("year_of_study", e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="e.g. 2nd Year"
              />
            ) : (
              <p className="text-sm">{profile.year_of_study || "Not set"}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-[#6B6B70]">Course</label>
            {editing ? (
              <input
                value={form.course || ""}
                onChange={e => updateField("course", e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="e.g. Computer Science"
              />
            ) : (
              <p className="text-sm">{profile.course || "Not set"}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-[#6B6B70]">Campus</label>
            {editing ? (
              <input
                value={form.campus || ""}
                onChange={e => updateField("campus", e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="e.g. Main Campus"
              />
            ) : (
              <p className="text-sm">{profile.campus || "Not set"}</p>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-5 mb-4">
          <label className="text-xs font-semibold uppercase text-[#6B6B70] block mb-2">Gallery</label>
          {editing ? (
            <ImageUpload
              images={form.gallery_images || []}
              onChange={imgs => updateField("gallery_images", imgs)}
              maxImages={5}
            />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {(profile.gallery_images || []).map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {(!profile.gallery_images || profile.gallery_images.length === 0) && (
                <p className="col-span-3 text-sm text-[#6B6B70]">No gallery images</p>
              )}
            </div>
          )}
        </div>

        {editing && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#7C3AED] text-white py-3 rounded-xl font-semibold hover:bg-[#6D2FED] transition-colors"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4 inline mr-2" />
                Save Changes
              </>
            )}
          </button>
        )}

        {/* Delete Account */}
        <div className="mt-8 text-center">
          <button
            onClick={handleDeleteAccount}
            className="text-sm text-red-500 hover:text-red-600 underline flex items-center justify-center gap-1 mx-auto"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </main>
    </div>
  );
});

export default Profile;