import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, XCircle, Users, FileText, Calendar, Bell, Home, Brain,
  Plus, X, ChevronDown, ChevronUp, Eye, MessageSquare
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingTutors, setPendingTutors] = useState([]);
  const [pendingBursaries, setPendingBursaries] = useState([]);
  const [pendingQuizzes, setPendingQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('tutors');
  const [stats, setStats] = useState({
    total_tutors: 0, pending_tutors: 0, approved_tutors: 0,
    total_bursaries: 0, pending_bursaries: 0, approved_bursaries: 0,
    total_announcements: 0, total_events: 0, total_quizzes: 0, pending_quizzes: 0,
  });

  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');

  // Event creation
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', category: 'Other', department: '',
    description: '', date: '', time: '', venue: '',
    university_id: ''
  });
  const [submittingEvent, setSubmittingEvent] = useState(false);

  // Announcement creation
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '', category: 'Notice', department: '',
    description: '', priority: 'medium',
    university_id: ''
  });
  const [submittingAnnouncement, setSubmittingAnnouncement] = useState(false);

  // Expandable quiz state
  const [expandedQuiz, setExpandedQuiz] = useState(null);

  // Mirror modal
  const [showMirrorModal, setShowMirrorModal] = useState(false);
  const [mirrorUniversity, setMirrorUniversity] = useState('');

  // ---------- FEEDBACK state ----------
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    if (user?.is_admin) {
      loadUniversities();
      loadAllData();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.is_admin) loadAllData();
  }, [selectedUniversity]);

  // Load feedback when tab changes to 'feedback'
  useEffect(() => {
    if (activeTab === 'feedback' && user?.is_admin) {
      fetchFeedback();
    }
  }, [activeTab]);

  const loadUniversities = async () => {
    try {
      const res = await api.get('/admin/universities');
      setUniversities(res.data || []);
    } catch (err) { console.error(err); }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const params = selectedUniversity ? { university_id: selectedUniversity } : {};
      const [statsRes, tutorsRes, bursariesRes, quizzesRes] = await Promise.all([
        api.get('/admin/stats', { params }),
        api.get('/admin/pending-tutors', { params }),
        api.get('/admin/pending-bursaries', { params }),
        api.get('/admin/pending-quizzes', { params }),
      ]);
      setStats(statsRes.data);
      setPendingTutors(tutorsRes.data || []);
      setPendingBursaries(bursariesRes.data || []);
      setPendingQuizzes(quizzesRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Could not load admin data');
    } finally { setLoading(false); }
  };

  const fetchFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const res = await api.get('/admin/feedback');
      setFeedbacks(res.data || []);
    } catch (err) {
      toast.error('Failed to load feedback');
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleApprove = async (type, id) => {
    try {
      if (type === 'tutor') await api.put(`/admin/tutors/${id}/approve`);
      else if (type === 'bursary') await api.put(`/admin/bursaries/${id}/approve`);
      else if (type === 'quiz') await api.put(`/admin/quizzes/${id}/approve`);
      toast.success('Approved');
      loadAllData();
    } catch (err) { toast.error('Failed to approve'); }
  };

  const handleReject = async (type, id) => {
    try {
      if (type === 'tutor') await api.put(`/admin/tutors/${id}/reject`);
      else if (type === 'bursary') await api.put(`/admin/bursaries/${id}/reject`);
      else if (type === 'quiz') await api.put(`/admin/quizzes/${id}/reject`);
      toast.success('Rejected');
      loadAllData();
    } catch (err) { toast.error('Failed to reject'); }
  };

  const openCreateEvent = () => {
    setNewEvent({
      title: '', category: 'Other', department: '',
      description: '', date: '', time: '', venue: '',
      university_id: selectedUniversity
    });
    setShowCreateEvent(true);
  };

  const openCreateAnnouncement = () => {
    setNewAnnouncement({
      title: '', category: 'Notice', department: '',
      description: '', priority: 'medium',
      university_id: selectedUniversity
    });
    setShowCreateAnnouncement(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.university_id) return toast.error('Please select a university first');
    setSubmittingEvent(true);
    try {
      await api.post('/events', newEvent);
      toast.success('Event created!');
      setShowCreateEvent(false);
      loadAllData();
    } catch (err) { toast.error(err.response?.data?.detail || 'Failed to create event'); }
    finally { setSubmittingEvent(false); }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.university_id) return toast.error('Please select a university first');
    setSubmittingAnnouncement(true);
    try {
      await api.post('/announcements', newAnnouncement);
      toast.success('Announcement created!');
      setShowCreateAnnouncement(false);
      loadAllData();
    } catch (err) { toast.error(err.response?.data?.detail || 'Failed to create announcement'); }
    finally { setSubmittingAnnouncement(false); }
  };

  const handleMirror = () => {
    if (!mirrorUniversity) {
      return toast.error('Please select a university');
    }
    localStorage.setItem('mirrorMode', 'true');
    localStorage.setItem('mirrorUniversityId', mirrorUniversity);
    const uni = universities.find(u => u.id === mirrorUniversity);
    if (uni) {
      localStorage.setItem('mirrorUniversityName', uni.name);
      localStorage.setItem('mirrorUniversityShort', uni.short);
    }
    window.open('/?mirror=1', '_blank');
    setShowMirrorModal(false);
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
            <Link to="/" className="inline-flex items-center gap-2 bg-[#1a237e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d1550] transition-colors"><Home size={20} /> Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1a237e]">📊 Admin Dashboard</h1>
            <p className="text-gray-600">Manage and approve posts from students</p>
          </div>
          <div className="flex gap-2">
            <button onClick={openCreateEvent} className="bg-[#1a237e] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0d1550] transition-colors flex items-center gap-2"><Plus size={18} /> Create Event</button>
            <button onClick={openCreateAnnouncement} className="bg-[#1a237e] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0d1550] transition-colors flex items-center gap-2"><Plus size={18} /> Create Announcement</button>
            <button onClick={() => setShowMirrorModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Eye size={18} /> Mirror
            </button>
          </div>
        </div>

        <div className="mb-6">
          <select value={selectedUniversity} onChange={(e) => setSelectedUniversity(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
            <option value="">All Universities</option>
            {universities.map((uni) => (<option key={uni.id} value={uni.id}>{uni.name} ({uni.short})</option>))}
          </select>
        </div>

        {/* Stats Grid (unchanged) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Tutors</p><p className="text-2xl font-bold text-[#1a237e]">{stats.total_tutors}</p></div><div className="bg-blue-100 rounded-lg p-2"><Users className="w-5 h-5 text-blue-600" /></div></div>
            <div className="flex gap-4 mt-2 text-xs"><span className="text-yellow-600">⏳ {stats.pending_tutors} pending</span><span className="text-green-600">✅ {stats.approved_tutors} approved</span></div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Bursaries</p><p className="text-2xl font-bold text-[#1a237e]">{stats.total_bursaries}</p></div><div className="bg-purple-100 rounded-lg p-2"><FileText className="w-5 h-5 text-purple-600" /></div></div>
            <div className="flex gap-4 mt-2 text-xs"><span className="text-yellow-600">⏳ {stats.pending_bursaries} pending</span><span className="text-green-600">✅ {stats.approved_bursaries} approved</span></div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Quizzes</p><p className="text-2xl font-bold text-[#1a237e]">{stats.total_quizzes}</p></div><div className="bg-indigo-100 rounded-lg p-2"><Brain className="w-5 h-5 text-indigo-600" /></div></div>
            <div className="flex gap-4 mt-2 text-xs"><span className="text-yellow-600">⏳ {stats.pending_quizzes} pending</span></div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Events & Announcements</p><p className="text-2xl font-bold text-[#1a237e]">{stats.total_events + stats.total_announcements}</p></div><div className="bg-green-100 rounded-lg p-2"><Calendar className="w-5 h-5 text-green-600" /></div></div>
            <div className="flex gap-4 mt-2 text-xs"><span className="text-gray-600">📅 {stats.total_events} events</span><span className="text-gray-600">📢 {stats.total_announcements} announcements</span></div>
          </div>
        </div>

        {/* Tabs – added Feedback */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4 overflow-x-auto">
          <button onClick={() => setActiveTab('tutors')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'tutors' ? 'bg-[#1a237e] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Pending Tutors {pendingTutors.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingTutors.length}</span>}</button>
          <button onClick={() => setActiveTab('bursaries')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'bursaries' ? 'bg-[#1a237e] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Pending Bursaries {pendingBursaries.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingBursaries.length}</span>}</button>
          <button onClick={() => setActiveTab('quizzes')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'quizzes' ? 'bg-[#1a237e] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Pending Quizzes {pendingQuizzes.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingQuizzes.length}</span>}</button>
          {/* NEW FEEDBACK TAB */}
          <button onClick={() => setActiveTab('feedback')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'feedback' ? 'bg-[#1a237e] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            Feedback
          </button>
        </div>

        {/* Pending Items (unchanged) */}
        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-gray-500 mt-2">Loading...</p></div>
        ) : (
          <>
            {activeTab === 'tutors' && (pendingTutors.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-100"><CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" /><p className="text-gray-600">No pending tutors for this selection.</p></div>
            ) : (
              <div className="space-y-4">
                {pendingTutors.map((tutor) => (
                  <div key={tutor.tutor_id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1"><h3 className="font-semibold text-[#1a237e]">{tutor.title}</h3><p className="text-sm text-gray-500">{tutor.course_name} – {tutor.course_code}</p><p className="text-sm text-gray-600 mt-1">{tutor.price_range}</p></div>
                      <div className="flex gap-2 flex-shrink-0 ml-4">
                        <button onClick={() => handleApprove('tutor', tutor.tutor_id)} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">✅ Approve</button>
                        <button onClick={() => handleReject('tutor', tutor.tutor_id)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">❌ Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {activeTab === 'bursaries' && (pendingBursaries.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-100"><CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" /><p className="text-gray-600">No pending bursaries for this selection.</p></div>
            ) : (
              <div className="space-y-4">
                {pendingBursaries.map((bursary) => (
                  <div key={bursary.bursary_id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1"><h3 className="font-semibold text-[#1a237e]">{bursary.title}</h3><p className="text-sm text-gray-600 mt-1">{bursary.description}</p>{bursary.link && <a href={bursary.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">View link</a>}</div>
                      <div className="flex gap-2 flex-shrink-0 ml-4">
                        <button onClick={() => handleApprove('bursary', bursary.bursary_id)} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">✅ Approve</button>
                        <button onClick={() => handleReject('bursary', bursary.bursary_id)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">❌ Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {activeTab === 'quizzes' && (pendingQuizzes.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-100"><CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" /><p className="text-gray-600">No pending quizzes for this selection.</p></div>
            ) : (
              <div className="space-y-4">
                {pendingQuizzes.map((quiz) => {
                  const questions = Array.isArray(quiz.questions) ? quiz.questions : JSON.parse(quiz.questions || '[]');
                  return (
                    <div key={quiz.quiz_id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1a237e]">{quiz.title}</h3>
                          <p className="text-sm text-gray-500">Category: {quiz.category}</p>
                          <p className="text-sm text-gray-600 mt-1">{questions.length} questions</p>
                          <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(quiz.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 ml-4">
                          <button onClick={() => handleApprove('quiz', quiz.quiz_id)} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">✅ Approve</button>
                          <button onClick={() => handleReject('quiz', quiz.quiz_id)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">❌ Reject</button>
                          <button onClick={() => setExpandedQuiz(expandedQuiz === quiz.quiz_id ? null : quiz.quiz_id)} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center gap-1">
                            {expandedQuiz === quiz.quiz_id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {expandedQuiz === quiz.quiz_id ? 'Hide' : 'View All'}
                          </button>
                        </div>
                      </div>
                      {expandedQuiz === quiz.quiz_id && (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-semibold text-[#1a237e] mb-3">All Questions</h4>
                          <div className="space-y-3">
                            {questions.map((q, qIndex) => (
                              <div key={qIndex} className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm font-medium text-[#1a237e]">Q{qIndex + 1}: {q.question}</p>
                                <div className="mt-2 ml-4 space-y-1">
                                  {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-2 text-sm">
                                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${oIndex === q.correctAnswerIndex ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{String.fromCharCode(65 + oIndex)}</span>
                                      <span className={oIndex === q.correctAnswerIndex ? 'font-medium text-green-700' : 'text-gray-600'}>{option}</span>
                                      {oIndex === q.correctAnswerIndex && <span className="text-xs text-green-600 font-medium">✅ Correct</span>}
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-2 rounded">💡 {q.explanation}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* ---------- FEEDBACK TAB ---------- */}
            {activeTab === 'feedback' && (
              <div>
                {loadingFeedback ? (
                  <div className="text-center py-12"><div className="w-8 h-8 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-gray-500 mt-2">Loading feedback...</p></div>
                ) : feedbacks.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No feedback yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedbacks.map((fb) => (
                      <div key={fb.feedback_id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {fb.user_picture ? (
                              <img src={fb.user_picture} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                                {(fb.user_name || '?')[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-[#1a237e]">{fb.user_name}</h4>
                              <span className="text-xs text-gray-400">{new Date(fb.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                              fb.category === 'bug' ? 'bg-red-100 text-red-700' :
                              fb.category === 'praise' ? 'bg-green-100 text-green-700' :
                              fb.category === 'suggestion' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {fb.category}
                            </span>
                            <p className="text-gray-600 mt-2 whitespace-pre-wrap">{fb.message}</p>
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

        {/* Create Event Modal (unchanged) */}
        {showCreateEvent && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowCreateEvent(false)}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-[#1a237e]">Create Event</h2><button onClick={() => setShowCreateEvent(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button></div>
              <form onSubmit={handleCreateEvent}>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">University</label><select value={newEvent.university_id} onChange={(e) => setNewEvent({...newEvent, university_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" required><option value="">Select university</option>{universities.map(uni => (<option key={uni.id} value={uni.id}>{uni.name}</option>))}</select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} placeholder="Event name" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}><option>Academic</option><option>Career</option><option>Social</option><option>Sport</option><option>Health</option><option>Other</option></select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newEvent.department} onChange={(e) => setNewEvent({...newEvent, department: e.target.value})} placeholder="e.g. Faculty of Science" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" rows="3" value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} placeholder="What is this event about?" /></div>
                  <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} placeholder="e.g. Wed, 15 Jul 2026" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label><input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} placeholder="e.g. 09:00 - 16:00" /></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Venue</label><input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newEvent.venue} onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})} placeholder="e.g. Wits Conference Centre" /></div>
                </div>
                <div className="flex gap-3 mt-6"><button type="submit" disabled={submittingEvent} className="flex-1 bg-[#1a237e] text-white py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors disabled:opacity-50">{submittingEvent ? 'Creating...' : 'Create Event'}</button><button type="button" onClick={() => setShowCreateEvent(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Cancel</button></div>
              </form>
            </div>
          </div>
        )}

        {/* Create Announcement Modal (unchanged) */}
        {showCreateAnnouncement && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowCreateAnnouncement(false)}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-[#1a237e]">Create Announcement</h2><button onClick={() => setShowCreateAnnouncement(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button></div>
              <form onSubmit={handleCreateAnnouncement}>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">University</label><select value={newAnnouncement.university_id} onChange={(e) => setNewAnnouncement({...newAnnouncement, university_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" required><option value="">Select university</option>{universities.map(uni => (<option key={uni.id} value={uni.id}>{uni.name}</option>))}</select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})} placeholder="Announcement title" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newAnnouncement.category} onChange={(e) => setNewAnnouncement({...newAnnouncement, category: e.target.value})}><option>Notice</option><option>Closure</option><option>Maintenance</option><option>Emergency</option><option>Service</option></select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newAnnouncement.department} onChange={(e) => setNewAnnouncement({...newAnnouncement, department: e.target.value})} placeholder="e.g. IT Services" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" rows="3" value={newAnnouncement.description} onChange={(e) => setNewAnnouncement({...newAnnouncement, description: e.target.value})} placeholder="Full description" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label><select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]" value={newAnnouncement.priority} onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
                </div>
                <div className="flex gap-3 mt-6"><button type="submit" disabled={submittingAnnouncement} className="flex-1 bg-[#1a237e] text-white py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors disabled:opacity-50">{submittingAnnouncement ? 'Creating...' : 'Create Announcement'}</button><button type="button" onClick={() => setShowCreateAnnouncement(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Cancel</button></div>
              </form>
            </div>
          </div>
        )}

        {/* Mirror Modal (unchanged) */}
        {showMirrorModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowMirrorModal(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1a237e] flex items-center gap-2"><Eye size={24} /> Mirror University</h2>
                <button onClick={() => setShowMirrorModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Select a university to see exactly what its students see.</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <select value={mirrorUniversity} onChange={(e) => setMirrorUniversity(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]">
                  <option value="">Select university</option>
                  {universities.map(uni => (<option key={uni.id} value={uni.id}>{uni.name}</option>))}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handleMirror} disabled={!mirrorUniversity} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50">Open Mirror</button>
                <button onClick={() => setShowMirrorModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;