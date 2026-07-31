import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { generateQuestions } from './data/questionsGenerator';
import { playWelcomeMeow, playHappyMeow, playSadMeow, playVictoryMeow, setSoundEnabled } from './utils/audioSynth';

import AvatarSelector from './components/AvatarSelector';
import Dashboard from './components/Dashboard';
import ExamRoom from './components/ExamRoom';
import Leaderboard from './components/Leaderboard';
import UpgradeCondition from './components/UpgradeCondition';
import CuteFooter from './components/CuteFooter';
import FormulaHub from './components/FormulaHub';

const INITIAL_LEADERBOARD = [
  { name: "Mishkat (Creator) 👑", avatar: "🦁", xp: 5000 }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [tempName, setTempName] = useState('');
  const [tempAvatar, setTempAvatar] = useState('🐱');
  const [view, setView] = useState('register');
  const [examConfig, setExamConfig] = useState({ mode: '', chapterDetails: null });
  const [questionsPool, setQuestionsPool] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastExamResult, setLastExamResult] = useState(null);
  const [overallTimeLimit, setOverallTimeLimit] = useState('none'); // 'none', 5, 10, 20, 30
  const [toast, setToast] = useState(null);
  const [soundOn, setSoundOn] = useState(true);

  const reviewContainerRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const toggleSound = () => {
    const nextSound = !soundOn;
    setSoundOn(nextSound);
    setSoundEnabled(nextSound);
    showToast(nextSound ? "🔊 Sound Effects Enabled" : "🔇 Sound Muted", "info");
  };

  useEffect(() => {
    const pool = generateQuestions();
    setQuestionsPool(pool);

    const savedUser = localStorage.getItem('meow_math_user');
    const savedLeaderboard = localStorage.getItem('meow_math_leaderboard');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setView('dashboard');
    }

    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    } else {
      setLeaderboard(INITIAL_LEADERBOARD);
    }
  }, []);

  useEffect(() => {
    if (view === 'dashboard' && user) {
      playWelcomeMeow();
    }
  }, [view]);

  // Trigger KaTeX rendering on review items
  useEffect(() => {
    if (view === 'result' && reviewContainerRef.current && window.renderMathInElement) {
      try {
        window.renderMathInElement(reviewContainerRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn("KaTeX rendering error in review: ", err);
      }
    }
  }, [view, lastExamResult]);

  const saveUserData = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('meow_math_user', JSON.stringify(updatedUser));

    setLeaderboard(prev => {
      let playerExists = false;
      let newLB = prev.map(player => {
        if (player.name === updatedUser.name) {
          playerExists = true;
          return { ...player, xp: updatedUser.xp, avatar: updatedUser.avatar };
        }
        return player;
      });

      if (!playerExists) {
        newLB.push({ name: updatedUser.name, avatar: updatedUser.avatar, xp: updatedUser.xp });
      }

      newLB.sort((a, b) => b.xp - a.xp);
      localStorage.setItem('meow_math_leaderboard', JSON.stringify(newLB));
      return newLB;
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!tempName.trim()) {
      showToast("Meow! Please enter your name! 🐾", "error");
      return;
    }

    const newUser = {
      name: tempName.trim(),
      avatar: tempAvatar,
      xp: 0,
      stamina: 100,
      activities: [
        { action: "Joined MeowMath Elite Academy! 🌸", time: "Just now", status: "success" }
      ],
      chapterHighScores: {},
      totalCorrect: 0,
      totalAttempted: 0,
      examsCount: 0
    };

    saveUserData(newUser);
    setView('dashboard');
  };

  const handleStartExam = (mode, details = null) => {
    if (mode === 'leaderboard') {
      setView('leaderboard');
    } else if (mode === 'formulas') {
      setView('formulas');
    } else if (mode === 'upgrade') {
      setView('upgrade');
    } else {
      const requiredStamina = mode === 'quick' ? 15 : mode === 'boss' ? 25 : 10;
      if (user.stamina < requiredStamina) {
        playSadMeow();
        showToast(`Meow! Insufficient stamina (${requiredStamina}% required). Visit the Math Spa to recharge! 😿⚡`, "error");
        setView('upgrade');
        return;
      }

      setExamConfig({ mode, chapterDetails: details });
      setView('exam');
    }
  };

  const handleFinishExam = ({ xpGained, staminaUsed, correctCount, totalCount, modeName, isGameOver, timeSpent, userAnswers }) => {
    const newActivity = {
      action: `Completed ${modeName} exam! (Score: ${correctCount}/${totalCount}, +${xpGained} XP) 🏆`,
      time: "Just now",
      status: "success"
    };

    const updatedUser = {
      ...user,
      xp: user.xp + xpGained,
      stamina: Math.max(0, user.stamina - staminaUsed),
      activities: [newActivity, ...(user.activities || [])].slice(0, 10),
      chapterHighScores: {
        ...(user.chapterHighScores || {})
      },
      totalCorrect: (user.totalCorrect || 0) + correctCount,
      totalAttempted: (user.totalAttempted || 0) + totalCount,
      examsCount: (user.examsCount || 0) + 1
    };

    // Update chapter-wise high scores
    const isChapterMode = modeName.startsWith("Chapter: ");
    const chapName = isChapterMode ? modeName.replace("Chapter: ", "") : null;
    
    if (chapName) {
      const prevHigh = (user.chapterHighScores && user.chapterHighScores[chapName]) || 0;
      if (correctCount > prevHigh) {
        updatedUser.chapterHighScores[chapName] = correctCount;
      }
    }

    setLastExamResult({
      correctCount,
      totalCount,
      xpGained,
      staminaUsed,
      modeName,
      isGameOver,
      timeSpent,
      userAnswers: userAnswers || []
    });

    saveUserData(updatedUser);
    setView('result');
  };

  const handleUpgradeComplete = (staminaGained, xpGained) => {
    const newActivity = {
      action: `Upgraded condition at the Math Spa! (+&staminaGained}% Stamina, +${xpGained} XP) ⚡`,
      time: "Just now",
      status: "success"
    };

    const updatedUser = {
      ...user,
      stamina: Math.min(100, user.stamina + staminaGained),
      xp: user.xp + xpGained,
      activities: [newActivity, ...(user.activities || [])].slice(0, 10)
    };
    saveUserData(updatedUser);
  };

  const handleResetUser = () => {
    if (window.confirm("Meow! Are you sure you want to reset all progress and start fresh?")) {
      localStorage.removeItem('meow_math_user');
      localStorage.removeItem('meow_math_leaderboard');
      setUser(null);
      setTempName('');
      setTempAvatar('🐱');
      setLeaderboard(INITIAL_LEADERBOARD);
      setView('register');
      showToast("Progress Reset successfully!", "info");
    }
  };

  return (
    <div className="app-container">
      {/* Dynamic Toast Notifications Overlay */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: toast.type === 'error' ? '#ffe6e6' : toast.type === 'success' ? '#e6ffe6' : 'rgba(255, 255, 255, 0.9)',
          border: toast.type === 'error' ? '2.5px solid #ff8080' : toast.type === 'success' ? '2.5px solid #62c362' : '2.5px solid var(--primary-pink)',
          color: toast.type === 'error' ? '#7f2626' : toast.type === 'success' ? '#1e591e' : 'var(--text-dark)',
          padding: '15px 25px',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          fontWeight: '700',
          fontFamily: 'var(--font-cute)',
          animation: 'slide-up 0.3s ease',
          maxWidth: '380px'
        }}>
          {toast.message}
        </div>
      )}

      <div className="decorations">
        <div className="floating-cat">🐱</div>
        <div className="floating-cat">😸</div>
        <div className="floating-cat">😻</div>
        <div className="floating-cat">🐾</div>
      </div>

      <header className="app-header">
        <div className="logo-container">
          <span className="logo-icon">🐱🏫</span>
          <h1 className="app-title">MeowMath Elite Academy</h1>
        </div>
        <p className="app-subtitle">HSC 2026 Higher Math 1st Paper Extreme Traps Dojo 🌸</p>
      </header>

      {user && view !== 'register' && (
        <div className="nav-bar">
          <button className="cute-btn cute-btn-outline" style={{ fontSize: '0.9rem', padding: '6px 15px' }} onClick={() => setView('dashboard')}>
            🏠 Dashboard
          </button>
          <button className="cute-btn cute-btn-outline" style={{ fontSize: '0.9rem', padding: '6px 15px', marginLeft: '5px' }} onClick={() => setView('formulas')}>
            📚 Formulas
          </button>
          
          <div className="nav-right">
            <div className="user-score-badge">
              <span>{user.avatar}</span>
              <span>{user.name}</span>
            </div>
            <div className="user-score-badge" style={{ borderColor: 'var(--secondary-purple)' }}>
              <span>⚡</span>
              <span>{user.stamina}% Stamina</span>
            </div>
            <div className="user-score-badge" style={{ borderColor: '#ffe17d' }}>
              <span>✨</span>
              <span>{user.xp} XP</span>
            </div>
            <button 
              className="cute-btn cute-btn-outline" 
              style={{ fontSize: '0.85rem', padding: '6px 10px', marginRight: '5px' }}
              onClick={toggleSound}
            >
              {soundOn ? '🔊 Sound On' : '🔇 Muted'}
            </button>
            <button
              className="cute-btn cute-btn-outline"
              style={{ fontSize: '0.85rem', padding: '6px 10px', color: '#ff6a9f', borderColor: '#ff6a9f' }}
              onClick={handleResetUser}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}

      <main style={{ flexGrow: 1 }}>
        {view === 'formulas' && (
          <FormulaHub onBack={() => setView('dashboard')} />
        )}
        {view === 'register' && (
          <div className="cute-card register-container">
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '15px' }}>🌸 MeowMath Elite Academy Entry 🐾</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
              Enter your kitty name and select a sweet avatar to face 500 extreme trap math questions! 🌸🐱
            </p>
            <form onSubmit={handleRegister}>
              <div className="cute-input-group">
                <label className="cute-label" htmlFor="student-name">Your Name 🌸:</label>
                <input
                  id="student-name"
                  type="text"
                  className="cute-input"
                  placeholder="যেমন: Lamia"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  maxLength={25}
                  required
                />
              </div>

              <AvatarSelector selectedAvatar={tempAvatar} onSelect={setTempAvatar} />

              <button type="submit" className="cute-btn" style={{ marginTop: '25px', width: '100%', justifyContent: 'center' }}>
                Enter Dojo 😼✨
              </button>
            </form>
          </div>
        )}

        {view === 'dashboard' && user && (
          <Dashboard
            user={user}
            leaderboard={leaderboard}
            onStartExam={handleStartExam}
            overallTimeLimit={overallTimeLimit}
            setOverallTimeLimit={setOverallTimeLimit}
          />
        )}

        {view === 'exam' && user && (
          <ExamRoom
            mode={examConfig.mode}
            chapterDetails={examConfig.chapterDetails}
            questionsPool={questionsPool}
            overallTimeLimit={overallTimeLimit}
            onFinishExam={handleFinishExam}
            onBack={() => setView('dashboard')}
            onShowToast={showToast}
          />
        )}

        {view === 'leaderboard' && user && (
          <Leaderboard
            leaderboard={leaderboard}
            currentUser={user}
            onBack={() => setView('dashboard')}
          />
        )}

        {view === 'upgrade' && user && (
          <UpgradeCondition
            user={user}
            onUpgradeComplete={handleUpgradeComplete}
            onBack={() => setView('dashboard')}
            onShowToast={showToast}
          />
        )}

        {view === 'result' && lastExamResult && (
          <div className="cute-card" style={{ maxWidth: '800px', margin: '40px auto' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '15px' }}>
                {lastExamResult.correctCount >= lastExamResult.totalCount * 0.8 ? '🎉😸🏆' : '😿🩹💪'}
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>
                {lastExamResult.isGameOver ? 'Game Over' : 'Exam Completed!'}
              </h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
                Mode: <strong>{lastExamResult.modeName}</strong>
              </p>

              <div style={{ background: 'white', borderRadius: '18px', padding: '20px', margin: '20px 0', border: '1.5px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px 0', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Score</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'green' }}>
                      {lastExamResult.correctCount} / {lastExamResult.totalCount}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>XP Gained</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-pink-hover)' }}>
                      +{lastExamResult.xpGained}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Stamina Cost</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'orange' }}>
                      -{lastExamResult.staminaUsed}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Time Spent</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--secondary-purple)' }}>
                      {Math.floor(lastExamResult.timeSpent / 60)}m {lastExamResult.timeSpent % 60}s
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', marginBottom: '25px', lineHeight: 1.6 }}>
                {lastExamResult.correctCount >= lastExamResult.totalCount * 0.8 
                  ? 'Awesome kitty! You blew the traps away! The top of the leaderboard is close! 🐾🚀'
                  : "You fell into some traps, but that's how we learn! Upgrade your condition and try again! Meow! 🌸"}
              </p>
            </div>

            {/* Answer & Clue Review Section (Bengali) */}
            {lastExamResult.userAnswers && lastExamResult.userAnswers.length > 0 && (
              <div ref={reviewContainerRef} style={{ marginTop: '40px', borderTop: '2px solid rgba(0,0,0,0.05)', paddingTop: '25px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-dark)' }}>
                  📖 উত্তরমালা ও ফাঁদ বিশ্লেষণ (Answer Review & Clues)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {lastExamResult.userAnswers.map((answer, index) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isUserCorrect = answer.selectedIndex === answer.correctIndex;
                    
                    return (
                      <div 
                        key={index} 
                        style={{
                          background: 'white',
                          border: isUserCorrect ? '2px solid #62c362' : '2px solid #ff8080',
                          borderRadius: '16px',
                          padding: '20px',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.9rem', color: 'var(--primary-pink-hover)', fontWeight: 'bold' }}>
                            প্রশ্ন {index + 1} | {answer.chapter}
                          </span>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '10px',
                            fontSize: '0.82rem',
                            fontWeight: 'bold',
                            background: isUserCorrect ? '#e6ffe6' : '#ffe6e6',
                            color: isUserCorrect ? '#1e591e' : '#7f2626'
                          }}>
                            {isUserCorrect ? '✅ সঠিক' : '❌ ভুল'}
                          </span>
                        </div>

                        <p style={{ fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '15px' }}>
                          {answer.text}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                          {answer.options.map((opt, oIdx) => {
                            let borderCol = 'rgba(0,0,0,0.06)';
                            let bgCol = 'transparent';
                            let icon = '';

                            if (oIdx === answer.correctIndex) {
                              borderCol = '#62c362';
                              bgCol = '#f0fff0';
                              icon = ' (সঠিক উত্তর)';
                            } else if (oIdx === answer.selectedIndex) {
                              borderCol = '#ff8080';
                              bgCol = '#fff0f0';
                              icon = ' (তোমার উত্তর)';
                            }

                            return (
                              <div 
                                key={oIdx} 
                                style={{
                                  padding: '10px 15px',
                                  border: `1.5px solid ${borderCol}`,
                                  background: bgCol,
                                  borderRadius: '12px',
                                  fontSize: '0.92rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <span><strong>{letters[oIdx]}.</strong> {opt}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: oIdx === answer.correctIndex ? '#1e591e' : '#7f2626' }}>
                                  {icon}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Clue/Trap explanation in Bengali */}
                        <div style={{
                          background: 'rgba(255, 142, 187, 0.05)',
                          border: '1px solid rgba(255, 142, 187, 0.2)',
                          padding: '15px',
                          borderRadius: '12px',
                          fontSize: '0.9rem'
                        }}>
                          <strong>💡 ফাঁদ বিশ্লেষণ ও সমাধান ক্লু (Bengali Clue):</strong>
                          <p style={{ marginTop: '5px', lineHeight: 1.5, color: '#4a4a4a' }}>
                            {answer.trapExplanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
              <button className="cute-btn" onClick={() => setView('dashboard')}>
                🏠 Dashboard
              </button>
              <button className="cute-btn cute-btn-secondary" onClick={() => setView('leaderboard')}>
                🏆 Show Leaderboard
              </button>
            </div>
          </div>
        )}
      </main>

      <CuteFooter onShowToast={showToast} />
    </div>
  );
}
