import React, { useState } from 'react';
import { quizData } from '../lib/quizData';
import Navbar from '@/components/Navbar';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

function Quiz() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showDegree, setShowDegree] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Load approved quizzes from localStorage
  const approvedQuizzes = JSON.parse(localStorage.getItem('approvedQuizzes') || '[]');
  
  // Combine with existing categories
  const categories = showDegree ? quizData.degreeCategories : quizData.categories;
  
  // Add approved quizzes as a special category
  const allCategories = [...categories];
  if (approvedQuizzes.length > 0) {
    allCategories.push({
      id: 'approved',
      name: '✅ Submitted Quizzes',
      icon: '✅',
      questions: approvedQuizzes.flatMap(q => q.questions)
    });
  }

  const currentQuestions = selectedCategory?.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Category selection screen
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
            {allCategories.map((cat) => (
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
                  border: cat.id === 'approved' ? '2px solid #4CAF50' : '2px solid transparent',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1a237e'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = cat.id === 'approved' ? '#4CAF50' : 'transparent'}
              >
                <div style={{ fontSize: '3rem' }}>{cat.icon || '📝'}</div>
                <h3 style={{ color: '#1a237e', margin: '10px 0 5px' }}>{cat.name}</h3>
                {cat.faculty && <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0' }}>{cat.faculty}</p>}
                <p style={{ color: '#888', fontSize: '0.9rem' }}>{cat.questions.length} questions</p>
                {cat.id === 'approved' && <p style={{ color: '#4CAF50', fontSize: '0.8rem' }}>✅ Approved</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Quiz completed screen
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

  // Question screen
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
