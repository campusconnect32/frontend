import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

// ======================  CATEGORY ICONS  ======================
const CATEGORY_ICONS = {
  'General Knowledge': '🧠',
  'South African Trivia': '🇿🇦',
  'Campus Life': '🏫',
  'Current Affairs': '📰',
  'Science & Technology': '🔬',
  'Accounting & Accounting Science': '📊',
  'Law (LLB)': '⚖️',
  'Commerce (General/Finance/HR/Management)': '🏢',
  'Economics & Economic Science': '📈',
  'Information Systems': '💻',
  'Politics, Philosophy & Economics': '📚',
  'Computer Science': '💻',
  'Actuarial Science': '📊',
  'Biological Sciences': '🧬',
  'Chemistry & Materials Science': '🧪',
  'Civil Engineering': '🏗️',
  'Electrical Engineering': '⚡',
  'Mechanical Engineering': '🔧',
  'Chemical Engineering': '🧪',
  'Mining Engineering': '⛏️',
  'Biomedical Engineering': '🏥',
  'Architecture & Built Environment': '🏛️',
  'Aeronautical Engineering': '✈️',
  'Industrial Engineering': '🏭',
  'Medicine (MBChB)': '🩺',
  'Pharmacy': '💊',
  'Nursing': '👩‍⚕️',
  'Dentistry & Oral Health': '🦷',
  'Physiotherapy & Occupational Therapy': '💪',
  'Biomedical & Health Sciences': '🔬',
  'Humanities': '📚',
  'Education': '📖',
  'Film, Theatre & Fine Arts': '🎭',
  'Music': '🎵',
  'Social Work & Community Development': '🤝',
  'Speech-Language Pathology & Audiology': '🗣️',
  'Geological & Geographical Sciences': '🌍',
  'Environmental Studies': '🌿',
  'Mathematics & Applied Maths': '➗',
  'Physics & Astronomy': '🌌',
  'Digital Arts (Engineering)': '🎨',
  // University‑specific short forms
  'Commerce': '💼',
  'Engineering': '🔧',
  'Health Sciences': '🏥',
  'Science': '🔬',
  'AgriSciences': '🌾',
  'Veterinary Science': '🐕',
  'Theology': '✝️',
  'Art & Design': '🎨',
  'Dentistry': '🦷',
  'Accounting': '📊',
  'Law': '⚖️',
  'Economics': '📈',
  'Information Technology': '💻',
  'Politics': '📚',
  'Actuarial': '📊',
  'Biology': '🧬',
  'Chemistry': '🧪',
  'Civil': '🏗️',
  'Electrical': '⚡',
  'Mechanical': '🔧',
  'Chemical': '🧪',
  'Mining': '⛏️',
  'Biomedical': '🏥',
  'Architecture': '🏛️',
  'Aeronautical': '✈️',
  'Industrial': '🏭',
  'Medicine': '🩺',
  'Pharmacy': '💊',
  'Nursing': '👩‍⚕️',
  'Physiotherapy': '💪',
  'Speech Pathology': '🗣️',
  'Geology': '🌍',
  'Environmental': '🌿',
  'Mathematics': '➗',
  'Physics': '🌌',
  'Digital Arts': '🎨',
};

