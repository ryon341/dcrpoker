import AsyncStorage from '@react-native-async-storage/async-storage';

export type GameSound =
  | 'tap'
  | 'correct'
  | 'incorrect'
  | 'cardFlip'
  | 'win'
  | 'lose'
  | 'wheelTick'
  | 'wheelReward'
  | 'levelUp'
  | 'badgeUnlock';

const SOUND_ENABLED_KEY = 'dcr_sound_enabled';

// In-memory cache so we don't await AsyncStorage on every play
let _soundEnabled: boolean | null = null;

export async function getSoundEnabled(): Promise<boolean> {
  if (_soundEnabled !== null) return _soundEnabled;
  try {
    const raw = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
    _soundEnabled = raw === null ? true : raw === 'true';
  } catch {
    _soundEnabled = true;
  }
  return _soundEnabled;
}

export async function setSoundEnabled(enabled: boolean): Promise<void> {
  _soundEnabled = enabled;
  try {
    await AsyncStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
  } catch {
    // silent
  }
}

// ─── AudioContext singleton ────────────────────────────────────────────────
let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!_ctx || _ctx.state === 'closed') {
      _ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (_ctx.state === 'suspended') {
      _ctx.resume().catch(() => {});
    }
    return _ctx;
  } catch {
    return null;
  }
}

// ─── Low-level tone helper ─────────────────────────────────────────────────
function tone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  gainPeak: number,
  type: OscillatorType = 'triangle',
): void {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

// ─── Sound definitions ─────────────────────────────────────────────────────
function synthTap(ctx: AudioContext) {
  const t = ctx.currentTime;
  tone(ctx, 600, t, 0.06, 0.18, 'triangle');
}

function synthCorrect(ctx: AudioContext) {
  const t = ctx.currentTime;
  tone(ctx, 523, t, 0.1, 0.22, 'triangle');
  tone(ctx, 659, t + 0.1, 0.15, 0.22, 'triangle');
}

function synthIncorrect(ctx: AudioContext) {
  const t = ctx.currentTime;
  tone(ctx, 350, t, 0.12, 0.2, 'sawtooth');
  tone(ctx, 250, t + 0.1, 0.18, 0.18, 'sawtooth');
}

function synthCardFlip(ctx: AudioContext) {
  const t = ctx.currentTime;
  tone(ctx, 900, t, 0.04, 0.1, 'triangle');
}

function synthWin(ctx: AudioContext) {
  const t = ctx.currentTime;
  tone(ctx, 440, t, 0.1, 0.2, 'triangle');
  tone(ctx, 554, t + 0.09, 0.1, 0.2, 'triangle');
  tone(ctx, 659, t + 0.18, 0.18, 0.25, 'triangle');
}

function synthLose(ctx: AudioContext) {
  const t = ctx.currentTime;
  tone(ctx, 440, t, 0.12, 0.18, 'sawtooth');
  tone(ctx, 370, t + 0.1, 0.12, 0.16, 'sawtooth');
  tone(ctx, 294, t + 0.2, 0.22, 0.18, 'sawtooth');
}

function synthWheelTick(ctx: AudioContext) {
  const t = ctx.currentTime;
  tone(ctx, 480, t, 0.03, 0.12, 'square');
}

function synthWheelReward(ctx: AudioContext) {
  const t = ctx.currentTime;
  tone(ctx, 523, t, 0.09, 0.2, 'triangle');
  tone(ctx, 659, t + 0.08, 0.09, 0.2, 'triangle');
  tone(ctx, 784, t + 0.16, 0.09, 0.2, 'triangle');
  tone(ctx, 1047, t + 0.24, 0.22, 0.3, 'triangle');
}

function synthLevelUp(ctx: AudioContext) {
  const t = ctx.currentTime;
  tone(ctx, 523,  t,       0.08, 0.22, 'triangle');
  tone(ctx, 659,  t + 0.08, 0.08, 0.22, 'triangle');
  tone(ctx, 784,  t + 0.16, 0.08, 0.22, 'triangle');
  tone(ctx, 1047, t + 0.24, 0.08, 0.28, 'triangle');
  tone(ctx, 1319, t + 0.32, 0.28, 0.35, 'triangle');
}

function synthBadgeUnlock(ctx: AudioContext) {
  const t = ctx.currentTime;
  tone(ctx, 880,  t,       0.14, 0.22, 'triangle');
  tone(ctx, 1108, t + 0.12, 0.14, 0.22, 'triangle');
  tone(ctx, 1319, t + 0.24, 0.28, 0.28, 'triangle');
}

const SYNTHS: Record<GameSound, (ctx: AudioContext) => void> = {
  tap:          synthTap,
  correct:      synthCorrect,
  incorrect:    synthIncorrect,
  cardFlip:     synthCardFlip,
  win:          synthWin,
  lose:         synthLose,
  wheelTick:    synthWheelTick,
  wheelReward:  synthWheelReward,
  levelUp:      synthLevelUp,
  badgeUnlock:  synthBadgeUnlock,
};

// ─── Public API ────────────────────────────────────────────────────────────
export async function playSound(name: GameSound): Promise<void> {
  try {
    const enabled = await getSoundEnabled();
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    SYNTHS[name](ctx);
  } catch {
    // never crash
  }
}

/** No-op — sounds are synthesized, nothing to preload. */
export async function preloadSounds(): Promise<void> {}

/** No-op — no resources to release. */
export async function unloadSounds(): Promise<void> {}
