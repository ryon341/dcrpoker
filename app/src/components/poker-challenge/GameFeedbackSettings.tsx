import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';
import { getSoundEnabled, setSoundEnabled } from './gameAudio';
import { getHapticsEnabled, setHapticsEnabled } from './gameHaptics';
import { SettingsToggleRow } from './SettingsToggleRow';

export function GameFeedbackSettings() {
  const [soundOn,   setSoundOn]   = useState(true);
  const [hapticsOn, setHapticsOn] = useState(true);
  const [loaded,    setLoaded]    = useState(false);

  useEffect(() => {
    Promise.all([getSoundEnabled(), getHapticsEnabled()]).then(([s, h]) => {
      setSoundOn(s);
      setHapticsOn(h);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <View style={s.card}>
      <Text style={s.heading}>Feedback Settings</Text>
      <SettingsToggleRow
        label="Sound Effects"
        description="Synthesized tones for taps, results & rewards"
        value={soundOn}
        onValueChange={(val) => { setSoundOn(val); setSoundEnabled(val); }}
      />
      <View style={s.divider} />
      <SettingsToggleRow
        label="Haptics"
        description="Vibration feedback on supported devices"
        value={hapticsOn}
        onValueChange={(val) => { setHapticsOn(val); setHapticsEnabled(val); }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  card:    { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 14, gap: 8 },
  heading: { color: T.muted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
});
