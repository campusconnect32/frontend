import React, { useState, useEffect } from 'react';
import { quizData } from '../lib/quizData';
import { getUniversityDegrees } from '../lib/universityQuizData';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function Quiz() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showDegree, setShowDegree] = useState(false);
  const [university, setUniversity] = useState(null);
  const [universityDegrees, setUniversityDegrees] = useState(null);
  
  // Submit Quiz Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quizForm, setQuizForm] = useState({
    title: '',
    category: 'General',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      }
    ]
  });

  // Detect user's university from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selectedUniversity');
    if (saved) {
      try {
        const uni = JSON.parse(saved);
        setUniversity(uni);
        const degrees = getUniversityDegrees(uni.id);
        if (degrees) {
          setUniversityDegrees(degrees);
        }
      } catch (e) {
        console.error('Error parsing university:', e);
      }
    }
  }, []);

  // Submit Quiz Functions
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
      const pendingList = JSON.parse(localStorage.getItem('adminPendingQuizzes') || '[]');
      const newSubmission = {
        id: Date.now(),
        ...quizForm,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        submittedBy: user?.email || 'Student'
      };
      
      pendingList.push(newSubmission);
      localStorage.setItem('adminPendingQuizzes', JSON.stringify(pendingList));
      
      toast.success('Quiz submitted for review!');
      setShowSubmitModal(false);
      setQuizForm({
        title: '',
        category: 'General',
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

  const categoryOptions = [
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
    'Science'
  ];

  const categories = showDegree ? quizData.degreeCategories : quizData.categories;
  const currentQuestions = selectedCategory?.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Get university-specific degree categories if available
  const getUniversityCategories = () => {
    if (universityDegrees && universityDegrees.degrees) {
      return universityDegrees.degrees.map(deg => ({
        id: deg.id,
        name: deg.name,
        icon: deg.icon || '🎓',
        questions: deg.questions,
        faculty: universityDegrees.name,
        isUniversitySpecific: true
      }));
    }
    return [];
  };

  const universityCategories = getUniversityCategories();
  const allDegreeCategories = [...universityCategories, ...quizData.degreeCategories];

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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {(showDegree ? allDegreeCategories : categories).map((cat) => (
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
                  border: cat.isUniversitySpecific ? '2px solid #4CAF50' : '2px solid transparent',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1a237e'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = cat.isUniversitySpecific ? '#4CAF50' : 'transparent'}
              >
                <div style={{ fontSize: '3rem' }}>{cat.icon || '📝'}</div>
                <h3 style={{ color: '#1a237e', margin: '10px 0 5px' }}>{cat.name}</h3>
                {cat.faculty && <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0' }}>{cat.faculty}</p>}
                <p style={{ color: '#888', fontSize: '0.9rem' }}>{cat.questions.length} questions</p>
                {cat.isUniversitySpecific && (
                  <p style={{ color: '#4CAF50', fontSize: '0.8rem', marginTop: '5px' }}>✅ Your University</p>
                )}
              </div>
            ))}
          </div>
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
              padding: '30px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#1a237e' }}>Submit a Quiz</h2>
                <button onClick={() => setShowSubmitModal(false)} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '24px' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Quiz Title</label>
                <input
                  type="text"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                  placeholder="e.g. Wits Campus History Quiz"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Category</label>
                <select
                  value={quizForm.category}
                  onChange={(e) => setQuizForm({...quizForm, category: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                >
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontWeight: 'bold' }}>Questions</label>
                  <button onClick={addQuestion} style={{ padding: '4px 12px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + Add Question
                  </button>
                </div>

                {quizForm.questions.map((q, qIndex) => (
                  <div key={qIndex} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>Question {qIndex + 1}</strong>
                      <button onClick={() => removeQuestion(qIndex)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                    </div>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '8px' }}
                      placeholder="Enter question..."
                    />
                    <div style={{ marginTop: '8px' }}>
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            style={{ flex: 1, padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                          />
                        </div>
                      ))}
                      <select
                        value={q.correctAnswerIndex}
                        onChange={(e) => updateQuestion(qIndex, 'correctAnswerIndex', parseInt(e.target.value))}
                        style={{ marginTop: '8px', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                      >
                        {q.options.map((_, oIndex) => (
                          <option key={oIndex} value={oIndex}>Correct: {String.fromCharCode(65 + oIndex)}</option>
                        ))}
                      </select>
                      <textarea
                        value={q.explanation}
                        onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '8px' }}
                        placeholder="Explanation..."
                        rows="2"
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
                  background: '#1a237e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Quiz for Review'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

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
        {selectedCategory.isUniversitySpecific && (
          <p style={{ color: '#4CAF50', fontSize: '0.9rem', marginTop: '4px' }}>🎓 Your University Quiz</p>
        )}
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
