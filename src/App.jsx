import React, { useState, useEffect } from 'react';
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

  const handleFinishExam = ({ xpGained, staminaUsed, correctCount, totalCount, modeName, isGameOver }) => {
    const newActivity = {
      action: `Completed ${modeName} exam! (Score: ${correctCount}/${totalCount}, +${xpGained} XP) 🏆`,
      time: "Just now",
      status: "success"
    };

    // Update chapter-wise high scores
    let nextHighScores = { ...(user.chapterHighScores || {}) };
    const isChapterMode = modeName.startsWith("Chapter: ");
    const chapName = isChapterMode ? modeName.replace("Chapter: ", "") : null;
    
    if (chapName) {
      const prevHigh = nextHighScores[chapName] || 0;
      if (correctCount > prevHigh) {
        nextHighScores[chapName] = correctCount;
      }
    }

    const updatedUser = {
      ...user,
      xp: user.xp + xpGained,
      stamina: Math.max(0, user.stamina - staminaUsed),
      activities: [newActivity, ...(user.activities || [])].slice(0, 10),
      chapterHighScores: nextHighScores,
      totalCorrect: (user.totalCorrect || 0) + correctCount,
      totalAttempted: (user.totalAttempted || 0) + totalCount,
      examsCount: (user.examsCount || 0) + 1
    };

    setLastExamResult({
      correctCount,
      totalCount,
      xpGained,
      staminaUsed,
      modeName,
      isGameOver
    });

    saveUserData(updatedUser);
    setView('result');
  };

  const handleUpgradeComplete = (staminaGained, xpGained) => {
    const newActivity = {
      action: `Upgraded condition at the Math Spa! (+${staminaGained}% Stamina, +${xpGained} XP) ⚡`,
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
          <div className="cute-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px 0' }}>
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

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
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
