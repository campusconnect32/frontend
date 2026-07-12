import React, { useState, useEffect } from 'react';
import { Search, Clock, XCircle, Bell, Wrench, AlertTriangle, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.is_admin === true;

  useEffect(() => {
    fetchAnnouncements();
  }, [filterStatus, searchTerm]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'All') params.status = filterStatus.toLowerCase();
      if (searchTerm) params.search = searchTerm;
      const res = await api.get('/announcements', { params });
      setAnnouncements(res.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${announcementId}`);
      toast.success('Announcement deleted');
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete');
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
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">📢 Announcements</h1>
          <p className="text-gray-600">Campus updates, closures & notices</p>
        </div>

        {/* Search bar only – no create button */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status filter */}
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

        {/* Announcements list */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell size={48} className="mx-auto text-gray-300 mb-3" />
            <p>No announcements found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.announcement_id} className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-orange-400 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getIcon(announcement.category)}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-[#1a237e]">{announcement.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          announcement.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {announcement.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          announcement.priority === 'high' ? 'bg-red-500 text-white' :
                          announcement.priority === 'medium' ? 'bg-yellow-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {announcement.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{formatDate(announcement.created_at)}</span>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement.announcement_id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Delete announcement"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{announcement.department}</p>
                    <p className="text-sm text-gray-600 mb-3">{announcement.description}</p>
                    {announcement.status === 'active' && announcement.expires_at && (
                      <span className="flex items-center gap-1 text-xs text-orange-600">
                        <Clock size={14} /> Expires: {formatDate(announcement.expires_at)}
                      </span>
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

export default Announcements;