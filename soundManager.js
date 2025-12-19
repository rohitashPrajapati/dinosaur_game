// soundManager.js
// Handles sound playback with iOS web compatibility
// Usage: import soundManager and call soundManager.play('soundName')
// soundManager.js
// Handles sound playback with iOS web compatibility
// Usage: import soundManager and call soundManager.play('soundName')


class SoundManager {
  constructor() {
    this._muted = false;
    this.sounds = {};
    this.buffers = {};
    this.context = null;
    this.unlocked = false;
    this.unlockHandler = this.unlockAudio.bind(this);
    this.setupUnlock();
    this._init();
  }

  async _init() {
    // Create AudioContext only on user gesture (iOS policy)
    this.context = null;
    // Preload all sounds as buffers
    const soundFiles = {
      explosion: 'sound/explosion.mp3',
      jump: 'sound/jump.mp3',
      waterpit: 'sound/water_pit_touched.mp3',
      gameover: 'sound/death.mp3',
      coin: 'sound/coin2.mp3',
    };
    for (const [name, url] of Object.entries(soundFiles)) {
      this._fetchAndDecode(name, url);
    }
  }

  async _fetchAndDecode(name, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      // Create a temp context for decoding if not yet unlocked
      const ctx = this.context || new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      this.buffers[name] = audioBuffer;
      if (!this.context) ctx.close();
    } catch (e) {
      // ignore
    }
  }

  setMuted(muted) {
    this._muted = !!muted;
  }

  setupUnlock() {
    window.addEventListener('touchstart', this.unlockHandler, { once: true });
    window.addEventListener('mousedown', this.unlockHandler, { once: true });
    window.addEventListener('keydown', this.unlockHandler, { once: true });
  }

  unlockAudio() {
    if (this.unlocked) return;
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if suspended
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    this.unlocked = true;
  }

  play(name, delay = 0) {
    if (!this.unlocked) return; // Only play if unlocked
    const buffer = this.buffers[name];
    if (!buffer || !this.context) return;
    const playAudio = () => {
      try {
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        const gain = this.context.createGain();
        // Set volume per sound
        let volume = 0.05;
        if (name === 'jump') volume = 0.01;
        gain.gain.value = this._muted ? 0 : volume;
        source.connect(gain).connect(this.context.destination);
        source.start(0);
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