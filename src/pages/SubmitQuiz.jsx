import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

const SubmitQuiz = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    category: 'General',
    faculty: '',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      }
    ]
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'General',
    'South African Trivia',
    'Campus Life',
    'Current Affairs',
    'Science & Technology',
    'Accounting & Accounting Science',
    'Law (LLB)',
    'Computer Science',
    'Economics & Economic Science',
    'Commerce (General/Finance/HR/Management)',
    'Engineering & Built Environment',
    'Health Sciences',
    'Humanities',
    'Science',
    'Other'
  ];

  const faculties = [
    'Commerce, Law & Management',
    'Science',
    'Engineering & Built Environment',
    'Health Sciences',
    'Humanities',
    'Other'
  ];

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: ''
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length <= 1) {
      toast.warning('You need at least one question');
      return;
    }
    const newQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[index][field] = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!quizData.title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }
    
    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          toast.error(`Option ${j + 1} in question ${i + 1} is empty`);
          return;
        }
      }
      if (!q.explanation.trim()) {
        toast.error(`Question ${i + 1} is missing an explanation`);
        return;
      }
    }

    setSubmitting(true);
    
    try {
      // Save to localStorage for now (admin will review)
      const existingSubmissions = JSON.parse(localStorage.getItem('pendingQuizzes') || '[]');
      const newSubmission = {
        id: Date.now(),
        ...quizData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        submittedBy: 'Student'
      };
      
      localStorage.setItem('pendingQuizzes', JSON.stringify([newSubmission, ...existingSubmissions]));
      
      // Also save to a separate list for admin review
      const pendingList = JSON.parse(localStorage.getItem('adminPendingQuizzes') || '[]');
      pendingList.push(newSubmission);
      localStorage.setItem('adminPendingQuizzes', JSON.stringify(pendingList));
      
      setSubmitted(true);
      toast.success('Quiz submitted for review!');
      
      // Reset form
      setQuizData({
        title: '',
        category: 'General',
        faculty: '',
        questions: [
          {
            question: '',
            options: ['', '', '', ''],
            correctAnswerIndex: 0,
            explanation: ''
          }
        ]
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1a237e] mb-2">Quiz Submitted! 🎉</h2>
            <p className="text-gray-600 mb-4">
              Your quiz has been submitted for review. It will appear in the quizzes section once approved by an admin.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/submit-quiz"
                className="bg-[#1a237e] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0d1550] transition-colors"
              >
                Submit Another Quiz
              </Link>
              <Link
                to="/quiz"
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                View Quizzes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1a237e]">📝 Submit a Quiz</h1>
          <p className="text-gray-600">Create your own quiz and share it with the campus community!</p>
          <p className="text-sm text-orange-600 mt-1">⚠️ Your quiz will be reviewed by an admin before it goes live.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-[#1a237e] mb-4">Quiz Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                  value={quizData.title}
                  onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                  placeholder="e.g. Wits Campus History Quiz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                  value={quizData.category}
                  onChange={(e) => setQuizData({ ...quizData, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty (optional)</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                  value={quizData.faculty}
                  onChange={(e) => setQuizData({ ...quizData, faculty: e.target.value })}
                >
                  <option value="">No faculty specific</option>
                  {faculties.map(fac => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#1a237e]">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-[#1a237e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0d1550] transition-colors flex items-center gap-1"
              >
                <Plus size={16} /> Add Question
              </button>
            </div>

            {quizData.questions.map((q, qIndex) => (
              <div key={qIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-[#1a237e]">Question {qIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      placeholder="e.g. What year was Wits University founded?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Options *</label>
                    {q.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500 w-6">{String.fromCharCode(65 + oIndex)}.</span>
                        <input
                          type="text"
                          required
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer *</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      value={q.correctAnswerIndex}
                      onChange={(e) => updateQuestion(qIndex, 'correctAnswerIndex', parseInt(e.target.value))}
                    >
                      {q.options.map((_, oIndex) => (
                        <option key={oIndex} value={oIndex}>Option {String.fromCharCode(65 + oIndex)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Explanation *</label>
                    <textarea
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                      rows="2"
                      value={q.explanation}
                      onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                      placeholder="Explain why this is the correct answer..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1a237e] text-white py-3 rounded-xl font-semibold hover:bg-[#0d1550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
            ) : (
              'Submit Quiz for Review'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitQuiz;
