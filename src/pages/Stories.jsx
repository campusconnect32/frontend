import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Plus, Search, X, Camera, FileText, Video, Upload, UserPlus, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Story Viewer (full‑screen)                                        */
/* ------------------------------------------------------------------ */
const StoryViewer = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const touchStartX = useRef(null);
  const durationPerStory = 5000;

  const currentStory = stories[currentIndex];
  const total = stories.length;

  useEffect(() => {
    if (!currentStory || isPaused) return;
    startTimeRef.current = Date.now() - pausedTimeRef.current;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / durationPerStory) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        handleNext();
      } else {
        timerRef.current = requestAnimationFrame(tick);
      }
    };
    timerRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(timerRef.current);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    cancelAnimationFrame(timerRef.current);
    setProgress(0);
    pausedTimeRef.current = 0;
    if (currentIndex < total - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    cancelAnimationFrame(timerRef.current);
    setProgress(0);
    pausedTimeRef.current = 0;
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const handleTouchEnd = (e) => {
    const diff = (e.changedTouches[0].clientX - touchStartX.current) / window.innerWidth * 100;
    if (diff > 20) handlePrev();
    else if (diff < -20) handleNext();
    setIsPaused(false);
    touchStartX.current = null;
  };

  if (!currentStory) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050505] flex flex-col justify-between"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        if (x < 30) handlePrev();
        else handleNext();
      }}
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 pt-12 px-4 pb-6 bg-gradient-to-b from-black/60 to-transparent z-10 flex gap-1.5">
        {stories.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-12 left-0 right-0 px-4 z-10 flex items-center justify-between" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white/50">
            {currentStory.profile_image ? (
              <img src={currentStory.profile_image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold">{(currentStory.display_name||"?")[0]}</div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{currentStory.display_name}</p>
            <p className="text-xs text-white/70">
              {new Date(currentStory.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-white p-2 hover:bg-white/20 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Media / Content */}
      <div className="flex-1 flex items-center justify-center">
        {currentStory.type === 'text' && (
          <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 w-full h-full flex items-center justify-center p-10">
            <p className="text-white text-2xl font-bold text-center max-w-md">{currentStory.content}</p>
          </div>
        )}
        {currentStory.type === 'image' && (
          <img src={currentStory.media} alt="" className="w-full h-full object-contain" />
        )}
        {currentStory.type === 'video' && (
          <video src={currentStory.media} autoPlay muted playsInline className="w-full h-full object-contain" />
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Create Story Modal                                                */
/* ------------------------------------------------------------------ */
const CreateStoryModal = ({ onClose, onCreated }) => {
  const [step, setStep] = useState('choose');
  const [storyType, setStoryType] = useState('');
  const [textContent, setTextContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (storyType === 'text' && !textContent.trim()) return toast.error('Please enter text');
    if ((storyType === 'image' || storyType === 'video') && !mediaFile) return toast.error('Please select a file');

    setUploading(true);
    try {
      let mediaUrl = '';
      if (mediaFile) {
        const form = new FormData();
        form.append('file', mediaFile);
        const res = await api.post('/stories/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        mediaUrl = res.data.url;
      }

      await api.post('/stories', {
        type: storyType,
        content: textContent.trim(),
        media_url: mediaUrl,
      });
      toast.success('Story posted!');
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create story');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Story</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
        </div>

        {step === 'choose' && (
          <div className="space-y-3">
            {[
              { type: 'text', icon: FileText, gradient: 'from-purple-500 to-pink-500', label: 'Text', desc: 'Share your thoughts' },
              { type: 'image', icon: Camera, gradient: 'from-amber-400 to-orange-500', label: 'Image', desc: 'Share a photo' },
              { type: 'video', icon: Video, gradient: 'from-rose-500 to-pink-500', label: 'Video', desc: 'Share a video (max 30s)' },
            ].map(item => (
              <button
                key={item.type}
                onClick={() => {
                  setStoryType(item.type);
                  setStep(item.type === 'text' ? 'text' : 'media');
                  if (item.type !== 'text') setTimeout(() => fileRef.current?.click(), 100);
                }}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#FF5A5F] hover:bg-red-50 transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 'text' && (
          <div className="space-y-4">
            <textarea
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-[#FF5A5F] focus:outline-none resize-none text-lg"
              maxLength={200}
            />
            <div className="flex gap-3">
              <button onClick={() => setStep('choose')} className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-100">Back</button>
              <button
                onClick={handleCreate}
                disabled={!textContent.trim() || uploading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white rounded-full font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {uploading ? 'Posting...' : 'Post Story'}
              </button>
            </div>
          </div>
        )}

        {step === 'media' && (
          <div className="space-y-4">
            {mediaPreview ? (
              <div className="aspect-[4/3] max-h-64 bg-gray-100 rounded-xl overflow-hidden relative">
                {storyType === 'image' ? (
                  <img src={mediaPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <video src={mediaPreview} controls className="w-full h-full object-cover" />
                )}
                <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} className="absolute top-2 right-2 bg-white/80 rounded-full p-1"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="aspect-[4/3] max-h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FF5A5F] hover:bg-red-50"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-600 font-medium">Click to upload {storyType}</p>
                <p className="text-sm text-gray-400 mt-1">Max 30MB</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept={storyType==='image'?'image/*':'video/*'} className="hidden" onChange={handleFileSelect} />
            <div className="flex gap-3">
              <button onClick={() => { setStep('choose'); setMediaFile(null); setMediaPreview(null); }} className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-100">Back</button>
              {mediaPreview && (
                <button
                  onClick={handleCreate}
                  disabled={uploading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white rounded-full font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {uploading ? 'Posting...' : 'Post Story'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Stories Page                                                 */
/* ------------------------------------------------------------------ */
export default function Stories() {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerStories, setViewerStories] = useState([]);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);

  // Search & discover
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [discoverOffset, setDiscoverOffset] = useState(0);
  const [hasMoreDiscover, setHasMoreDiscover] = useState(true);
  const [loadingDiscover, setLoadingDiscover] = useState(false);

  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetchFeed();
    loadFollowing();
    loadDiscover(0);
    const interval = setInterval(fetchFeed, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await api.get('/stories/feed');
      setFeed(res.data || []);
    } catch (err) {
      console.error('Failed to fetch stories', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowing = async () => {
    try {
      const res = await api.get('/users/following');
      setFollowing((res.data || []).map(u => u.user_id));
    } catch (err) { /* ignore */ }
  };

  const loadDiscover = async (offset) => {
    setLoadingDiscover(true);
    try {
      const res = await api.get('/users/discover', { params: { limit: 20, offset } });
      const newUsers = res.data || [];
      if (offset === 0) {
        setDiscoverUsers(newUsers);
      } else {
        setDiscoverUsers(prev => [...prev, ...newUsers]);
      }
      setHasMoreDiscover(newUsers.length === 20);
      setDiscoverOffset(offset + newUsers.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDiscover(false);
    }
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get('/users/search', { params: { q: val } });
      setSearchResults(res.data || []);
    } catch (err) { console.error(err); }
  };

  const toggleFollow = async (targetUserId) => {
    try {
      const res = await api.post('/users/follow', { user_id: targetUserId });
      const isFollowing = res.data.following;
      setFollowing(prev => isFollowing ? [...prev, targetUserId] : prev.filter(id => id !== targetUserId));
      toast.success(isFollowing ? 'Followed' : 'Unfollowed');
      setDiscoverUsers(prev => prev.filter(u => u.user_id !== targetUserId));
      setSearchResults(prev => prev.map(u => u.user_id === targetUserId ? { ...u, isFollowed: isFollowing } : u));
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const displayedUsers = searchQuery.length >= 2 ? searchResults : discoverUsers;

  const grouped = feed.reduce((acc, story) => {
    if (!acc[story.user_id]) {
      acc[story.user_id] = {
        user_id: story.user_id,
        display_name: story.display_name,
        profile_image: story.profile_image,
        stories: [],
      };
    }
    acc[story.user_id].stories.push(story);
    return acc;
  }, {});
  const storyUsers = Object.values(grouped);

  const openViewer = (userIndex, storyIndex = 0) => {
    setViewerStories(storyUsers[userIndex].stories);
    setViewerInitialIndex(storyIndex);
    setViewerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="font-display text-3xl font-semibold text-gray-900 mb-6">Stories</h1>

        {/* Horizontal story strip */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-2 snap-x no-scrollbar mb-8">
          <button
            onClick={() => setShowCreate(true)}
            className="flex flex-col items-center gap-2 min-w-[72px] snap-start cursor-pointer"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center relative">
              <Plus className="w-6 h-6 text-gray-600" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center border-2 border-white">
                <Plus className="w-3 h-3" />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 truncate max-w-[72px]">Your Story</span>
          </button>

          {storyUsers.map((group) => (
            <button
              key={group.user_id}
              onClick={() => openViewer(storyUsers.indexOf(group))}
              className="flex flex-col items-center gap-2 min-w-[72px] snap-start cursor-pointer"
            >
              <div className={`p-[3px] rounded-full ${group.stories.length > 0 ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500' : 'bg-gray-200'}`}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white overflow-hidden">
                  {group.profile_image ? (
                    <img src={group.profile_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-500">
                      {(group.display_name?.[0] || '?').toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700 truncate max-w-[72px]">{group.display_name}</span>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Find people to follow..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* User list */}
        <div className="space-y-3">
          {displayedUsers.length === 0 && !loadingDiscover && (
            <p className="text-sm text-gray-500 text-center py-4">
              {searchQuery.length >= 2 ? 'No users found.' : 'No more users to discover.'}
            </p>
          )}

          {displayedUsers.map(u => (
            <div key={u.user_id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {u.profile_image ? (
                    <img src={u.profile_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                      {(u.display_name||"?")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="font-medium text-gray-800">{u.display_name}</span>
              </div>
              <button
                onClick={() => toggleFollow(u.user_id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                  following.includes(u.user_id)
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {following.includes(u.user_id) ? (
                  <><UserCheck className="w-4 h-4" /> Following</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> Follow</>
                )}
              </button>
            </div>
          ))}

          {searchQuery.length < 2 && hasMoreDiscover && (
            <div className="text-center pt-2">
              <button
                onClick={() => loadDiscover(discoverOffset)}
                disabled={loadingDiscover}
                className="neo-btn neo-btn-secondary !px-6 !py-2 text-sm"
              >
                {loadingDiscover ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loadingDiscover ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Story Viewer */}
      {viewerOpen && viewerStories.length > 0 && (
        <StoryViewer
          stories={viewerStories}
          initialIndex={viewerInitialIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}

      {/* Create Story Modal */}
      {showCreate && (
        <CreateStoryModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            fetchFeed();
          }}
        />
      )}
    </div>
  );
}