import { useState } from "react";
import { MapPin, Heart, X, Users, Info, RotateCcw, ChevronLeft, ChevronRight, Navigation, Lock, Circle } from "lucide-react";
import blueTick from "../assets/blue.png";
import goldBadge from "../assets/gold.png";
import platinumBadge from "../assets/platinum.png";
import ReportButton from "@/components/ReportButton";

function timeAgo(date) {
  if (!date) return "";
  const now = new Date();
  const active = new Date(date);
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
}

export default function ProfileCard({ profile, onSwipe, onInfo, onUndo, disabled, isViewerPremium = false }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [swipeStamp, setSwipeStamp] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchDelta, setTouchDelta] = useState(0);

  const images = [profile.profile_image, ...(profile.gallery_images || [])].filter(Boolean);
  const age = profile.date_of_birth
    ? Math.floor((new Date() - new Date(profile.date_of_birth)) / 31557600000)
    : null;

  const hasGPS = profile.gps_latitude !== null && profile.gps_latitude !== undefined;
  const isLocationStale = profile.gps_verified_at && (new Date() - new Date(profile.gps_verified_at)) > 24 * 60 * 60 * 1000;
  const isOnline = profile.last_active && (new Date() - new Date(profile.last_active) < 5 * 60 * 1000);

  const isImageLocked = (index) => {
    if (isViewerPremium) return false;
    if (profile.lock_all_images) return true;
    return index >= 2;
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (currentImage < images.length - 1) setCurrentImage(currentImage + 1);
  };
  const prevImage = (e) => {
    e.stopPropagation();
    if (currentImage > 0) setCurrentImage(currentImage - 1);
  };

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e) => {
    if (!touchStart) return;
    setTouchDelta(e.touches[0].clientX - touchStart);
  };
  const handleTouchEnd = () => {
    if (Math.abs(touchDelta) > 80) {
      handleAction(touchDelta > 0 ? "like" : "pass");
    }
    setTouchStart(null);
    setTouchDelta(0);
  };

  const handleAction = (action) => {
    if (disabled) return;
    setSwipeStamp(action);
    setTimeout(() => {
      onSwipe(action);
      setSwipeStamp(null);
    }, 300);
  };

  const STAMPS = {
    like:   { label: 'LIKE',   color: 'border-[#16A34A] text-[#16A34A]' },
    friend: { label: 'FRIEND', color: 'border-[#2563EB] text-[#2563EB]' },
    pass:   { label: 'NOPE',   color: 'border-[#DC2626] text-[#DC2626]' },
  };

  const interests = profile.interests?.split(',').filter(Boolean) || [];
  const locationText = profile.city && profile.country 
    ? `${profile.city}, ${profile.country}`
    : profile.country || (profile.city ? profile.city : null);

  const badges = [];
  if (profile.verified) {
    badges.push(<img key="blue" src={blueTick} alt="verified" className="w-5 h-5 inline-block" />);
  }
  if (profile.premium_tier === "gold") {
    badges.push(<img key="gold" src={goldBadge} alt="gold" className="w-5 h-5 inline-block ml-1" />);
  } else if (profile.premium_tier === "platinum") {
    badges.push(<img key="platinum" src={platinumBadge} alt="platinum" className="w-5 h-5 inline-block ml-1" />);
  }

  const handleUndo = (e) => {
    e.stopPropagation();
    onUndo?.();
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-4 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`relative w-full max-w-sm h-[88vh] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          swipeStamp === 'like'
            ? 'translate-x-[150%] rotate-[20deg] opacity-0'
            : swipeStamp === 'friend'
            ? 'translate-x-[150%] rotate-[20deg] opacity-0'
            : swipeStamp === 'pass'
            ? '-translate-x-[150%] -rotate-[20deg] opacity-0'
            : ''
        }`}
        style={
          !swipeStamp && touchDelta
            ? { transform: `translateX(${touchDelta}px) rotate(${touchDelta * 0.02}deg)` }
            : {}
        }
      >
        {/* Image */}
        {images.length > 0 ? (
          <div className="absolute inset-0">
            <img
              src={images[currentImage]}
              alt=""
              className={`w-full h-full object-cover ${isImageLocked(currentImage) ? "blur-md brightness-50" : ""}`}
              draggable={false}
            />
            {isImageLocked(currentImage) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                <Lock className="w-8 h-8 text-white mb-2" />
                <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">
                  Premium
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-7xl">👤</div>
        )}

        {/* Report button – left side, mid-top */}
        <div className="absolute left-3 top-1/4 z-20">
          <ReportButton type="photo" reportedUserId={profile.user_id} imageIndex={currentImage} />
        </div>

        {/* GPS Badge */}
        {hasGPS && (
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 z-20 backdrop-blur-sm ${isLocationStale ? 'bg-yellow-500/80 text-white' : 'bg-green-500/80 text-white'}`}>
            <Navigation className="w-2.5 h-2.5" />
            {isLocationStale ? 'Location may be outdated' : 'Live location'}
          </div>
        )}

        {/* Image progress dots */}
        {images.length > 1 && (
          <div className="absolute top-3 left-12 right-12 flex gap-1 z-20">
            {images.map((_, i) => (
              <div key={i} className={`flex-1 h-[3px] rounded-full ${i <= currentImage ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        )}

        {/* Left/Right chevron buttons */}
        {currentImage > 0 && (
          <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md z-20 hover:bg-white transition-colors">
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>
        )}
        {currentImage < images.length - 1 && (
          <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md z-20 hover:bg-white transition-colors">
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        )}

        {/* Info button */}
        <button
          onClick={() => onInfo?.()}
          className="absolute right-4 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          style={{ top: "80%" }}
        >
          <Info className="w-4 h-4 text-white" />
        </button>

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />

        {/* Profile info */}
        <div className="absolute z-20 px-4" style={{ bottom: "90px" }}>
          <div className="flex items-end gap-2 flex-wrap">
            <h2 className="text-white text-2xl font-bold flex items-center gap-1">
              {profile.display_name || "Anonymous"}
              {badges.length > 0 && <span className="ml-1 flex items-center gap-1">{badges}</span>}
            </h2>
            {age && <span className="text-white text-xl">{age}</span>}
            {profile.gender && (
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur rounded-full text-xs text-white font-medium">
                {profile.gender}
              </span>
            )}
          </div>

          {/* Online indicator + last active */}
          <div className="flex items-center gap-1 mt-1">
            {isOnline ? (
              <>
                <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                <span className="text-white/80 text-xs">Online now</span>
              </>
            ) : (
              <span className="text-white/60 text-xs">{timeAgo(profile.last_active)}</span>
            )}
          </div>

          {/* Location */}
          <div className="mt-1 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              {locationText && (
                <div className="flex items-center gap-1 text-white/80 text-sm">
                  <MapPin className="w-3 h-3" />
                  <span>{locationText}</span>
                </div>
              )}
              {profile.distance_km != null && (
                <div className="flex items-center gap-1 text-white/70 text-xs bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Navigation className="w-2.5 h-2.5" />
                  <span>{profile.distance_km <= 0.1 ? "Nearby" : `${profile.distance_km} km away`}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interests */}
          {interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {interests.slice(0, 4).map((int, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                  {int.trim()}
                </span>
              ))}
              {interests.length > 4 && (
                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                  +{interests.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute left-0 right-0 flex justify-center gap-3 z-20" style={{ bottom: "2%" }}>
          <button onClick={handleUndo} className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-yellow-400 shadow-md hover:bg-yellow-50 transition-colors disabled:opacity-50" title="Undo last swipe" disabled={disabled}>
            <RotateCcw className="w-4 h-4 text-yellow-500" />
          </button>
          <button onClick={() => handleAction("pass")} disabled={disabled} className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-red-500 shadow-lg hover:bg-red-50 transition-colors disabled:opacity-50" title="Pass">
            <X className="w-6 h-6 text-red-500" />
          </button>
          <button onClick={() => handleAction("like")} disabled={disabled} className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-green-500 shadow-lg hover:bg-green-50 transition-colors disabled:opacity-50" title="Like for Dating">
            <Heart className="w-6 h-6 text-green-500" />
          </button>
          <button onClick={() => handleAction("friend")} disabled={disabled} className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-blue-500 shadow-md hover:bg-blue-50 transition-colors disabled:opacity-50" title="Add as Friend">
            <Users className="w-4 h-4 text-blue-500" />
          </button>
        </div>

        {/* Swipe stamp */}
        {swipeStamp && (
          <div className={`absolute top-20 left-1/2 -translate-x-1/2 -rotate-[20deg] border-4 ${STAMPS[swipeStamp].color} rounded-xl px-6 py-2 text-4xl font-black bg-white/10 backdrop-blur z-30 animate-pop`}>
            {STAMPS[swipeStamp].label}
          </div>
        )}
      </div>
    </div>
  );
}