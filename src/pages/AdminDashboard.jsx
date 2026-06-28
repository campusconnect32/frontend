import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users, FileText, Calendar, Bell, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingTutors, setPendingTutors] = useState([]);
  const [pendingBursaries, setPendingBursaries] = useState([]);
  const [activeTab, setActiveTab] = useState('tutors');
  const [stats, setStats] = useState({
    totalTutors: 0,
    pendingTutors: 0,
    approvedTutors: 0,
    totalBursaries: 0,
    pendingBursaries: 0,
    approvedBursaries: 0,
    totalAnnouncements: 0,
    totalEvents: 0
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (user) {
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', user.email)
        .single();

      if (error) throw error;

      if (data?.role === 'admin') {
        setIsAdmin(true);
        fetchData();
      } else {
        setIsAdmin(false);
        setCheckingRole(false);
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
      setCheckingRole(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch pending tutors
      const { data: tutors, error: tutorsError } = await supabase
        .from('tutors')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (tutorsError) throw tutorsError;
      setPendingTutors(tutors || []);

      // Fetch pending bursaries
      const { data: bursaries, error: bursariesError } = await supabase
        .from('bursaries')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (bursariesError) throw bursariesError;
      setPendingBursaries(bursaries || []);

      // Fetch stats
      const { count: totalTutors } = await supabase
        .from('tutors')
        .select('*', { count: 'exact', head: true });

      const { count: pendingTutorsCount } = await supabase
        .from('tutors')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: approvedTutorsCount } = await supabase
        .from('tutors')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: totalBursaries } = await supabase
        .from('bursaries')
        .select('*', { count: 'exact', head: true });

      const { count: pendingBursariesCount } = await supabase
        .from('bursaries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: approvedBursariesCount } = await supabase
        .from('bursaries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: totalAnnouncements } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true });

      const { count: totalEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalTutors: totalTutors || 0,
        pendingTutors: pendingTutorsCount || 0,
        approvedTutors: approvedTutorsCount || 0,
        totalBursaries: totalBursaries || 0,
        pendingBursaries: pendingBursariesCount || 0,
        approvedBursaries: approvedBursariesCount || 0,
        totalAnnouncements: totalAnnouncements || 0,
        totalEvents: totalEvents || 0
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (type, id) => {
    const table = type === 'tutor' ? 'tutors' : 'bursaries';
    try {
      const { error } = await supabase
        .from(table)
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      if (type === 'tutor') {
        setPendingTutors(pendingTutors.filter(t => t.id !== id));
        setStats(prev => ({
          ...prev,
          pendingTutors: prev.pendingTutors - 1,
          approvedTutors: prev.approvedTutors + 1
        }));
      } else {
        setPendingBursaries(pendingBursaries.filter(b => b.id !== id));
        setStats(prev => ({
          ...prev,
          pendingBursaries: prev.pendingBursaries - 1,
          approvedBursaries: prev.approvedBursaries + 1
        }));
      }
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to approve. Please try again.');
    }
  };

  const handleReject = async (type, id) => {
    const table = type === 'tutor' ? 'tutors' : 'bursaries';
    const reason = prompt('Reason for rejection (optional):');
    try {
      const { error } = await supabase
        .from(table)
        .update({ status: 'rejected', rejection_reason: reason || null })
        .eq('id', id);

      if (error) throw error;

      if (type === 'tutor') {
        setPendingTutors(pendingTutors.filter(t => t.id !== id));
        setStats(prev => ({
          ...prev,
          pendingTutors: prev.pendingTutors - 1
        }));
      } else {
        setPendingBursaries(pendingBursaries.filter(b => b.id !== id));
        setStats(prev => ({
          ...prev,
          pendingBursaries: prev.pendingBursaries - 1
        }));
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Failed to reject. Please try again.');
    }
  };

  // Not admin - Funny error message
  if (!checkingRole && !isAdmin) {
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

  if (checkingRole || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading...</p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tutors</p>
                <p className="text-2xl font-bold text-[#1a237e]">{stats.totalTutors}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-yellow-600">⏳ {stats.pendingTutors} pending</span>
              <span className="text-green-600">✅ {stats.approvedTutors} approved</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bursaries</p>
                <p className="text-2xl font-bold text-[#1a237e]">{stats.totalBursaries}</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-2">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-yellow-600">⏳ {stats.pendingBursaries} pending</span>
              <span className="text-green-600">✅ {stats.approvedBursaries} approved</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Announcements</p>
                <p className="text-2xl font-bold text-[#1a237e]">{stats.totalAnnouncements}</p>
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
                <p className="text-2xl font-bold text-[#1a237e]">{stats.totalEvents}</p>
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
              activeTab === 'tutors'
                ? 'bg-[#1a237e] text-white'
                : 'text-gray-600 hover:bg-gray-100'
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
              activeTab === 'bursaries'
                ? 'bg-[#1a237e] text-white'
                : 'text-gray-600 hover:bg-gray-100'
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

        {/* Pending Items */}
        {activeTab === 'tutors' && (
          <div>
            {pendingTutors.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">All caught up! No pending tutor posts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTutors.map((tutor) => (
                  <div key={tutor.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1a237e]">{tutor.title || tutor.subject}</h3>
                        <p className="text-sm text-gray-500">{tutor.department || 'N/A'}</p>
                        <p className="text-sm text-gray-600 mt-1">{tutor.description}</p>
                        {tutor.email && (
                          <p className="text-xs text-gray-400 mt-1">📧 {tutor.email}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0 ml-4">
                        <button
                          onClick={() => handleApprove('tutor', tutor.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject('tutor', tutor.id)}
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
                <p className="text-gray-600">All caught up! No pending bursary posts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingBursaries.map((bursary) => (
                  <div key={bursary.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1a237e]">{bursary.title || bursary.name}</h3>
                        <p className="text-sm text-gray-500">{bursary.provider || 'N/A'}</p>
                        {bursary.amount && (
                          <p className="text-sm font-medium text-green-600">💰 {bursary.amount}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">{bursary.description}</p>
                        {bursary.email && (
                          <p className="text-xs text-gray-400 mt-1">📧 {bursary.email}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0 ml-4">
                        <button
                          onClick={() => handleApprove('bursary', bursary.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject('bursary', bursary.id)}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
