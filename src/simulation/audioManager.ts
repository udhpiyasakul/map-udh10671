/**
 * Web Audio API synthesizer for simulated hospital ambient sound & alert cues.
 * Strictly complies with browser autoplay policy: starts only on explicit user gesture.
 * Audio is synthesized procedurally (no external audio files needed).
 */

class HospitalAudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientNoiseNode: AudioNode | null = null;
  private isMuted: boolean = true;
  private volume: number = 0.4;
  private heartInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public toggleAudio(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (!this.isMuted && !this.ambientNoiseNode) {
      this.startAmbientHVAC();
    }
    return !this.isMuted;
  }

  public getIsPlaying(): boolean {
    return !this.isMuted;
  }

  /**
   * Generates a quiet, warm pink-filtered gentle airflow noise resembling cleanroom / hospital air exchange
   */
  private startAmbientHVAC() {
    if (!this.ctx || !this.masterGain) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.015; // very quiet base
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low pass filter to make it soft air rush
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      const hvacGain = this.ctx.createGain();
      hvacGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(hvacGain);
      hvacGain.connect(this.masterGain);

      whiteNoise.start();
      this.ambientNoiseNode = whiteNoise;
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Gentle medical telemetry chime on alert or selection
   */
  public playSoftBeep(frequency: number = 880, duration: number = 0.12) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // silent
    }
  }

  /**
   * Alert notification sound (gentle double chime)
   */
  public playAlertChime() {
    this.playSoftBeep(659.25, 0.15); // E5
    setTimeout(() => {
      this.playSoftBeep(880, 0.2); // A5
    }, 160);
  }

  public dispose() {
    if (this.heartInterval) {
      window.clearInterval(this.heartInterval);
      this.heartInterval = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const audioManager = new HospitalAudioManager();
