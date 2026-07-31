import React from 'react';
import { playVictoryMeow } from '../utils/audioSynth';

export default function CuteFooter({ onShowToast }) {
  const handleEasterEgg = (e) => {
    e.preventDefault();
    playVictoryMeow();
    if (onShowToast) {
      onShowToast("🐾 This amazing portal was created by Senior Web Developer Mishkat, especially for the talented and sweet HSC 2026 math kittens! Happy Math Journey! 💖✨", "success");
    } else {
      alert("🐾 This amazing portal was created by Senior Web Developer Mishkat, especially for the talented and sweet HSC 2026 math kittens! Happy Math Journey! 💖✨");
    }
  };

  return (
    <footer className="cute-footer">
      <div>
        <a href="#mishkat-magic" className="mishkat-badge" onClick={handleEasterEgg}>
          <span>👑 Created by Mishkat</span>
          <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>(Senior Web Developer)</span>
          <span>🐾❤️</span>
        </a>
      </div>
      <p style={{ fontSize: '0.85rem', marginTop: '5px', opacity: 0.8 }}>
        © ${new Date().getFullYear()} MeowMath Elite Academy. All rights reserved. Meow~ 🌸
      </p>
    </footer>
  );
}
