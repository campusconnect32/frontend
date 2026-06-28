import React, { useState, useEffect } from 'react';
import { Search, Clock, XCircle, Bell, Wrench, AlertTriangle, Plus, X, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    category: 'Notice',
    department: '',
    description: '',
    priority: 'medium',
    expires_at: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Check if user is admin
  useEffect(() => {
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
    checkAdminRole();
  }, [user]);

  // Fetch announcements from Supabase
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          title: newAnnouncement.title,
          category: newAnnouncement.category,
          department: newAnnouncement.department,
          description: newAnnouncement.description,
          priority: newAnnouncement.priority,
          expires_at: newAnnouncement.expires_at || null,
          status: 'active'
        }])
        .select();

      if (error) throw error;

      setAnnouncements([data[0], ...announcements]);
      setShowCreateForm(false);
      setNewAnnouncement({
        title: '',
        category: 'Notice',
        department: '',
        description: '',
        priority: 'medium',
        expires_at: ''
      });
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500';
  };

  const getPriorityStyles = (priority) => {
    switch(priority) {
      case 'critical': return { border: 'border-red-600', badge: 'bg-red-600 text-white' };
      case 'high': return { border: 'border-orange-500', badge: 'bg-orange-500 text-white' };
      case 'medium': return { border: 'border-yellow-500', badge: 'bg-yellow-600 text-white' };
      default: return { border: 'border-blue-500', badge: 'bg-blue-500 text-white' };
    }
  };

  const getIcon = (category) => {
    switch(category) {
      case 'Closure': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Notice': return <Bell className="w-5 h-5 text-blue-500" />;
      case 'Maintenance': return <Wrench className="w-5 h-5 text-orange-500" />;
      case 'Emergency': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || announcement.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const categories = ['Notice', 'Closure', 'Maintenance', 'Emergency', 'Service'];
  const priorities = ['low', 'medium', 'high', 'critical'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">📢 Announcements</h1>
          <p className="text-gray-600">Campus updates, closures & notices</p>
        </div>

        {/* Search and Create Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#1a237e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d1550] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} /> Create Announcement
            </button>
          )}
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1a237e]">Create Announcement</h2>
                <button onClick={() => setShowCreateForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateAnnouncement}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      placeholder="Announcement title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      value={newAnnouncement.category}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      value={newAnnouncement.department}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, department: e.target.value})}
                      placeholder="e.g. IT Services"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      rows="3"
                      value={newAnnouncement.description}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, description: e.target.value})}
                      placeholder="Full description of the announcement"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                    >
                      {priorities.map(p => (
                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      value={newAnnouncement.expires_at}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, expires_at: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#1a237e] text-white py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Announcement'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['All', 'Active', 'Inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-[#1a237e] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading announcements...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => {
              const priorityStyle = getPriorityStyles(announcement.priority);
              return (
                <div
                  key={announcement.id}
                  className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${priorityStyle.border} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getIcon(announcement.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-[#1a237e]">{announcement.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(announcement.status)}`}>
                            {announcement.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyle.badge}`}>
                            {announcement.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {formatDate(announcement.created_at)}
                          </span>
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Delete announcement"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{announcement.department}</p>
                      <p className="text-sm text-gray-600 mb-3">{announcement.description}</p>
                      {announcement.status === 'active' && announcement.expires_at && (
                        <span className="flex items-center gap-1 text-xs text-orange-600">
                          <Clock size={14} />
                          Expires: {formatDate(announcement.expires_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredAnnouncements.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Bell size={48} className="mx-auto text-gray-300 mb-3" />
            <p>No announcements found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
