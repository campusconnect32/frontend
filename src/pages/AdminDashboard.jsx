import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Users, FileText, Calendar, Bell, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingTutors, setPendingTutors] = useState([]);
  const [pendingBursaries, setPendingBursaries] = useState([]);
  const [activeTab, setActiveTab] = useState('tutors');
  const [stats, setStats] = useState({
    total_tutors: 0,
    pending_tutors: 0,
    approved_tutors: 0,
    total_bursaries: 0,
    pending_bursaries: 0,
    approved_bursaries: 0,
    total_announcements: 0,
    total_events: 0,
  });

  // University filter
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(''); // '' = All

  useEffect(() => {
    if (user?.is_admin) {
      loadUniversities();
      loadAllData();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.is_admin) {
      loadAllData();
    }
  }, [selectedUniversity]);

  const loadUniversities = async () => {
    try {
      const res = await api.get('/admin/universities');
      setUniversities(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const params = selectedUniversity ? { university_id: selectedUniversity } : {};
      const [statsRes, tutorsRes, bursariesRes] = await Promise.all([
        api.get('/admin/stats', { params }),
        api.get('/admin/pending-tutors', { params }),
        api.get('/admin/pending-bursaries', { params }),
      ]);
      setStats(statsRes.data);
      setPendingTutors(tutorsRes.data || []);
      setPendingBursaries(bursariesRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data', err);
      toast.error('Could not load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (type, id) => {
    try {
      if (type === 'tutor') {
        await api.put(`/admin/tutors/${id}/approve`);
      } else {
        await api.put(`/admin/bursaries/${id}/approve`);
      }
      // Refresh data after action
      loadAllData();
      toast.success('Approved');
    } catch (err) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (type, id) => {
    try {
      if (type === 'tutor') {
        await api.put(`/admin/tutors/${id}/reject`);
      } else {
        await api.put(`/admin/bursaries/${id}/reject`);
      }
      loadAllData();
      toast.success('Rejected');
    } catch (err) {
      toast.error('Failed to reject');
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-300 rounded-2xl p-12">
            <div className="text-8xl mb-6">🤡</div>
            <h2 className="text-4xl font-bold text-purple-700 mb-3">Oopsie !!</h2>
            <p className="text-2xl text-purple-600 mb-2">The page you are looking for is not found.</p>
            <p className="text-xl text-pink-500 mb-6">Take that HOMIE !!! 😤</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-[#1a237e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d1550] transition-colors"
            >
              <Home size={20} /> Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">📊 Admin Dashboard</h1>
          <p className="text-gray-600">Manage and approve posts from students</p>
        </div>

        {/* University filter */}
        <div className="mb-6">
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">All Universities</option>
            {universities.map((uni) => (
              <option key={uni.id} value={uni.id}>
                {uni.name} ({uni.short})
              </option>
            ))}
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tutors</p>
                <p className="text-2xl font-bold text-[#1a237e]">{stats.total_tutors}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-yellow-600">⏳ {stats.pending_tutors} pending</span>
              <span className="text-green-600">✅ {stats.approved_tutors} approved</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bursaries</p>
                <p className="text-2xl font-bold text-[#1a237e]">{stats.total_bursaries}</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-2">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-yellow-600">⏳ {stats.pending_bursaries} pending</span>
              <span className="text-green-600">✅ {stats.approved_bursaries} approved</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Announcements</p>
                <p className="text-2xl font-bold text-[#1a237e]">{stats.total_announcements}</p>
              </div>
              <div className="bg-orange-100 rounded-lg p-2">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Events</p>
                <p className="text-2xl font-bold text-[#1a237e]">{stats.total_events}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-2">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('tutors')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tutors' ? 'bg-[#1a237e] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending Tutors
            {pendingTutors.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingTutors.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('bursaries')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'bursaries' ? 'bg-[#1a237e] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending Bursaries
            {pendingBursaries.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingBursaries.length}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-2">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'tutors' && (
              <div>
                {pendingTutors.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600">No pending tutors for this selection.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingTutors.map((tutor) => (
                      <div key={tutor.tutor_id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#1a237e]">{tutor.title}</h3>
                            <p className="text-sm text-gray-500">{tutor.course_name} – {tutor.course_code}</p>
                            <p className="text-sm text-gray-600 mt-1">{tutor.price_range}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0 ml-4">
                            <button
                              onClick={() => handleApprove('tutor', tutor.tutor_id)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleReject('tutor', tutor.tutor_id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bursaries' && (
              <div>
                {pendingBursaries.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600">No pending bursaries for this selection.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingBursaries.map((bursary) => (
                      <div key={bursary.bursary_id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#1a237e]">{bursary.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{bursary.description}</p>
                            {bursary.link && (
                              <a href={bursary.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">View link</a>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0 ml-4">
                            <button
                              onClick={() => handleApprove('bursary', bursary.bursary_id)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleReject('bursary', bursary.bursary_id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;