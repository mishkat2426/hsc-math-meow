
let soundEnabled = true;
export const setSoundEnabled = (val) => { soundEnabled = val; };
export const getSoundEnabled = () => soundEnabled;

// Cute Cat Meow Synthesizer using Web Audio API
// No assets required, fully generated on-the-fly!

let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Synthesizes a generic meow with configurable parameters
function synthesizeMeow({ pitch = 700, duration = 0.4, isSad = false } = {}) {
  try {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    
    // Create oscillators and gain nodes
    const osc = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gainNode = audioCtx.createGain();
    const mainGain = audioCtx.createGain();

    // Oscillator 1 (triangle for soft warmth)
    osc.type = 'triangle';
    // Oscillator 2 (sawtooth for nasal, raspy texture)
    osc2.type = 'sawtooth';

    // Mix oscillators
    const oscGain = audioCtx.createGain();
    const osc2Gain = audioCtx.createGain();
    oscGain.gain.setValueAtTime(0.7, now);
    osc2Gain.gain.setValueAtTime(0.15, now); // soft raspy high frequency

    osc.connect(oscGain);
    osc2.connect(osc2Gain);

    oscGain.connect(filter);
    osc2Gain.connect(filter);

    // Apply high pass and band pass to model vocal tract of kitten
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(pitch * 1.5, now);
    filter.Q.setValueAtTime(3.0, now);

    filter.connect(gainNode);
    gainNode.connect(mainGain);
    mainGain.connect(audioCtx.destination);

    // Frequency Envelope (The core "Meow" shape: quick rise then slow drop)
    if (!isSad) {
      // Happy meow: rise fast, stay, then slight slide
      osc.frequency.setValueAtTime(pitch * 0.8, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.4, now + duration * 0.15);
      osc.frequency.exponentialRampToValueAtTime(pitch, now + duration * 0.4);
      osc.frequency.linearRampToValueAtTime(pitch * 0.9, now + duration);

      osc2.frequency.setValueAtTime(pitch * 1.6, now);
      osc2.frequency.exponentialRampToValueAtTime(pitch * 2.8, now + duration * 0.15);
      osc2.frequency.exponentialRampToValueAtTime(pitch * 2, now + duration);

      // Filter sweep to make the "m-e-o-w" vocal sound
      filter.frequency.setValueAtTime(pitch * 1.2, now);
      filter.frequency.exponentialRampToValueAtTime(pitch * 2.5, now + duration * 0.25);
      filter.frequency.exponentialRampToValueAtTime(pitch * 1.1, now + duration);
    } else {
      // Sad meow: slow slide down in pitch, longer duration
      osc.frequency.setValueAtTime(pitch * 1.1, now);
      osc.frequency.linearRampToValueAtTime(pitch * 0.6, now + duration * 0.7);
      osc.frequency.linearRampToValueAtTime(pitch * 0.45, now + duration);

      osc2.frequency.setValueAtTime(pitch * 2.2, now);
      osc2.frequency.linearRampToValueAtTime(pitch * 1.2, now + duration);

      filter.frequency.setValueAtTime(pitch * 1.5, now);
      filter.frequency.linearRampToValueAtTime(pitch * 0.8, now + duration);
    }

    // Amplitude Envelope (attack-decay-sustain-release)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.8, now + duration * 0.1); // fast attack
    gainNode.gain.exponentialRampToValueAtTime(0.5, now + duration * 0.3); // decay
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration); // release

    mainGain.gain.setValueAtTime(0.4, now); // general volume

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);

  } catch (error) {
    console.warn("Web Audio API failed or is not allowed: ", error);
  }
}

// Public API
export const playHappyMeow = () => {
  // Kitten high-pitch happy meow
  synthesizeMeow({ pitch: 780, duration: 0.3, isSad: false });
};

export const playSadMeow = () => {
  // Low, long sad meow
  synthesizeMeow({ pitch: 480, duration: 0.7, isSad: true });
};

export const playWelcomeMeow = () => {
  // Chirp followed by standard meow
  try {
    synthesizeMeow({ pitch: 850, duration: 0.12, isSad: false });
    setTimeout(() => {
      synthesizeMeow({ pitch: 750, duration: 0.35, isSad: false });
    }, 180);
  } catch (e) {}
};

export const playVictoryMeow = () => {
  // Cute victory arpeggio meows!
  try {
    const scale = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    scale.forEach((noteFreq, index) => {
      setTimeout(() => {
        synthesizeMeow({ pitch: noteFreq, duration: 0.2, isSad: false });
      }, index * 120);
    });
  } catch (e) {}
};
