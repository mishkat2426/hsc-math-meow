import React, { useState, useEffect, useRef } from 'react';
import { playHappyMeow, playSadMeow, playVictoryMeow } from '../utils/audioSynth';

const BENGALI_TO_ENGLISH_CHAPS = {
  "ম্যাট্রিক্স ও নির্ণায়ক": "Matrices & Determinants",
  "ভেক্টর": "Vectors",
  "সরলরেখা": "Straight Lines",
  "বৃত্ত": "Circles",
  "ত্রিকোণমিতি": "Trigonometry",
  "অান্তরীকরণ": "Differentiation",
  "যোগজীকরণ": "Integration"
};

export default function ExamRoom({ mode, chapterDetails, questionsPool, overallTimeLimit, onFinishExam, onBack, onShowToast }) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3); // only for boss mode
  const [totalElapsed, setTotalElapsed] = useState(0); // Track total elapsed time
  
  const [mimiState, setMimiState] = useState('idle');
  const [mimiBubbleText, setMimiBubbleText] = useState("Meow! Do math carefully, you'll fall into traps if you make mistakes! 🐾");

  const mathContainerRef = useRef(null); // Ref to render math in current question

  // Initialize questions
  useEffect(() => {
    let pool = [];
    if (mode === 'quick') {
      pool = [...questionsPool].sort(() => 0.5 - Math.random()).slice(0, 10);
    } else if (mode === 'boss') {
      pool = [...questionsPool].sort(() => 0.5 - Math.random());
      setHearts(3);
    } else if (mode === 'chapter') {
      pool = questionsPool.filter(q => q.chapter === chapterDetails);
      pool = pool.sort(() => 0.5 - Math.random()).slice(0, 50); // Set to 50 questions!
    }
    setCurrentQuestions(pool);
    setCurrentIndex(0);
    setScore(0);
    setHasAnswered(false);
    setSelectedOption(null);
    setTotalElapsed(0);
    updateMimiBubble('idle');
  }, [mode, chapterDetails, questionsPool]);

  // Run overall session timer
  useEffect(() => {
    const elapsedTimer = setInterval(() => {
      setTotalElapsed(prev => {
        const nextTime = prev + 1;
        // Check if overall timer expired
        if (overallTimeLimit !== 'none') {
          const limitSeconds = parseInt(overallTimeLimit) * 60;
          if (nextTime >= limitSeconds) {
            clearInterval(elapsedTimer);
            if (onShowToast) {
              onShowToast("⏰ Dojo Overall Session Timer Expired! Submitting your answers...", "info");
            } else {
              alert("⏰ Dojo Overall Session Timer Expired! Submitting your answers...");
            }
            handleFinish(score, false, limitSeconds);
          }
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(elapsedTimer);
  }, [overallTimeLimit, currentQuestions, score]);

  // Trigger KaTeX rendering on new question or answer display
  useEffect(() => {
    if (mathContainerRef.current && window.renderMathInElement) {
      try {
        window.renderMathInElement(mathContainerRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn("KaTeX rendering error: ", err);
      }
    }
  }, [currentIndex, hasAnswered, currentQuestions]);

  const updateMimiBubble = (state) => {
    setMimiState(state);
    if (state === 'idle') {
      const phrases = [
        "Meow! Do math carefully, you'll fall into traps if you make mistakes! 🐾",
        "The math traps for HSC 2026 are extremely subtle! 🙀",
        "Paper and pen ready, kitty? Calculate carefully! 📝🐈",
        "Focus is key to reaching the top of the leaderboard! ✨🐱"
      ];
      setMimiBubbleText(phrases[Math.floor(Math.random() * phrases.length)]);
    } else if (state === 'correct') {
      const phrases = [
        "Wow! You are indeed a genius kitty! Correct answer! 😸🎉",
        "Great! You spotted the trap! Keep going! 😻🌸",
        "Perfect! No traps can stop you now! 🐾💖"
      ];
      setMimiBubbleText(phrases[Math.floor(Math.random() * phrases.length)]);
    } else if (state === 'wrong') {
      const phrases = [
        "Oh my gosh! You fell into the trap! 😿💔",
        "Aww! That was an extreme trap! Read the analysis! 🙀💦",
        "Don't be sad kitty, you will get it next time! 🐈🩹"
      ];
      setMimiBubbleText(phrases[Math.floor(Math.random() * phrases.length)]);
    }
  };

  const handleOptionClick = (optIndex) => {
    if (hasAnswered) return;

    setSelectedOption(optIndex);
    setHasAnswered(true);

    const currentQ = currentQuestions[currentIndex];
    const isCorrect = optIndex === currentQ.correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 1);
      playHappyMeow();
      updateMimiBubble('correct');
    } else {
      playSadMeow();
      updateMimiBubble('wrong');

      if (mode === 'boss') {
        setHearts(prev => {
          const nextHearts = prev - 1;
          if (nextHearts <= 0) {
            setTimeout(() => {
              handleFinish(score, true, totalElapsed);
            }, 3000);
          }
          return nextHearts;
        });
      }
    }
  };

  const handleNext = () => {
    const isLastQuestion = currentIndex >= currentQuestions.length - 1;

    if (isLastQuestion || (mode === 'boss' && hearts <= 0)) {
      handleFinish(score, false, totalElapsed);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
      updateMimiBubble('idle');
    }
  };

  const handleFinish = (finalScore, isGameOver = false, finalTime = totalElapsed) => {
    playVictoryMeow();

    let xpGained = finalScore * 25;
    let staminaUsed = 0;

    if (mode === 'quick') {
      staminaUsed = 15;
      xpGained += 50;
    } else if (mode === 'boss') {
      staminaUsed = 25;
      xpGained += 100;
    } else if (mode === 'chapter') {
      staminaUsed = 10;
      xpGained += 30;
    }

    const engMode = mode === 'quick' ? 'Quick Test' : mode === 'boss' ? 'Boss Fight' : `Chapter: ${BENGALI_TO_ENGLISH_CHAPS[chapterDetails] || chapterDetails}`;

    onFinishExam({
      xpGained,
      staminaUsed,
      correctCount: finalScore,
      totalCount: mode === 'boss' ? finalScore + (3 - hearts) : currentQuestions.length,
      modeName: engMode,
      isGameOver,
      timeSpent: finalTime
    });
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (currentQuestions.length === 0) {
    return (
      <div className="cute-card" style={{ textAlign: 'center', padding: '50px' }}>
        <h3>Loading, kitty... 🐾</h3>
      </div>
    );
  }

  const currentQ = currentQuestions[currentIndex];

  const formatTextWithMath = (text) => {
    let formatted = text;
    if (formatted.includes('\\begin{bmatrix}') && !formatted.includes('$')) {
      formatted = formatted.replace(/\\begin\{bmatrix\}/g, '$\\begin{bmatrix}');
      formatted = formatted.replace(/\\end\{bmatrix\}/g, '\\end{bmatrix}$');
    }
    return formatted;
  };

  return (
    <div className="exam-layout">
      {/* Left side: Question & options */}
      <div className="exam-main" ref={mathContainerRef}>
        <div className="cute-card question-card">
          <div className="exam-meta">
            <span style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-light)' }}>
              🎯 {mode === 'quick' ? `Question: ${currentIndex + 1}/10` : mode === 'boss' ? `Boss Score: ${score}` : `Question: ${currentIndex + 1}/${currentQuestions.length}`}
            </span>
            
            {mode === 'boss' && (
              <div style={{ display: 'flex', gap: '5px', fontSize: '1.3rem' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} style={{ color: i < hearts ? '#ff4081' : '#e0e0e0', filter: i < hearts ? 'drop-shadow(0 0 2px rgba(255, 64, 129, 0.4))' : 'none' }}>
                    ❤️
                  </span>
                ))}
              </div>
            )}

            {/* Overall Session Timer (No individual question countdown) */}
            <div style={{
              background: 'rgba(255, 142, 187, 0.1)',
              border: '1.5px solid var(--primary-pink)',
              padding: '6px 12px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.92rem',
              color: 'var(--text-dark)'
            }}>
              ⏱️ {overallTimeLimit !== 'none' 
                ? `Overall Time: ${formatTime(Math.max(0, parseInt(overallTimeLimit) * 60 - totalElapsed))} Left` 
                : `Time Elapsed: ${formatTime(totalElapsed)}`
              }
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--primary-pink-hover)', fontWeight: 'bold', marginBottom: '8px' }}>
            📂 Chapter: {BENGALI_TO_ENGLISH_CHAPS[currentQ.chapter] || currentQ.chapter}
          </div>

          <div className="question-text">
            {formatTextWithMath(currentQ.text)}
          </div>

          <div className="options-list">
            {currentQ.options.map((option, idx) => {
              let optionClass = '';
              if (hasAnswered) {
                if (idx === currentQ.correctIndex) {
                  optionClass = 'correct';
                } else if (idx === selectedOption) {
                  optionClass = 'wrong';
                }
              }

              const letters = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={idx}
                  className={`option-btn ${optionClass}`}
                  onClick={() => handleOptionClick(idx)}
                  disabled={hasAnswered}
                >
                  <span>
                    <span className="option-letter">{letters[idx]}</span>
                    {formatTextWithMath(option)}
                  </span>
                  
                  {hasAnswered && idx === currentQ.correctIndex && <span>✅</span>}
                  {hasAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <span>❌</span>}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className={`trap-report ${selectedOption === currentQ.correctIndex ? 'success' : 'danger'}`}>
              <div className="trap-title">
                {selectedOption === currentQ.correctIndex ? '😺 Wow! Trap avoided!' : '🙀 Oh no! Trapped!'}
              </div>
              <div className="trap-text">
                <strong>Trap Analysis:</strong> {currentQ.trapExplanation}
              </div>
              
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="cute-btn" onClick={handleNext}>
                  {currentIndex >= currentQuestions.length - 1 || (mode === 'boss' && hearts === 0) ? 'Finish Exam 🏁' : 'Next Question 🐾'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Mimi Assistant */}
      <div className="exam-sidebar">
        <div className="mimi-assistant">
          <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Math Guide Mimi 🐱</h4>
          
          <div 
            className={`mimi-cat-avatar ${mimiState === 'correct' ? 'happy' : mimiState === 'wrong' ? 'sad' : ''}`}
            onClick={() => {
              playHappyMeow();
              updateMimiBubble('idle');
            }}
          >
            {mimiState === 'correct' ? '😸' : mimiState === 'wrong' ? '😿' : '🐱'}
          </div>

          <div className="mimi-bubble">
            {mimiBubbleText}
          </div>

          <button 
            className="cute-btn cute-btn-outline" 
            style={{ marginTop: '20px', width: '100%', fontSize: '0.9rem', padding: '8px' }}
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel the exam and return to the dashboard? Meow?')) {
                onBack();
              }
            }}
          >
            ❌ Cancel Exam
          </button>
        </div>
      </div>
    </div>
  );
}
