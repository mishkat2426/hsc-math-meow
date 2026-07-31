import React, { useState } from 'react';
import { playHappyMeow, playWelcomeMeow, playVictoryMeow } from '../utils/audioSynth';

export default function UpgradeCondition({ user, onUpgradeComplete, onBack, onShowToast }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [progress, setProgress] = useState(0);

  const startUpgrade = (actionType, staminaAmount, xpAmount, durationMs, message) => {
    if (loadingAction) return;
    
    playWelcomeMeow();
    setLoadingAction(actionType);
    setProgress(0);

    const interval = 50;
    const totalSteps = durationMs / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const percent = Math.min((currentStep / totalSteps) * 100, 100);
      setProgress(percent);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setTimeout(() => {
          playVictoryMeow();
          onUpgradeComplete(staminaAmount, xpAmount);
          setLoadingAction(null);
          if (onShowToast) {
          onShowToast(message, "success");
        } else {
          alert(message);
        }
        }, 300);
      }
    }, interval);
  };

  return (
    <div className="cute-card upgrade-container">
      <button
        className="cute-btn cute-btn-outline"
        style={{ marginBottom: '20px', fontSize: '0.9rem', padding: '6px 15px' }}
        onClick={onBack}
        disabled={loadingAction !== null}
      >
        ⬅️ Back to Dashboard
      </button>

      <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🌸💆‍♀️🐱</div>
      <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
        Math Spa & Kitty Cafe ☕️
      </h3>
      <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
        Recharge your math stamina here, cool down your head, and prepare for the next exam, meow!
      </p>

      {loadingAction ? (
        <div style={{ padding: '40px', background: 'white', borderRadius: '20px', border: '2px solid var(--primary-pink)' }}>
          <div style={{ fontSize: '3rem', animation: 'meow-bounce 1s infinite' }}>
            {loadingAction === 'meditation' ? '🧘‍♀️🐱' : loadingAction === 'coffee' ? '☕️🐈' : '📚👑'}
          </div>
          <h4 style={{ margin: '15px 0', fontWeight: 'bold' }}>
            {loadingAction === 'meditation' ? 'Meow Meditation in progress...' : loadingAction === 'coffee' ? 'Kitty Coffee brewing...' : "Loading Mishkat's Secret Cheat Sheets..."}
          </h4>
          <div className="stamina-bar" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="stamina-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
            Patience kitty, calming your mind... {Math.round(progress)}%
          </p>
        </div>
      ) : (
        <div className="spa-options">
          {/* Option 1: Meditation */}
          <div className="spa-box">
            <div className="spa-icon">🧘‍♀️</div>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px' }}>Meow Meditation</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginBottom: '15px' }}>
              Sit quietly and meditate on math formulas to calm your mind.
            </p>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary-pink-hover)', marginBottom: '15px' }}>
              ⚡ +30 Stamina | ⏱️ 3 Seconds
            </div>
            <button
              className="cute-btn"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => startUpgrade('meditation', 30, 0, 3000, 'Meow! Your mind is calm and stamina increased by 30! 🌸')}
            >
              Meditate
            </button>
          </div>

          {/* Option 2: Coffee */}
          <div className="spa-box">
            <div className="spa-icon">☕️</div>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px' }}>Kitty Coffee Special</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginBottom: '15px' }}>
              Refresh your mind with warm coffee while reading trap analyses.
            </p>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary-pink-hover)', marginBottom: '15px' }}>
              ⚡ +50 Stamina | ⏱️ 5 Seconds
            </div>
            <button
              className="cute-btn cute-btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => startUpgrade('coffee', 50, 0, 5000, 'Ah! Warm coffee refreshed your condition! +50 Stamina! ☕️🐈')}
            >
              Drink Coffee
            </button>
          </div>

          {/* Option 3: Mishkat's sheet */}
          <div className="spa-box" style={{ borderColor: 'var(--cute-gold)', background: 'rgba(255, 240, 200, 0.4)' }}>
            <div className="spa-icon">📚</div>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px' }}>Mishkat's Secret Sheets</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginBottom: '15px' }}>
              Unlock exclusive hacks from developer Mishkat to reach Pro condition!
            </p>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary-pink-hover)', marginBottom: '15px' }}>
              ⚡ +100 Stamina & ✨ +50 XP | ⏱️ 8 Seconds
            </div>
            <button
              className="cute-btn"
              style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #ffd13b 0%, #dca400 100%)', boxShadow: '0 4px 15px rgba(220,164,0,0.4)', color: '#4d3a00' }}
              onClick={() => startUpgrade('cheat-sheet', 100, 50, 8000, "Awesome! Mishkat's sheets fully recharged your stamina and awarded 50 bonus XP! 👑✨")}
            >
              Read Cheat Sheets 👑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
