import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ImageUpload from "@/components/ImageUpload";
import { useAuth } from "@/contexts/AuthContext";
import { setupProfile, requestAndUpdateGPS, ipLocationFallback } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";

const STEPS = ["Location", "About You", "Photos"];

export default function ProfileSetup() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [locationSet, setLocationSet] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationText, setLocationText] = useState("Set your location");

  // Form state
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [gender, setGender] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [course, setCourse] = useState("");
  const [campus, setCampus] = useState("");
  const [profileImage, setProfileImage] = useState(user?.picture || "");
  const [galleryImages, setGalleryImages] = useState([]);

  const canGoNext = () => {
    if (step === 0) {
      if (!locationSet) {
        toast.error("Please set your location before continuing");
        return false;
      }
      return true;
    }
    if (step === 1) {
      if (!dateOfBirth.trim()) { toast.error("Date of Birth is required"); return false; }
      // Age validation (optional but recommended)
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      if (age < 18) { toast.error("You must be at least 18 years old"); return false; }
      if (age > 100) { toast.error("Age must be 100 or less"); return false; }

      if (!gender) { toast.error("Gender is required"); return false; }
      if (!yearOfStudy.trim()) { toast.error("Year of Study is required"); return false; }
      if (!course.trim()) { toast.error("Course is required"); return false; }
      if (!campus.trim()) { toast.error("Campus is required"); return false; }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        date_of_birth: dateOfBirth,
        display_name: displayName,
        gender,
        year_of_study: yearOfStudy,
        course,
        campus,
        profile_image: profileImage,
        gallery_images: galleryImages,
      };
      await setupProfile(payload);
      await refresh();
      toast.success("Profile created!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLocation = async () => {
    setLocationLoading(true);
    try {
      const result = await requestAndUpdateGPS();
      if (result.ok) {
        toast.success("Location updated!", { description: `📍 ${result.city}, ${result.country}` });
        setLocationText(`${result.city}, ${result.country}`);
        setLocationSet(true);
        return;
      }
      throw new Error("GPS failed");
    } catch (gpsError) {
      try {
        const ipResult = await ipLocationFallback();
        if (ipResult.ok) {
          toast.warning("Using approximate location");
          const loc = `${ipResult.city || ''} ${ipResult.country || ''}`.trim();
          setLocationText(loc || "Approximate location set");
          setLocationSet(true);
          return;
        }
        throw new Error("IP fallback failed");
      } catch (ipError) {
        toast.error("Unable to set location");
      }
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-2 flex-1 rounded-full ${i <= step ? "bg-purple-600" : "bg-[#E7E5E0]"}`} />
              <span className={`text-xs whitespace-nowrap ${i <= step ? "text-purple-600 font-medium" : "text-[#6B6B70]"}`}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Step 0: Location */}
        {step === 0 && (
          <div className="bg-white border border-[#E7E5E0] rounded-2xl p-6 text-center space-y-4">
            <MapPin className="w-12 h-12 mx-auto text-purple-600" />
            <h2 className="font-semibold text-lg">Enable Location <span className="text-red-500">*</span></h2>
            <p className="text-sm text-[#6B6B70]">
              Your location is required. We only share approximate distances – never your exact address.
            </p>
            <button
              onClick={handleUpdateLocation}
              disabled={locationLoading}
              className="neo-btn bg-purple-600 border-purple-600 !px-8 !py-3 !text-base !rounded-full"
            >
              {locationLoading ? "Updating..." : locationSet ? locationText : "Set your location"}
            </button>
            {locationSet && (
              <p className="text-xs text-green-600 font-medium">✓ Location set – {locationText}</p>
            )}
          </div>
        )}

        {/* Step 1: About You */}
        {step === 1 && (
          <div className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">About You</h2>

            <div>
              <label className="text-xs font-semibold uppercase">Display Name</label>
              <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="neo-input mt-1" placeholder="How you'll appear" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase">Date of Birth <span className="text-red-500">*</span></label>
              <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="neo-input mt-1" required />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase">Gender <span className="text-red-500">*</span></label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="neo-input mt-1">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase">Year of Study <span className="text-red-500">*</span></label>
              <input value={yearOfStudy} onChange={e => setYearOfStudy(e.target.value)} className="neo-input mt-1" placeholder="e.g. 2nd Year" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase">Course <span className="text-red-500">*</span></label>
              <input value={course} onChange={e => setCourse(e.target.value)} className="neo-input mt-1" placeholder="e.g. Computer Science" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase">Campus <span className="text-red-500">*</span></label>
              <input value={campus} onChange={e => setCampus(e.target.value)} className="neo-input mt-1" placeholder="e.g. Main Campus" />
            </div>
          </div>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <div className="bg-white border border-[#E7E5E0] rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">Photos</h2>
            <div>
              <label className="text-xs font-semibold uppercase">Profile Image</label>
              <ImageUpload images={profileImage ? [profileImage] : []} onChange={(imgs) => setProfileImage(imgs[0] || "")} maxImages={1} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase">Gallery (up to 5)</label>
              <ImageUpload images={galleryImages} onChange={setGalleryImages} maxImages={5} />
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button onClick={handleBack} disabled={step === 0} className="neo-btn neo-btn-secondary">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={handleNext} className="neo-btn bg-purple-600 border-purple-600">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={saving} className="neo-btn bg-green-600 border-green-600">
              {saving ? "Saving..." : "Complete Profile"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}