import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Clock, MapPin, Upload, Image, X, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

const Events = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageCaption, setImageCaption] = useState('');
  const [imageLocation, setImageLocation] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState([]);
  const [sharedImages, setSharedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    checkAdminRole();
    fetchEvents();
  }, [user]);

  const checkAdminRole = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', user.email)
        .single();
      if (data?.role === 'admin') {
        setIsAdmin(true);
      }
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Career', 'Academic', 'Social', 'Sport', 'Health', 'Other'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">📅 Campus Events</h1>
          <p className="text-gray-600">Stay up to date with what's happening at Wits</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events or departments..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-[#1a237e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d1550] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Upload size={20} /> Share Photo
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#1a237e] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p>No upcoming events. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-[#1a237e]">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.category === 'academic' ? 'bg-purple-100 text-purple-700' :
                      event.category === 'career' ? 'bg-blue-100 text-blue-700' :
                      event.category === 'social' ? 'bg-pink-100 text-pink-700' :
                      event.category === 'sport' ? 'bg-green-100 text-green-700' :
                      event.category === 'health' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{event.department}</p>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span>{event.time}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{event.venue}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
