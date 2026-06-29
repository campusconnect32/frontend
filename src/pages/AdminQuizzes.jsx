import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const AdminQuizzes = () => {
  const { user } = useAuth();
  const [pendingQuizzes, setPendingQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuiz, setExpandedQuiz] = useState(null);

  // Check admin status from auth context (already fetched by the app)
  const isAdmin = user?.is_admin === true;

  useEffect(() => {
    if (isAdmin) {
      loadPendingQuizzes();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const loadPendingQuizzes = () => {
    const pending = JSON.parse(localStorage.getItem('adminPendingQuizzes') || '[]');
    setPendingQuizzes(pending);
    setLoading(false);
  };

  const toggleExpand = (id) => {
    setExpandedQuiz(expandedQuiz === id ? null : id);
  };

  const handleApprove = (id) => {
    const pending = JSON.parse(localStorage.getItem('adminPendingQuizzes') || '[]');
    const approved = JSON.parse(localStorage.getItem('approvedQuizzes') || '[]');
    
    const quizToApprove = pending.find(q => q.id === id);
    if (quizToApprove) {
      quizToApprove.status = 'approved';
      quizToApprove.approvedAt = new Date().toISOString();
      
      approved.push(quizToApprove);
      localStorage.setItem('approvedQuizzes', JSON.stringify(approved));
      
      const updatedPending = pending.filter(q => q.id !== id);
      localStorage.setItem('adminPendingQuizzes', JSON.stringify(updatedPending));
      
      // Also update the general pending list (used by SubmitQuiz for display)
      const mainPending = JSON.parse(localStorage.getItem('pendingQuizzes') || '[]');
      const updatedMainPending = mainPending.filter(q => q.id !== id);
      localStorage.setItem('pendingQuizzes', JSON.stringify(updatedMainPending));
      
      setPendingQuizzes(updatedPending);
      toast.success('Quiz approved!');
    }
  };

  const handleReject = (id) => {
    if (!window.confirm('Are you sure you want to reject this quiz?')) return;
    
    const pending = JSON.parse(localStorage.getItem('adminPendingQuizzes') || '[]');
    const updatedPending = pending.filter(q => q.id !== id);
    localStorage.setItem('adminPendingQuizzes', JSON.stringify(updatedPending));
    
    const mainPending = JSON.parse(localStorage.getItem('pendingQuizzes') || '[]');
    const updatedMainPending = mainPending.filter(q => q.id !== id);
    localStorage.setItem('pendingQuizzes', JSON.stringify(updatedMainPending));
    
    setPendingQuizzes(updatedPending);
    toast.success('Quiz rejected');
  };

  if (loading && !isAdmin) {
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700">Access Denied</h2>
            <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
            <p className="text-sm text-gray-500 mt-1">This page is for administrators only.</p>
            <Link to="/" className="inline-block mt-4 text-[#1a237e] hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-[#1a237e] mb-6">📋 Pending Quizzes</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading...</p>
          </div>
        ) : pendingQuizzes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">All caught up! No pending quizzes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingQuizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-[#1a237e]">{quiz.title}</h3>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Category: {quiz.category}</p>
                    {quiz.faculty && (
                      <p className="text-sm text-gray-500">Faculty: {quiz.faculty}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">{quiz.questions.length} questions</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted: {new Date(quiz.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleApprove(quiz.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1"
                    >
                      <Check size={16} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(quiz.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
                    >
                      <X size={16} /> Reject
                    </button>
                    <button
                      onClick={() => toggleExpand(quiz.id)}
                      className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center gap-1"
                    >
                      {expandedQuiz === quiz.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {expandedQuiz === quiz.id ? 'Hide' : 'View All'}
                    </button>
                  </div>
                </div>
                
                {expandedQuiz === quiz.id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-[#1a237e] mb-3">All Questions</h4>
                    <div className="space-y-3">
                      {quiz.questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-[#1a237e]">
                            Q{qIndex + 1}: {q.question}
                          </p>
                          <div className="mt-2 ml-4 space-y-1">
                            {q.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2 text-sm">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                                  oIndex === q.correctAnswerIndex 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + oIndex)}
                                </span>
                                <span className={oIndex === q.correctAnswerIndex ? 'font-medium text-green-700' : 'text-gray-600'}>
                                  {option}
                                </span>
                                {oIndex === q.correctAnswerIndex && (
                                  <span className="text-xs text-green-600 font-medium">✅ Correct</span>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-2 rounded">
                            💡 {q.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link to="/quiz" className="text-sm text-[#1a237e] hover:underline">
            ← Back to Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminQuizzes;