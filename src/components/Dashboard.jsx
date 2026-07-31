import React from 'react';
import { playHappyMeow } from '../utils/audioSynth';

const GEN_CHAPTERS = [
  "Matrices & Determinants",
  "Vectors",
  "Straight Lines",
  "Circles",
  "Trigonometry",
  "Differentiation",
  "Integration"
];

const BENGALI_CHAP_MAP = {
  "Matrices & Determinants": "ম্যাট্রিক্স ও নির্ণায়ক",
  "Vectors": "ভেক্টর",
  "Straight Lines": "সরলরেখা",
  "Circles": "বৃত্ত",
  "Trigonometry": "ত্রিকোণমিতি",
  "Differentiation": "অান্তরীকরণ",
  "Integration": "যোগজীকরণ"
};

export default function Dashboard({ user, onStartExam, leaderboard, overallTimeLimit, setOverallTimeLimit }) {
  const handleStartExam = (mode, details = null) => {
    playHappyMeow();
    const resolvedDetails = BENGALI_CHAP_MAP[details] || details;
    onStartExam(mode, resolvedDetails);
  };

  const activeParticipants = leaderboard.filter(player => player.xp > 0);

  // Calculate overall stats
  const accuracy = user.totalAttempted > 0 
    ? ((user.totalCorrect / user.totalAttempted) * 100).toFixed(1) 
    : "0.0";
  const completionPercentage = Math.round(
    (Object.values(user.chapterHighScores || {}).reduce((sum, score) => sum + score, 0) / 350) * 100
  ); // 7 chapters * 50 questions = 350 total questions

  // Define unlocked title based on XP
  let cadetBadge = "Junior Math Kitten 🐾";
  if (user.xp >= 1500) cadetBadge = "Vector Princess 🌸";
  if (user.xp >= 3000) cadetBadge = "Circle Master 🐆";
  if (user.xp >= 5000) cadetBadge = "Differentiation Queen 👑";

  return (
    <div className="dashboard-grid">
      <div className="dashboard-left">
        {/* Girly Welcome Card */}
        <div className="cute-card stats-card" style={{ background: 'linear-gradient(135deg, rgba(255,240,245,0.85) 0%, rgba(255,182,193,0.3) 100%)' }}>
          <div className="stats-avatar">{user.avatar}</div>
          <div className="stats-info">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>MeowMath Elite Academy Dashboard 🌸</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-light)', marginTop: '4px' }}>
              Hello, <strong>{user.name}</strong>! Title: <strong>{cadetBadge}</strong>
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              <span className="stats-badge" style={{ background: '#ff8ebb', color: 'white', borderColor: '#ff5793' }}>
                🌸 HSC 2026 Higher Math 1st Paper
              </span>
              <span className="stats-badge" style={{ background: '#c09aff', color: 'white', borderColor: '#8c47ff' }}>
                ✨ Level {Math.floor(user.xp / 100) + 1} Math Scholar
              </span>
            </div>
          </div>
        </div>

        {/* Overall Progress Tracker Card */}
        <div className="cute-card" style={{ marginBottom: '25px', borderColor: 'var(--secondary-purple)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '15px' }}>
            📊 Overall Progress Report
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ background: 'white', padding: '15px', borderRadius: '16px', border: '1.5px solid var(--card-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Academic Accuracy</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#ff6a9f', marginTop: '5px' }}>{accuracy}%</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>({user.totalCorrect || 0}/{user.totalAttempted || 0} Solved)</div>
            </div>
            <div style={{ background: 'white', padding: '15px', borderRadius: '16px', border: '1.5px solid var(--card-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Exams Attempted</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--secondary-purple)', marginTop: '5px' }}>{user.examsCount || 0} Tests</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Completed Sessions</div>
            </div>
            <div style={{ background: 'white', padding: '15px', borderRadius: '16px', border: '1.5px solid var(--card-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Dojo Master Rate</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--cute-gold)', color: '#bca000', marginTop: '5px' }}>{completionPercentage}%</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Syllabus Conquered</div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>
              <span>Dojo Mastery Level:</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="stamina-bar" style={{ height: '14px' }}>
              <div className="stamina-fill" style={{ width: `${completionPercentage}%`, background: 'linear-gradient(to right, #c09aff, #ff8ebb)' }}></div>
            </div>
          </div>
        </div>

        {/* Live Dojo Participant List */}
        <div className="cute-card" style={{ marginBottom: '25px', borderColor: 'var(--primary-pink)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🐱 Active Participants in Dojo
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {activeParticipants.map((player, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '8px 16px',
                  background: player.name === user.name ? 'rgba(255,142,187,0.2)' : 'rgba(255,255,255,0.7)',
                  border: player.name === user.name ? '2px solid var(--primary-pink)' : '1px solid var(--card-border)',
                  borderRadius: '30px',
                  fontSize: '0.92rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(255,142,187,0.05)'
                }}
              >
                <span>{player.avatar}</span>
                <span>{player.name}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: '4px' }}>
                  {player.xp > 0 ? '✅ Active' : '💤 Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Neko Activity Feed */}
        <div className="cute-card" style={{ marginBottom: '25px', borderColor: 'var(--secondary-purple)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Live Dojo Activity Feed
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(user.activities && user.activities.length > 0) ? (
              user.activities.map((act, idx) => (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 15px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '14px',
                    borderLeft: act.status === 'success' ? '4px solid #62c362' : '4px solid var(--secondary-purple)',
                    fontSize: '0.9rem'
                  }}
                >
                  <div>
                    <strong>{user.name}</strong> <span style={{ color: 'var(--text-light)' }}>{act.action}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{act.time}</span>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontStyle: 'italic', padding: '10px' }}>
                No activities recorded in the dojo yet, meow! 🐾
              </p>
            )}
          </div>
        </div>

        {/* Exam Rooms */}
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '15px', color: 'var(--text-dark)' }}>
          Exam Meow-Room 🐾
        </h3>
        <div className="exam-modes">
          <div className="mode-box" onClick={() => handleStartExam('quick')} style={{ background: 'rgba(255,255,255,0.85)' }}>
            <div>
              <div className="mode-icon">⚡</div>
              <div className="mode-title">Quick Meow Test</div>
              <div className="mode-desc">Test your immediate condition with 10 random extreme trap questions!</div>
            </div>
            <button className="cute-btn" style={{ width: '100%', justifyContent: 'center' }}>Start 🐱</button>
          </div>

          <div className="mode-box" onClick={() => handleStartExam('boss')} style={{ background: 'rgba(255,255,255,0.85)' }}>
            <div>
              <div className="mode-icon">🔥</div>
              <div className="mode-title">100% 500 Boss Fight</div>
              <div className="mode-desc">Continuous battle against 500 hard trap questions. How high can you score?</div>
            </div>
            <button className="cute-btn cute-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Fight ⚔️</button>
          </div>
        </div>

        {/* Chapter-wise Exams */}
        <div className="cute-card" style={{ marginTop: '25px' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Chapter-wise Challenge 📚</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '15px' }}>
            Solve meticulous traps from specific chapters to reach Pro level:
          </p>
          <div className="chapter-grid">
            {GEN_CHAPTERS.map((chap, idx) => {
              const chapKey = BENGALI_CHAP_MAP[chap];
              const bestScore = (user.chapterHighScores && user.chapterHighScores[chapKey]) || 0;
              const percent = Math.round((bestScore / 50) * 100);

              return (
                <button
                  key={idx}
                  className="chapter-btn"
                  onClick={() => handleStartExam('chapter', chap)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>📖 {chap}</span>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.05)', padding: '3px 8px', borderRadius: '8px' }}>
                      50 Qs
                    </span>
                  </div>
                  
                  {/* Chapter-specific mini progress bar */}
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '3px' }}>
                      <span>Best Score: {bestScore}/50</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="stamina-bar" style={{ height: '6px', borderRadius: '3px' }}>
                      <div 
                        className="stamina-fill" 
                        style={{ 
                          width: `${percent}%`, 
                          background: percent >= 80 ? '#62c362' : percent >= 40 ? 'var(--secondary-purple)' : 'var(--primary-pink)', 
                          borderRadius: '3px' 
                        }}
                      ></div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="dashboard-right">


        {/* Nudge to Upgrade */}
        <div className="cute-card" style={{ marginBottom: '25px', textAlign: 'center', borderColor: 'var(--secondary-purple)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💆‍♀️</div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Condition Down?</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '15px' }}>
            Head hot after wrong answers? Visit the Math Spa to reset your meow dynamics!
          </p>
          <button className="cute-btn cute-btn-secondary" onClick={() => handleStartExam('upgrade')} style={{ fontSize: '0.95rem', padding: '8px 18px' }}>
            Upgrade Condition 🌟
          </button>
        </div>

        {/* Leaderboard Summary Preview */}
        <div className="cute-card">
          <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '15px', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
            Top Kittens 🏆
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leaderboard.slice(0, 5).map((player, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: player.name === user.name ? '#ffe3ee' : 'rgba(255,255,255,0.4)',
                  borderRadius: '12px',
                  border: player.name === user.name ? '1px solid var(--primary-pink)' : '1px solid transparent',
                  fontWeight: player.name === user.name ? 'bold' : 'normal'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: idx === 0 ? 'var(--cute-gold)' : 'rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {idx + 1}
                  </span>
                  <span>{player.avatar}</span>
                  <span style={{ fontSize: '0.9rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100px' }}>
                    {player.name}
                  </span>
                </div>
                <span style={{ color: 'var(--primary-pink-hover)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {player.xp} XP
                </span>
              </div>
            ))}
          </div>
          <button
            className="cute-btn cute-btn-outline"
            style={{ width: '100%', marginTop: '15px', fontSize: '0.9rem', padding: '6px 12px', justifyContent: 'center' }}
            onClick={() => handleStartExam('leaderboard')}
          >
            Full Leaderboard 📊
          </button>
        </div>
      </div>
    </div>
  );
}
