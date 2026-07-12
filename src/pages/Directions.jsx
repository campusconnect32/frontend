import React, { useState, useEffect, useRef } from 'react';
import { Search, Play, Plus, Navigation } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// Helper: convert YouTube watch URLs to embed format
const getEmbedUrl = (url) => {
  if (!url) return '';
  // Already an embed link
  if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) {
    return url;
  }
  // youtu.be short link
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // Standard watch link
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // Fallback: return as is (might not work)
  return url;
};

const Directions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [newRoute, setNewRoute] = useState({
    from_location: '',
    to_location: '',
    duration: '',
    mode: 'walk',
    video_url: ''            // new field
  });
  const [submitting, setSubmitting] = useState(false);
  const searchTimeout = useRef(null);

  // Fetch on mount and when search term changes (debounced)
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchRoutes();
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm]);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/directions', {
        params: searchTerm ? { search: searchTerm } : {}
      });
      setRoutes(res.data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast.error('Failed to load directions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Convert video URL to embed before storing
      const embedUrl = getEmbedUrl(newRoute.video_url);

      await api.post('/directions', {
        from_location: newRoute.from_location,
        to_location: newRoute.to_location,
        duration: newRoute.duration,
        mode: newRoute.mode,
        video_url: embedUrl
      });
      toast.success('Route added successfully!');
      setShowAddRoute(false);
      setNewRoute({
        from_location: '',
        to_location: '',
        duration: '',
        mode: 'walk',
        video_url: ''
      });
      fetchRoutes();
    } catch (error) {
      console.error('Error adding route:', error);
      toast.error(error.response?.data?.detail || 'Failed to add route');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">🧭 Campus Directions</h1>
          <p className="text-gray-600">Find your way around campus — made for students</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by location name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowAddRoute(!showAddRoute)}
          className="w-full mb-6 bg-[#1a237e] text-white py-3 rounded-xl font-semibold hover:bg-[#0d1550] transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Add Route
        </button>

        {showAddRoute && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-[#1a237e]">Add New Route</h3>
            <form onSubmit={handleAddRoute}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                    value={newRoute.from_location}
                    onChange={(e) => setNewRoute({...newRoute, from_location: e.target.value})}
                    placeholder="e.g. Solomon Mahlangu House"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                    value={newRoute.to_location}
                    onChange={(e) => setNewRoute({...newRoute, to_location: e.target.value})}
                    placeholder="e.g. Hall 29"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                    value={newRoute.duration}
                    onChange={(e) => setNewRoute({...newRoute, duration: e.target.value})}
                    placeholder="e.g. 5-7 minutes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                    value={newRoute.mode}
                    onChange={(e) => setNewRoute({...newRoute, mode: e.target.value})}
                  >
                    <option value="walk">🚶 Walking</option>
                    <option value="bus">🚌 Bus</option>
                    <option value="bike">🚲 Bike</option>
                  </select>
                </div>
                {/* ---- Video URL input ---- */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL (YouTube link, optional)
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                    value={newRoute.video_url}
                    onChange={(e) => setNewRoute({...newRoute, video_url: e.target.value})}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Paste a YouTube video link to show a walkthrough.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#1a237e] text-white py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Adding...' : 'Add Route'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRoute(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading routes...</p>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Navigation size={48} className="mx-auto text-gray-300 mb-3" />
            <p>No routes found. Try a different search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((route) => (
              <div
                key={route.route_id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1a237e]">
                      {route.from_location} → {route.to_location}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">⏱ {route.duration}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          route.mode === 'bus'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {route.mode === 'bus' ? '🚌' : '🚶'} {route.mode}
                      </span>
                    </div>
                  </div>
                  {route.video_url && (
                    <button
                      onClick={() =>
                        setSelectedVideo(
                          selectedVideo === route.route_id ? null : route.route_id
                        )
                      }
                      className="flex items-center gap-1 text-[#1a237e] hover:text-[#0d1550] text-sm font-medium"
                    >
                      <Play size={16} />{' '}
                      {selectedVideo === route.route_id ? 'Close' : 'Video'}
                    </button>
                  )}
                </div>
                {selectedVideo === route.route_id && route.video_url && (
                  <div className="mt-4">
                    <div className="relative pb-[56.25%] h-0">
                      <iframe
                        src={route.video_url}
                        title={`Directions from ${route.from_location} to ${route.to_location}`}
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      📹 Quick walkthrough from {route.from_location} to{' '}
                      {route.to_location}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Directions;