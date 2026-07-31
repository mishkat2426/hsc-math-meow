import React from 'react';

export default function Leaderboard({ leaderboard, currentUser, onBack }) {
  return (
    <div className="cute-card leaderboard-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button
        className="cute-btn cute-btn-outline"
        style={{ marginBottom: '20px', fontSize: '0.9rem', padding: '6px 15px' }}
        onClick={onBack}
      >
        ⬅️ Back to Dashboard
      </button>

      <div className="leaderboard-title">MeowLeaderboard (Top Math Kittens) 🏆</div>
      <p style={{ textSelf: 'center', textAlign: 'center', color: 'var(--text-light)', marginBottom: '25px', fontSize: '0.95rem' }}>
        Rankings of top kittens conquering HSC 2026 Higher Math 1st Paper traps:
      </p>

      <div className="leaderboard-list">
        {leaderboard.map((player, index) => {
          const rank = index + 1;
          let rankClass = 'rank-other';
          let rankEmoji = '🐾';

          if (rank === 1) {
            rankClass = 'rank-1';
            rankEmoji = '🥇';
          } else if (rank === 2) {
            rankClass = 'rank-2';
            rankEmoji = '🥈';
          } else if (rank === 3) {
            rankClass = 'rank-3';
            rankEmoji = '🥉';
          }

          const isUser = player.name === currentUser.name;

          return (
            <div key={index} className={`leaderboard-item ${isUser ? 'user-row' : ''}`}>
              <div className={`rank-pill ${rankClass}`}>
                {rank <= 3 ? rankEmoji : rank}
              </div>
              <div className="leaderboard-info">
                <span className="leaderboard-avatar">{player.avatar}</span>
                <span className="leaderboard-name">
                  {player.name} {isUser && ' (You)'}
                </span>
              </div>
              <div className="leaderboard-score">
                <span>⚡</span>
                <span>{player.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
