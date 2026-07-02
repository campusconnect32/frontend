import React, { useState, useEffect } from 'react';
import { Search, Play, Plus, Navigation, MapPin, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const Directions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [newRoute, setNewRoute] = useState({
    from: '',
    to: '',
    duration: '',
    mode: 'walk'
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('directions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRoutes(data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('directions')
        .insert([{
          from: newRoute.from,
          to: newRoute.to,
          duration: newRoute.duration,
          mode: newRoute.mode,
          description: `~${newRoute.duration} ${newRoute.mode}`,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }])
        .select();
      if (error) throw error;
      setRoutes([data[0], ...routes]);
      setShowAddRoute(false);
      setNewRoute({ from: '', to: '', duration: '', mode: 'walk' });
      toast.success('Route added successfully!');
    } catch (error) {
      console.error('Error adding route:', error);
      toast.error('Failed to add route');
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.to?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">🧭 Campus Directions</h1>
          <p className="text-gray-600">Find your way around Wits campus — made for first years</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by location name (e.g. Solomon Mahlangu to Hall 29)..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={() => setShowAddRoute(!showAddRoute)} className="w-full mb-6 bg-[#1a237e] text-white py-3 rounded-xl font-semibold hover:bg-[#0d1550] transition-colors flex items-center justify-center gap-2">
          <Plus size={20} /> Add Route
        </button>

        {showAddRoute && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-[#1a237e]">Add New Route</h3>
            <form onSubmit={handleAddRoute}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newRoute.from} onChange={(e) => setNewRoute({...newRoute, from: e.target.value})} placeholder="e.g. Solomon Mahlangu House" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newRoute.to} onChange={(e) => setNewRoute({...newRoute, to: e.target.value})} placeholder="e.g. Hall 29" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newRoute.duration} onChange={(e) => setNewRoute({...newRoute, duration: e.target.value})} placeholder="e.g. 5-7 minutes" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newRoute.mode} onChange={(e) => setNewRoute({...newRoute, mode: e.target.value})}>
                    <option value="walk">🚶 Walking</option>
                    <option value="bus">🚌 Bus</option>
                    <option value="bike">🚲 Bike</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-[#1a237e] text-white py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors">Add Route</button>
                  <button type="button" onClick={() => setShowAddRoute(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
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
        ) : filteredRoutes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Navigation size={48} className="mx-auto text-gray-300 mb-3" />
            <p>No routes found. Try a different search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1a237e]">{route.from} → {route.to}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">⏱ {route.duration}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${route.mode === 'bus' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {route.mode === 'bus' ? '🚌' : '🚶'} {route.mode}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedVideo(selectedVideo === route.id ? null : route.id)} className="flex items-center gap-1 text-[#1a237e] hover:text-[#0d1550] text-sm font-medium">
                    <Play size={16} /> {selectedVideo === route.id ? 'Close' : 'Video'}
                  </button>
                </div>
                {selectedVideo === route.id && (
                  <div className="mt-4">
                    <div className="relative pb-[56.25%] h-0">
                      <iframe src={route.videoUrl} title={`Directions from ${route.from} to ${route.to}`} className="absolute top-0 left-0 w-full h-full rounded-lg" allowFullScreen />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">📹 Quick walkthrough from {route.from} to {route.to}</p>
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
