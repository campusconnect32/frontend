import { useState } from "react";
import { X, MapPin, Cake, Heart, Users, ArrowLeft, Navigation, GraduationCap, Baby, Briefcase, Wine, Cigarette, Shield, Maximize2, Flag, Ban, Lock } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import blueTick from "../assets/blue.png";
import goldBadge from "../assets/gold.png";
import platinumBadge from "../assets/platinum.png";
import ReportButton from "@/components/ReportButton";

export default function ProfileModal({ profile, onClose, isViewerPremium = false }) {
  const [zoomedImage, setZoomedImage] = useState(null);

  if (!profile) return null;

  const age = profile.date_of_birth
    ? Math.floor((new Date() - new Date(profile.date_of_birth)) / 31557600000)
    : null;
  const images = [profile.profile_image, ...(profile.gallery_images || [])].filter(Boolean);
  const interests = profile.interests?.split(',').filter(Boolean) || [];

  const isGPSLocation = profile.location_source === 'gps';
  const hasGPS = profile.gps_latitude !== null && profile.gps_latitude !== undefined;
  const isLocationStale = profile.gps_verified_at && (new Date() - new Date(profile.gps_verified_at)) > 24 * 60 * 60 * 1000;

  const lastActiveText = profile.last_active
    ? (() => {
        const now = new Date();
        const active = new Date(profile.last_active);
        const diffMs = now - active;
        const seconds = Math.floor(diffMs / 1000);
        if (seconds < 60) return "Active just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `Active ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Active ${hours} hour${hours > 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `Active ${days} day${days > 1 ? 's' : ''} ago`;
        if (days < 30) {
          const weeks = Math.floor(days / 7);
          return `Active ${weeks} week${weeks > 1 ? 's' : ''} ago`;
        }
        if (days < 365) {
          const months = Math.floor(days / 30);
          return `Active ${months} month${months > 1 ? 's' : ''} ago`;
        }
        const years = Math.floor(days / 365);
        return `Active ${years} year${years > 1 ? 's' : ''} ago`;
      })()
    : "Active recently";

  const isImageLocked = (index) => {
    if (isViewerPremium) return false;
    if (profile.lock_all_images) return true;
    return index >= 2;
  };

  const badges = [];
  if (profile.verified) {
    badges.push(
      <img key="blue" src={blueTick} alt="verified" className="w-5 h-5 inline-block" />
    );
  }
  if (profile.premium_tier === "gold") {
    badges.push(
      <img key="gold" src={goldBadge} alt="gold" className="w-5 h-5 inline-block ml-1" />
    );
  } else if (profile.premium_tier === "platinum") {
    badges.push(
      <img key="platinum" src={platinumBadge} alt="platinum" className="w-5 h-5 inline-block ml-1" />
    );
  }

  const handleReport = async () => {
    try {
      await api.post("/report", { reported_user_id: profile.user_id, reason: "Inappropriate" });
      toast.success("User reported");
    } catch (err) {
      toast.error("Failed to report");
    }
  };

  const handleBlock = async () => {
    if (!window.confirm("Block this user? You will be unmatched and won't see them again.")) return;
    try {
      await api.post("/block", { blocked_user_id: profile.user_id });
      toast.success("User blocked");
      onClose();
    } catch (err) {
      toast.error("Failed to block");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <div
              className="aspect-[4/5] overflow-hidden rounded-t-2xl bg-[#F5F3EE] cursor-pointer group"
              onClick={() => {
                if (!isImageLocked(0) && images[0]) setZoomedImage(images[0]);
              }}
            >
              {images[0] ? (
                <div className="relative w-full h-full">
                  <img
                    src={images[0]}
                    alt=""
                    className={`w-full h-full object-cover ${isImageLocked(0) ? "blur-md brightness-50" : ""}`}
                  />
                  {isImageLocked(0) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                      <Lock className="w-8 h-8 text-white mb-2" />
                      <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">Premium</span>
                    </div>
                  )}
                  {!isImageLocked(0) && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">👤</div>
              )}
            </div>

            <div className="absolute top-3 left-3 z-20">
              <ReportButton
                type="photo"
                reportedUserId={profile.user_id}
                imageIndex={0}
              />
            </div>

            <button onClick={onClose} className="absolute top-3 left-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              style={{ left: '3rem' }}>
              <ArrowLeft className="w-5 h-5" />
            </button>

            {hasGPS && (
              <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${isLocationStale ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                <Navigation className="w-3 h-3" />
                {isLocationStale ? 'Location may be outdated' : 'Live location'}
              </div>
            )}
          </div>

          <div className="p-5 space-y-5">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {profile.display_name || 'Anonymous'}
                {age && <span className="text-[#6B6B70] text-lg font-normal">{age} years</span>}
                {badges.length > 0 && <span className="flex items-center gap-1">{badges}</span>}
              </h2>
              <div className="text-xs text-[#6B6B70] mt-1">{lastActiveText}</div>

              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  {profile.country && (
                    <div className="flex items-center gap-1 text-[#6B6B70] text-sm">
                      <MapPin className="w-3.5 h-3.5" /> 
                      <span>{profile.country}</span>
                      {profile.city && <span>, {profile.city}</span>}
                    </div>
                  )}
                  {profile.distance_km != null && (
                    <div className="flex items-center gap-1 text-[#6B6B70] text-sm">
                      <Navigation className="w-3.5 h-3.5" />
                      {profile.distance_km <= 0.1 ? "Nearby" : `${profile.distance_km} km away`}
                    </div>
                  )}
                </div>
                
                {hasGPS && (
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${isLocationStale ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <p className="text-xs text-[#6B6B70]">
                      {isGPSLocation ? '📍 Live location' : '📍 Approximate location'}
                      {isLocationStale && ' (may need refresh)'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {profile.gender && (
                <span className="chip chip-mint text-xs">{profile.gender}</span>
              )}
              {profile.looking_for && (
                <span className="chip chip-accent text-xs flex items-center gap-1">
                  {profile.looking_for.includes('Dating') ? <Heart className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                  {profile.looking_for}
                </span>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#E7E5E0]">
              <button onClick={handleReport} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-lg">
                <Flag className="w-3.5 h-3.5" /> Report User
              </button>
              <button onClick={handleBlock} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-lg">
                <Ban className="w-3.5 h-3.5" /> Block
              </button>
            </div>

            {(profile.education || profile.employment || profile.kids || profile.want_kids || profile.smoke || profile.drink) && (
              <div>
                <h3 className="text-sm font-semibold text-[#0F0F10] mb-2">Lifestyle</h3>
                <div className="grid grid-cols-2 gap-2">
                  {profile.education && (
                    <div className="flex items-center gap-2 text-sm text-[#6B6B70]">
                      <GraduationCap className="w-4 h-4" />
                      <span>{profile.education}</span>
                    </div>
                  )}
                  {profile.employment && (
                    <div className="flex items-center gap-2 text-sm text-[#6B6B70]">
                      <Briefcase className="w-4 h-4" />
                      <span>{profile.employment}</span>
                    </div>
                  )}
                  {profile.kids && (
                    <div className="flex items-center gap-2 text-sm text-[#6B6B70]">
                      <Baby className="w-4 h-4" />
                      <span>{profile.kids === 'have' ? 'Has kids' : 'No kids'}</span>
                    </div>
                  )}
                  {profile.want_kids && profile.want_kids !== '' && (
                    <div className="flex items-center gap-2 text-sm text-[#6B6B70]">
                      <Baby className="w-4 h-4" />
                      <span>Wants kids: {profile.want_kids === 'yes' ? 'Yes' : profile.want_kids === 'no' ? 'No' : 'Maybe'}</span>
                    </div>
                  )}
                  {profile.smoke && profile.smoke !== '' && (
                    <div className="flex items-center gap-2 text-sm text-[#6B6B70]">
                      <Cigarette className="w-4 h-4" />
                      <span>Smoking: {profile.smoke === 'yes' ? 'Smokes' : profile.smoke === 'no' ? 'Non-smoker' : 'Sometimes'}</span>
                    </div>
                  )}
                  {profile.drink && profile.drink !== '' && (
                    <div className="flex items-center gap-2 text-sm text-[#6B6B70]">
                      <Wine className="w-4 h-4" />
                      <span>Drinking: {profile.drink === 'yes' ? 'Drinks' : profile.drink === 'no' ? 'Non-drinker' : 'Socially'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {profile.bio && (
              <div>
                <h3 className="text-sm font-semibold text-[#0F0F10] mb-1.5">About</h3>
                <p className="text-[#404040] text-sm leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {interests.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[#0F0F10] mb-2">Interests</h3>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((int, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#F3E8FF] text-[#7C3AED] rounded-full text-xs font-medium">
                      {int.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {images.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold text-[#0F0F10] mb-2">Photos ({images.length - 1})</h3>
                <div className="grid grid-cols-3 gap-2">
                  {images.slice(1, 7).map((img, i) => {
                    const idx = i + 1;
                    const locked = isImageLocked(idx);
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-lg overflow-hidden bg-[#F5F3EE] relative cursor-pointer"
                        onClick={() => { if (!locked) setZoomedImage(img); }}
                      >
                        <img
                          src={img}
                          alt={`Gallery ${i + 1}`}
                          className={`w-full h-full object-cover ${locked ? "blur-md brightness-50" : "hover:opacity-90 transition-opacity"}`}
                        />
                        {locked && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                            <Lock className="w-5 h-5 text-white mb-1" />
                            <span className="text-white text-[10px] font-medium bg-black/50 px-2 py-0.5 rounded-full">Premium</span>
                          </div>
                        )}

                        <div className="absolute top-1 right-1 z-10">
                          <ReportButton
                            type="photo"
                            reportedUserId={profile.user_id}
                            imageIndex={idx}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {images.length - 1 > 6 && (
                    <div className="aspect-square rounded-lg overflow-hidden bg-[#F3E8FF] flex items-center justify-center text-sm font-medium text-[#7C3AED]">
                      +{images.length - 7}
                    </div>
                  )}
                </div>
              </div>
            )}

            {profile.gps_verified_at && !isLocationStale && (
              <div className="pt-2 border-t border-[#E7E5E0]">
                <div className="flex items-center justify-center gap-1 text-xs text-[#6B6B70]">
                  <Shield className="w-3 h-3 text-[#3A7D44]" />
                  <span>Verified location · {new Date(profile.gps_verified_at).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {zoomedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}