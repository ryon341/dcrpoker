/**
 * AdInterstitial — full-screen ad overlay for DeerCreekRoad custom poker tables.
 *
 * Props:
 *   visible       – controlled by parent; true = show the overlay
 *   onDismiss     – called when user skips or timer expires
 *   storageKey    – unique key per placement (prevents re-show within cooldownHours)
 *   cooldownHours – hours before the ad shows again on the same placement (default 4)
 */
import { useEffect, useRef, useState } from 'react';
import {
  View, Image, Text, TouchableOpacity, StyleSheet,
  Dimensions, Animated, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { T } from './Theme';

const AD_URL = 'https://www.deercreekroad.com/poker-tables';
const COUNTDOWN = 7;

interface AdInterstitialProps {
  visible: boolean;
  onDismiss: () => void;
  storageKey: string;
  cooldownHours?: number;
}

export function AdInterstitial({ visible, onDismiss, storageKey, cooldownHours = 4 }: AdInterstitialProps) {
  const [seconds, setSeconds] = useState(COUNTDOWN);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fade in when visible
  useEffect(() => {
    if (visible) {
      setSeconds(COUNTDOWN);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(timerRef.current!);
            handleDismiss();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      fadeAnim.setValue(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [visible]);

  function handleDismiss() {
    if (timerRef.current) clearInterval(timerRef.current);
    Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
      onDismiss();
    });
  }

  function handleAdTap() {
    Linking.openURL(AD_URL).catch(() => {});
  }

  if (!visible) return null;

  const { width, height } = Dimensions.get('window');
  const canSkip = seconds === 0;

  return (
    <Animated.View style={[s.overlay, { opacity: fadeAnim }]}>
      {/* Ad image — full bleed, tappable */}
      <TouchableOpacity style={s.imageWrap} activeOpacity={0.92} onPress={handleAdTap}>
        <Image
          source={require('../../../assets/apploading.png')}
          style={[s.image, { width, height }]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Top-right badge */}
      <View style={s.adBadge}>
        <Text style={s.adBadgeText}>SPONSORED</Text>
      </View>

      {/* Bottom bar */}
      <View style={s.bottomBar}>
        <View style={s.adInfo}>
          <Text style={s.brandName}>DeerCreekRoad.com</Text>
          <Text style={s.tagLine}>Custom Poker Tables & Accessories</Text>
        </View>

        <TouchableOpacity
          style={[s.skipBtn, canSkip && s.skipBtnReady]}
          onPress={canSkip ? handleDismiss : undefined}
          activeOpacity={canSkip ? 0.8 : 1}
        >
          {canSkip ? (
            <Text style={[s.skipText, s.skipTextReady]}>Enter →</Text>
          ) : (
            <Text style={s.skipText}>Skip in {seconds}s</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={s.progressTrack}>
        <Animated.View
          style={[
            s.progressBar,
            {
              width: `${((COUNTDOWN - seconds) / COUNTDOWN) * 100}%`,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

/**
 * Hook that decides whether the interstitial should show this visit.
 * Returns { showAd, markAdShown }
 */
export function useAdGate(storageKey: string, cooldownHours = 4) {
  const [showAd, setShowAd] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const key = `dcr_ad_shown_${storageKey}`;
    AsyncStorage.getItem(key).then(raw => {
      if (raw) {
        const last = parseInt(raw, 10);
        const hoursSince = (Date.now() - last) / 3_600_000;
        if (hoursSince < cooldownHours) {
          setChecked(true);
          return;
        }
      }
      setShowAd(true);
      setChecked(true);
    });
  }, [storageKey]);

  function markAdShown() {
    setShowAd(false);
    AsyncStorage.setItem(`dcr_ad_shown_${storageKey}`, String(Date.now()));
  }

  return { showAd, checked, markAdShown };
}

const s = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
    backgroundColor: '#000',
  },
  imageWrap: { flex: 1 },
  image:     { flex: 1 },

  adBadge: {
    position: 'absolute',
    top: 48,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  adBadgeText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.2,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  adInfo:   { flex: 1, marginRight: 16 },
  brandName: { color: T.gold, fontWeight: '700', fontSize: 14, letterSpacing: 0.3 },
  tagLine:   { color: T.silver, fontSize: 12, marginTop: 2 },

  skipBtn: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  skipBtnReady: {
    backgroundColor: T.gold,
    borderColor: T.gold,
  },
  skipText:      { color: T.silver, fontSize: 13, fontWeight: '600' },
  skipTextReady: { color: '#0c0a09' },

  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressBar: {
    height: 3,
    backgroundColor: T.gold,
  },
});
