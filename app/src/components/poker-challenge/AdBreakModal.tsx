import { useState, useEffect, useRef } from 'react';
import {
  Modal, View, Text, TouchableOpacity, Image,
  StyleSheet, Linking, Animated, ImageBackground,
} from 'react-native';
import { T } from '../ui/Theme';

export type AdBreakModalProps = {
  visible: boolean;
  durationSeconds?: number;
  onComplete: () => void;
  onSkip?: () => void;
  variant?: 'main' | 'daily' | 'generic';
};

type Phase = 'loading' | 'promo' | 'ending';

const TICK_MS = 100;

// Phase start tick thresholds (TICK_MS = 100ms → ticks = seconds × 10)
const PROMO_TICK   = 20;  // 2 s
const ENDING_TICK  = 130; // 13 s

const IMGS = {
  loading:      require('../../../assets/ad-loading-screen.png'),
  bgLoop:       require('../../../assets/ad-background-loop.png'),
  brand:        require('../../../assets/ad-brand-placeholder.png'),
  logoSlot:     require('../../../assets/ad-logo-slot.png'),
  pulseGlow:    require('../../../assets/ad-pulse-glow.png'),
  glowRing:     require('../../../assets/ad-glow-ring.png'),
  progressBar:  require('../../../assets/ad-progress-bar.png'),
  timerCircle:  require('../../../assets/ad-timer-circle.png'),
  frameBorder:  require('../../../assets/ad-frame-border.png'),
  overlayBg:    require('../../../assets/ad-overlay-bg.png'),
  endScreen:    require('../../../assets/ad-end-screen.png'),
  skipButton:   require('../../../assets/ad-skip-button.png'),
  closeIcon:    require('../../../assets/ad-close-icon.png'),
  clickOverlay: require('../../../assets/ad-click-overlay.png'),
  flash:        require('../../../assets/ad-transition-flash.png'),
  ctaHighlight: require('../../../assets/ad-cta-highlight.png'),
};

