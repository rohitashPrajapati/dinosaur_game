// soundManager.js
// Handles sound playback with iOS web compatibility
// Usage: import soundManager and call soundManager.play('soundName')
// soundManager.js
// Handles sound playback with iOS web compatibility
// Usage: import soundManager and call soundManager.play('soundName')

class SoundManager {
    setMuted(muted) {
      // Mute/unmute all preloaded sounds
      Object.values(this.sounds).forEach(audio => {
        audio.muted = !!muted;
      });
      // Store state for clones
      this._muted = !!muted;
    }
  constructor() {
    // Preload and unlock sounds for iOS
    this.sounds = {
      explosion: this.createAudio('sound/explosion.mp3'),
      jump: this.createAudio('sound/jump.mp3'),
      waterpit: this.createAudio('sound/water_pit_touched.mp3'),
      gameover: this.createAudio('sound/death.mp3'),
      coin: this.createAudio('sound/coin2.mp3'),
    };
    this.unlocked = false;
    this.unlockHandler = this.unlockAudio.bind(this);
    this.setupUnlock();
  }

  createAudio(src) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.load();
    audio.volume = 0.05;
    // Required for iOS: must be played in response to user gesture
    audio.muted = true;
    audio.play().catch(() => {});
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    return audio;
  }

  setupUnlock() {
    // Listen for first user interaction to unlock audio on iOS
    window.addEventListener('touchstart', this.unlockHandler, { once: true });
    window.addEventListener('mousedown', this.unlockHandler, { once: true });
    window.addEventListener('keydown', this.unlockHandler, { once: true });
  }

  unlockAudio() {
    if (this.unlocked) return;
    Object.values(this.sounds).forEach(audio => {
      try {
        audio.muted = true;
        audio.play().catch(() => {});
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      } catch (e) {}
    });
    this.unlocked = true;
  }

  play(name, delay = 0) {
    const audio = this.sounds[name];
    if (!audio) return;
    // Always clone for overlapping sounds
    const playAudio = () => {
      try {
        // Use a clone to allow overlapping
        const clone = audio.cloneNode();
        clone.volume = audio.volume; // Use the same volume as the original (0.1)
        clone.muted = this._muted || false;
        clone.play().catch(() => {});
      } catch (e) {}
    };
    if (delay > 0) {
      setTimeout(playAudio, delay);
    } else {
      playAudio();
    }
  }
}

const soundManager = new SoundManager();
window.soundManager = soundManager;
export default soundManager;