// =====================  COMPONENT  =====================
function Quiz() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showDegree, setShowDegree] = useState(false);
  const [approvedQuizzes, setApprovedQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [university, setUniversity] = useState(null);

  // Submit Quiz Modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quizForm, setQuizForm] = useState({
    title: '',
    category: Object.keys(CATEGORY_ICONS)[0] || 'General Knowledge',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      }
    ]
  });

  // Detect user's university (or mirror university)
  useEffect(() => {
    const mirrorActive = localStorage.getItem('mirrorMode') === 'true';
    if (mirrorActive) {
      const mirrorName = localStorage.getItem('mirrorUniversityName');
      const mirrorId = localStorage.getItem('mirrorUniversityId');
      if (mirrorName && mirrorId) {
        setUniversity({ name: mirrorName, id: mirrorId });
      }
    } else {
      const saved = localStorage.getItem('selectedUniversity');
      if (saved) {
        try {
          setUniversity(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing university:', e);
        }
      }
    }
  }, []);

  // Fetch approved quizzes from backend
  useEffect(() => {
    if (user) {
      fetchApprovedQuizzes();
    } else {
      setApprovedQuizzes([]);
      setLoadingQuizzes(false);
    }
  }, [user, university?.id]);

  const fetchApprovedQuizzes = async () => {
    setLoadingQuizzes(true);
    try {
      const res = await api.get('/quizzes');
      const quizzes = res.data || [];
      const processed = quizzes.map(q => ({
        ...q,
        questions: Array.isArray(q.questions) ? q.questions : JSON.parse(q.questions || '[]')
      }));
      setApprovedQuizzes(processed);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
      toast.error('Could not load quizzes');
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const addQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
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
    if (quizForm.questions.length <= 1) {
      toast.warning('You need at least one question');
      return;
    }
    const newQuestions = quizForm.questions.filter((_, i) => i !== index);
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[index][field] = value;
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const handleSubmitQuiz = async () => {
    if (!quizForm.title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }
    
    for (let i = 0; i < quizForm.questions.length; i++) {
      const q = quizForm.questions[i];
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
      await api.post('/quizzes', {
        title: quizForm.title.trim(),
        category: quizForm.category,
        questions: quizForm.questions
      });
      
      toast.success('Quiz submitted for review!');
      setShowSubmitModal(false);
      setQuizForm({
        title: '',
        category: Object.keys(CATEGORY_ICONS)[0] || 'General Knowledge',
        questions: [
          {
            question: '',
            options: ['', '', '', ''],
            correctAnswerIndex: 0,
            explanation: ''
          }
        ]
      });
      fetchApprovedQuizzes();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Build category lists with proper icons
  const generalCategories = approvedQuizzes
    .filter(q => !isDegreeCategory(q.category))
    .map(q => ({
      id: q.quiz_id,
      name: q.title,
      icon: CATEGORY_ICONS[q.category] || '📝',
      questions: q.questions,
      category: q.category,
    }));

  const degreeCategories = approvedQuizzes
    .filter(q => isDegreeCategory(q.category))
    .map(q => ({
      id: q.quiz_id,
      name: q.title,
      icon: CATEGORY_ICONS[q.category] || '📝',
      questions: q.questions,
      category: q.category,
    }));

  const currentCategories = showDegree ? degreeCategories : generalCategories;
  const currentQuestions = selectedCategory?.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Helper: decide if a category is degree‑related (so we can split tabs)
  function isDegreeCategory(cat) {
    const degreeKeywords = [
      'Accounting', 'Law', 'Commerce', 'Economics', 'Information Systems',
      'Politics', 'Computer Science', 'Actuarial Science', 'Biological Sciences',
      'Chemistry', 'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering',
      'Chemical Engineering', 'Mining Engineering', 'Biomedical Engineering', 'Architecture',
      'Aeronautical Engineering', 'Industrial Engineering', 'Medicine', 'Pharmacy',
      'Nursing', 'Dentistry', 'Physiotherapy', 'Biomedical Sciences', 'Humanities',
      'Education', 'Film & Theatre', 'Music', 'Social Work', 'Speech Pathology',
      'Geology', 'Environmental Studies', 'Mathematics', 'Physics', 'Digital Arts',
      'AgriSciences', 'Veterinary Science', 'Theology', 'Art & Design', 'Dentistry'
    ];
    return degreeKeywords.some(k => cat.includes(k));
  }

  // ---------- Category selection screen ----------
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ color: '#1a237e', margin: 0 }}>📝 Campus Connect Quizzes</h1>
              <p style={{ color: '#666', margin: '5px 0 0 0' }}>Test your knowledge! Choose a category below:</p>
            </div>
            <button
              onClick={() => setShowSubmitModal(true)}
              style={{
                padding: '10px 20px',
                background: '#1a237e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} /> Submit Quiz
            </button>
          </div>

          {university && (
            <div style={{ textAlign: 'center', margin: '10px 0 20px', padding: '10px', background: '#e3f2fd', borderRadius: '8px' }}>
              <span style={{ color: '#1a237e', fontWeight: 'bold' }}>🎓 {university.name}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '20px 0' }}>
            <button
              onClick={() => setShowDegree(false)}
              style={{
                padding: '10px 25px',
                background: !showDegree ? '#1a237e' : 'white',
                color: !showDegree ? 'white' : '#1a237e',
                border: '2px solid #1a237e',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🎯 General Quizzes
            </button>
            <button
              onClick={() => setShowDegree(true)}
              style={{
                padding: '10px 25px',
                background: showDegree ? '#1a237e' : 'white',
                color: showDegree ? 'white' : '#1a237e',
                border: '2px solid #1a237e',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🎓 Degree Quizzes
            </button>
          </div>

          {loadingQuizzes ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Loader2 className="animate-spin" size={32} style={{ color: '#1a237e', margin: '0 auto' }} />
              <p style={{ color: '#666', marginTop: '10px' }}>Loading quizzes...</p>
            </div>
          ) : currentCategories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No quizzes available yet in this section.</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>Be the first to submit one!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {currentCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: '2px solid #4CAF50',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1a237e'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#4CAF50'}
                >
                  <div style={{ fontSize: '3rem' }}>{cat.icon}</div>
                  <h3 style={{ color: '#1a237e', margin: '10px 0 5px' }}>{cat.name}</h3>
                  <p style={{ color: '#888', fontSize: '0.9rem' }}>{cat.questions.length} questions</p>
                  {/* Removed the "✅ Approved" line */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Quiz Modal */}
        {showSubmitModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '30px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#1a237e', margin: 0 }}>📝 Submit a New Quiz</h2>
                <button onClick={() => setShowSubmitModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Quiz Title</label>
                <input
                  type="text"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g. Wits Campus History Quiz"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Category</label>
                <select
                  value={quizForm.category}
                  onChange={(e) => setQuizForm({ ...quizForm, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  {Object.keys(CATEGORY_ICONS).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Questions section (same as before) */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ color: '#1a237e', margin: 0 }}>Questions</h3>
                  <button
                    onClick={addQuestion}
                    style={{
                      background: '#1a237e',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Plus size={16} /> Add Question
                  </button>
                </div>

                {quizForm.questions.map((q, qIndex) => (
                  <div key={qIndex} style={{
                    background: '#f9f9f9',
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '15px',
                    border: '1px solid #eee'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#1a237e' }}>Question {qIndex + 1}</span>
                      <button
                        onClick={() => removeQuestion(qIndex)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f44336' }}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        placeholder="Enter question text"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#555' }}>Options</label>
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                          <span style={{ width: '20px', fontWeight: 'bold', color: '#1a237e' }}>
                            {String.fromCharCode(65 + oIndex)}.
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                            style={{
                              flex: 1,
                              padding: '8px',
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#555' }}>Correct Answer</label>
                      <select
                        value={q.correctAnswerIndex}
                        onChange={(e) => updateQuestion(qIndex, 'correctAnswerIndex', parseInt(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        {q.options.map((_, oIndex) => (
                          <option key={oIndex} value={oIndex}>
                            Option {String.fromCharCode(65 + oIndex)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#555' }}>Explanation</label>
                      <textarea
                        value={q.explanation}
                        onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                        placeholder="Explain why this is the correct answer..."
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '14px',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: submitting ? '#ccc' : '#1a237e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {submitting ? (
                  <><Loader2 className="animate-spin" size={18} /> Submitting...</>
                ) : (
                  'Submit Quiz for Review'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- Quiz Completed Screen (unchanged) ----------
  if (quizCompleted) {
    const percentage = Math.round((score / currentQuestions.length) * 100);
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <div style={{ padding: '50px', textAlign: 'center', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ fontSize: '4rem' }}>🎉</div>
          <h1>Quiz Complete!</h1>
          <p style={{ fontSize: '20px' }}>
            You got <strong style={{ color: '#1a237e', fontSize: '32px' }}>{score}</strong> out of <strong>{currentQuestions.length}</strong> correct
          </p>
          <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#1a237e' }}>{percentage}%</p>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentQuestionIndex(0);
              setSelectedOption(null);
              setShowExplanation(false);
              setScore(0);
              setQuizCompleted(false);
            }}
            style={{
              padding: '12px 30px',
              background: '#1a237e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            🔄 Try Another Quiz
          </button>
        </div>
      </div>
    );
  }

  // ---------- Question Screen (unchanged) ----------
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setCurrentQuestionIndex(0);
            setSelectedOption(null);
            setShowExplanation(false);
            setScore(0);
            setQuizCompleted(false);
          }}
          style={{
            padding: '8px 20px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        >
          ← Back to Categories
        </button>

        <h2 style={{ color: '#1a237e' }}>{selectedCategory.icon} {selectedCategory.name}</h2>
        <p style={{ color: '#666' }}>Question {currentQuestionIndex + 1} of {currentQuestions.length}</p>

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '25px' }}>{currentQuestion.question}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQuestion.options.map((option, index) => {
              let style = {
                padding: '15px 20px',
                background: '#f8f9fa',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                cursor: selectedOption === null ? 'pointer' : 'default',
                transition: 'all 0.3s',
                fontSize: '16px',
                textAlign: 'left'
              };
              if (selectedOption !== null) {
                if (index === currentQuestion.correctAnswerIndex) {
                  style.background = '#c8e6c9';
                  style.borderColor = '#2e7d32';
                } else if (index === selectedOption && index !== currentQuestion.correctAnswerIndex) {
                  style.background = '#ffcdd2';
                  style.borderColor = '#c62828';
                } else {
                  style.opacity = '0.6';
                }
              }
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (selectedOption !== null) return;
                    setSelectedOption(index);
                    setShowExplanation(true);
                    if (index === currentQuestion.correctAnswerIndex) {
                      setScore(score + 1);
                    }
                  }}
                  style={style}
                  disabled={selectedOption !== null}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div style={{
              marginTop: '25px',
              padding: '20px',
              background: '#e3f2fd',
              borderRadius: '12px',
              borderLeft: '4px solid #1a237e'
            }}>
              <h4 style={{ color: '#1a237e', margin: '0 0 10px 0' }}>💡 Explanation</h4>
              <p style={{ margin: 0, lineHeight: '1.6' }}>{currentQuestion.explanation}</p>
            </div>
          )}

          {showExplanation && (
            <button
              onClick={() => {
                if (currentQuestionIndex < currentQuestions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                  setSelectedOption(null);
                  setShowExplanation(false);
                } else {
                  setQuizCompleted(true);
                }
              }}
              style={{
                marginTop: '20px',
                padding: '12px 40px',
                background: '#1a237e',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question →' : 'See Results 🏆'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;