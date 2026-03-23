import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  /** Current global level (1–25). Used to derive the active pip. */
  currentLevel: number;
  /** Array of unlocked global level numbers, e.g. [1, 2, 3]. */
  unlockedLevels: number[];
  /** Called when user taps an unlocked level pip. Receives the global level. */
  onSelect: (level: number) => void;
  /** Current tier name, used to label the panel. Defaults to 'Beginner'. */
  currentTier?: string;
};

const TIER_LEVELS: Record<string, number[]> = {
  Beginner:     [1, 2, 3, 4, 5],
  Apprentice:   [6, 7, 8, 9, 10],
  Grinder:      [11, 12, 13, 14, 15],
};

export function LevelSelectPanel({ currentLevel, unlockedLevels, onSelect, currentTier = 'Beginner' }: Props) {
  const levels = TIER_LEVELS[currentTier];
  // Only render for tiers we have a level set defined for
  if (!levels) return null;

  return (
    <View style={s.container}>
      <Text style={s.tierLabel}>{currentTier.toUpperCase()}</Text>
      <View style={s.row}>
        {levels.map(lv => {
          const unlocked = unlockedLevels.includes(lv);
          const active   = lv === currentLevel;
          return (
            <TouchableOpacity
              key={lv}
              style={[
                s.pip,
                unlocked ? s.pipUnlocked : s.pipLocked,
                active && s.pipActive,
              ]}
              onPress={() => onSelect(lv)}
              disabled={!unlocked}
              accessibilityLabel={`${currentTier} Level ${lv}${unlocked ? '' : ', locked'}`}
              accessibilityRole="button"
              accessibilityState={{ selected: active, disabled: !unlocked }}
            >
              {unlocked ? (
                <Text style={[s.pipText, active && s.pipTextActive]}>
                  {lv}
                </Text>
              ) : (
                <Text style={s.lockIcon}>🔒</Text>
              )}
              {active && <View style={s.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 12,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  tierLabel: {
    color: '#555',
    fontSize: 9,
    letterSpacing: 2.5,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  pip: {
    width: 38,
    height: 38,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pipUnlocked: {
    backgroundColor: '#1e1e36',
    borderWidth: 1,
    borderColor: '#36365a',
  },
  pipLocked: {
    backgroundColor: '#111120',
    borderWidth: 1,
    borderColor: '#1e1e2e',
  },
  pipActive: {
    backgroundColor: '#3a2c08',
    borderColor: '#c4983c',
  },
  pipText: {
    color: '#777',
    fontSize: 14,
    fontWeight: '700',
  },
  pipTextActive: {
    color: '#f0c040',
  },
  lockIcon: {
    fontSize: 12,
  },
  activeDot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#f0c040',
  },
});
