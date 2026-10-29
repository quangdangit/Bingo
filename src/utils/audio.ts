/**
 * Audio synthesis and SpeechSynthesis helper
 * Uses Web Audio API for sound effects (zero network dependencies, zero 404s)
 * Uses Web Speech API for English pronunciation
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const soundEffects = {
  click: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context might be restricted before user gesture
    }
  },

  correct: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Happy two-tone chime (e.g. E5 -> A5)
      const notes = [659.25, 880.0];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    } catch {
      // Audio error suppressed
    }
  },

  streakBonus: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // 3 ascending notes: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {
      // Suppress
    }
  },

  wrong: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Gentle boing (descending pitch, friendly, not punitive)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.22);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Suppress
    }
  },

  bingo: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Celebratory fanfare arpeggio: C5, E5, G5, C6, G5, C6 sustained
      const notes = [
        { f: 523.25, t: 0.0, d: 0.18 },
        { f: 659.25, t: 0.16, d: 0.18 },
        { f: 783.99, t: 0.32, d: 0.18 },
        { f: 1046.5, t: 0.48, d: 0.4 },
        { f: 880.0,  t: 0.72, d: 0.2 },
        { f: 1046.5, t: 0.90, d: 0.7 },
      ];

      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0, now + t);
        gain.gain.linearRampToValueAtTime(0.3, now + t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d);
      });
    } catch {
      // Suppress
    }
  },

  tick: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Suppress
    }
  },
};

/**
 * Web Speech API speech synthesizer
 */
export class SpeechService {
  private static cachedVoice: SpeechSynthesisVoice | null = null;
  private static isSpeaking = false;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  private static getEnglishVoice(): SpeechSynthesisVoice | null {
    if (!this.isSupported()) return null;
    if (this.cachedVoice) return this.cachedVoice;

    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural en-US, en-GB, en
    const enVoices = voices.filter((v) => v.lang.startsWith('en'));
    const preferred =
      enVoices.find((v) => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))) ||
      enVoices.find((v) => v.lang === 'en-US') ||
      enVoices.find((v) => v.lang === 'en-GB') ||
      enVoices[0];

    if (preferred) {
      this.cachedVoice = preferred;
    }
    return preferred || null;
  }

  public static speak(
    text: string,
    options: { rate?: number; pitch?: number; enabled?: boolean; onEnd?: () => void } = {}
  ): void {
    if (options.enabled === false) return;
    if (!this.isSupported()) {
      if (options.onEnd) options.onEnd();
      return;
    }

    try {
      // Stop ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = options.rate ?? 0.88; // friendly kid-appropriate pace
      utterance.pitch = options.pitch ?? 1.05; // slightly cheerful pitch

      const voice = this.getEnglishVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (options.onEnd) options.onEnd();
      };

      this.isSpeaking = true;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    }
  }

  public static stop(): void {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
        this.isSpeaking = false;
      } catch {
        // Suppress
      }
    }
  }
}