export function AdBreakModal({
  visible,
  durationSeconds = 15,
  onComplete,
  onSkip,
  variant = 'generic',
}: AdBreakModalProps) {
  const [elapsed, setElapsed]   = useState(0);
  const [phase, setPhase]       = useState<Phase>('loading');
  const flashOpacity            = useRef(new Animated.Value(0)).current;
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef           = useRef(onComplete);
  const endingTickRef           = useRef(Math.round(durationSeconds / (TICK_MS / 1000)));

  // Keep callback ref fresh
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  function triggerFlash() {
    flashOpacity.setValue(0.85);
    Animated.timing(flashOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (!visible) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsed(0);
      setPhase('loading');
      return;
    }

    // Reset and start
    setElapsed(0);
    setPhase('loading');
    endingTickRef.current = Math.round(durationSeconds / (TICK_MS / 1000));

    let ticks = 0;
    intervalRef.current = setInterval(() => {
      ticks++;
      const newElapsed = (ticks * TICK_MS) / 1000;
      setElapsed(newElapsed);

      if (ticks === PROMO_TICK) {
        setPhase('promo');
        triggerFlash();
      } else if (ticks === ENDING_TICK) {
        setPhase('ending');
        triggerFlash();
      }

      // Auto-complete 500ms after duration ends
      const doneTick = endingTickRef.current + 5;
      if (ticks >= doneTick) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        onCompleteRef.current();
      }
    }, TICK_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const progress         = Math.min(elapsed / durationSeconds, 1);
  const canSkip          = elapsed >= durationSeconds;
  const remainingSeconds = Math.max(0, Math.ceil(durationSeconds - elapsed));

  const bgImage =
    phase === 'loading' ? IMGS.loading :
    phase === 'promo'   ? IMGS.bgLoop  :
    IMGS.endScreen;

  function handleComplete() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onCompleteRef.current();
  }

  function handleSkip() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    (onSkip ?? onCompleteRef.current)();
  }

  return (
    <Modal visible={visible} animationType="fade" transparent={false} statusBarTranslucent>
      <ImageBackground source={bgImage} style={s.fullscreen} resizeMode="cover">

        {/* Tinted overlay — non-interactive */}
        <View pointerEvents="none" style={s.overlayBgWrap}>
          <Image source={IMGS.overlayBg} style={s.fill} />
        </View>

        {/* Frame border decoration — non-interactive */}
        <View pointerEvents="none" style={s.frameBorderWrap}>
          <Image source={IMGS.frameBorder} style={s.fill} resizeMode="stretch" />
        </View>

        {/* Top row: Ad label + countdown */}
        <View style={s.adLabelRow}>
          <Text style={s.adLabel}>Ad Break</Text>
          <View style={s.countdownWrap}>
            <Image source={IMGS.timerCircle} style={s.timerCircle} />
            <Text style={s.countdownText}>{remainingSeconds}</Text>
          </View>
        </View>

        {/* ─── PROMO phase ─────────────────────────────────────────── */}
        {phase === 'promo' && (
          <View style={s.centerContent}>

            {/* Pulse glow behind content — non-interactive */}
            <View pointerEvents="none" style={s.pulseGlowWrap}>
              <Image source={IMGS.pulseGlow} style={s.fill} />
            </View>

            <View style={s.logoArea}>
              <Image source={IMGS.logoSlot} style={s.logoSlot} resizeMode="contain" />
              <Image source={IMGS.brand} style={s.brand} resizeMode="contain" />
            </View>

            <TouchableOpacity
              style={s.ctaCard}
              onPress={() => Linking.openURL('https://www.deercreekroad.com')}
              activeOpacity={0.82}
            >
              <View pointerEvents="none" style={s.ctaClickOverlay}>
                <Image source={IMGS.clickOverlay} style={s.fill} />
              </View>
              <Text style={s.ctaHeadline}>BUILD YOUR CUSTOM TABLE</Text>
              <Text style={s.ctaUrl}>www.DeerCreekRoad.com</Text>
              <Text style={s.ctaPhone}>804-767-7500</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── ENDING phase ────────────────────────────────────────── */}
        {phase === 'ending' && (
          <View style={s.centerContent}>

            {/* Glow ring — non-interactive */}
            <View pointerEvents="none" style={s.glowRingWrap}>
              <Image source={IMGS.glowRing} style={s.fill} resizeMode="contain" />
            </View>

            <TouchableOpacity
              style={s.ctaCardEnd}
              onPress={() => Linking.openURL('https://www.deercreekroad.com')}
              activeOpacity={0.82}
            >
              <View pointerEvents="none" style={s.ctaHighlightWrap}>
                <Image source={IMGS.ctaHighlight} style={s.fill} />
              </View>
              <Text style={s.ctaHeadlineEnd}>VISIT DEER CREEK ROAD</Text>
              <Text style={s.ctaUrlEnd}>www.DeerCreekRoad.com</Text>
              <Text style={s.ctaPhoneEnd}>804-767-7500</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Progress bar */}
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${Math.round(progress * 100)}%` as any }]}>
            <Image source={IMGS.progressBar} style={s.fill} resizeMode="stretch" />
          </View>
        </View>

        {/* Skip / Continue — only when timer done */}
        {canSkip ? (
          <View style={s.skipRow}>
            <TouchableOpacity style={s.skipBtn} onPress={handleComplete} activeOpacity={0.85}>
              <Image source={IMGS.closeIcon} style={s.closeIcon} resizeMode="contain" />
              <Image source={IMGS.skipButton} style={s.skipBtnImg} resizeMode="contain" />
              <Text style={s.skipText}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.skipRowPlaceholder} />
        )}

        {/* Transition flash overlay — non-interactive */}
        <Animated.View
          pointerEvents="none"
          style={[s.flashOverlay, { opacity: flashOpacity }]}
        >
          <Image source={IMGS.flash} style={s.fill} resizeMode="cover" />
        </Animated.View>

      </ImageBackground>
    </Modal>
  );
}

const s = StyleSheet.create({
  fullscreen: { flex: 1, backgroundColor: '#000' },
  fill:       { width: '100%', height: '100%' },

  // Non-interactive absolute overlays
  overlayBgWrap:   { ...StyleSheet.absoluteFillObject, opacity: 0.40, zIndex: 1 },
  frameBorderWrap: { ...StyleSheet.absoluteFillObject, zIndex: 2 },
  pulseGlowWrap:   { ...StyleSheet.absoluteFillObject, opacity: 0.35, zIndex: 0 },
  glowRingWrap:    { ...StyleSheet.absoluteFillObject, opacity: 0.55, zIndex: 0 },
  flashOverlay:    { ...StyleSheet.absoluteFillObject, zIndex: 99 },

  // Header
  adLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 8,
    zIndex: 10,
  },
  adLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  countdownWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCircle:   { position: 'absolute', width: 40, height: 40 },
  countdownText: { color: T.white, fontSize: 15, fontWeight: '800', zIndex: 1 },

  // Center content (promo / ending)
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },

  // Logo area
  logoArea: { alignItems: 'center', marginBottom: 28 },
  logoSlot: { width: 130, height: 64, marginBottom: 8 },
  brand:    { width: 260, height: 88 },

  // Promo CTA card
  ctaCard: {
    backgroundColor: 'rgba(0,0,0,0.58)',
    borderWidth: 1.5,
    borderColor: T.gold,
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
    zIndex: 10,
  },
  ctaClickOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.08 },
  ctaHeadline: {
    color: T.gold,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.1,
    textAlign: 'center',
    marginBottom: 10,
  },
  ctaUrl:   { color: T.white, fontSize: 15, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  ctaPhone: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '500', textAlign: 'center' },

  // Ending CTA card
  ctaCardEnd: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 2,
    borderColor: T.gold,
    borderRadius: 16,
    paddingVertical: 26,
    paddingHorizontal: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
    zIndex: 10,
  },
  ctaHighlightWrap: { ...StyleSheet.absoluteFillObject, opacity: 0.18 },
  ctaHeadlineEnd: {
    color: T.gold,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaUrlEnd:   { color: T.white, fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  ctaPhoneEnd: { color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: '500', textAlign: 'center' },

  // Progress bar
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
    zIndex: 10,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: T.gold,
  },

  // Skip row
  skipRow: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  skipRowPlaceholder: {
    height: 60,
    paddingBottom: 36,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
    gap: 6,
  },
  closeIcon:   { width: 14, height: 14, opacity: 0.65 },
  skipBtnImg:  { width: 18, height: 18, opacity: 0.70 },
  skipText:    { color: T.white, fontSize: 13, fontWeight: '700' },
});
