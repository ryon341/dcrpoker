import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  /** Name of the completed tier, e.g. 'Beginner'. */
  tier: string;
  /** Last level number in the tier (e.g. 5 for Beginner). */
  level: number;
  /** Name of the next tier to unlock, or null if this is the final tier. */
  nextTier: string | null;
  /** Called when player presses "Start <NextTier>" or "Continue". */
  onContinue: () => void;
  /** Called when player wants to replay the last level of this tier. */
  onReplay: () => void;
};

export function TierCompleteModal({
  visible,
  tier,
  level,
  nextTier,
  onContinue,
  onReplay,
}: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={s.overlay}>
        <View style={s.card}>

          <Text style={s.trophy}>🏆</Text>
          <Text style={s.tierLabel}>{tier.toUpperCase()} TIER</Text>
          <Text style={s.title}>COMPLETE!</Text>

          <Text style={s.body}>
            {nextTier
              ? `You've mastered all ${tier} levels.\n${nextTier} awaits — keep climbing.`
              : `All ${tier} challenges conquered.\nThe path ahead is yours.`}
          </Text>

          <View style={s.btnStack}>
            <TouchableOpacity style={[s.btn, s.continueBtn]} onPress={onContinue}>
              <Text style={s.continueBtnText}>
                {nextTier ? `Start ${nextTier} →` : 'Continue'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.btn, s.replayBtn]} onPress={onReplay}>
              <Text style={s.replayBtnText}>Replay Level {level}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#0f0f1e',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.35)',
  },
  trophy: {
    fontSize: 44,
    marginBottom: 12,
  },
  tierLabel: {
    color: '#d4a843',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 16,
  },
  body: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 28,
  },
  btnStack: {
    width: '100%',
    gap: 10,
  },
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueBtn: {
    backgroundColor: '#d4a843',
  },
  continueBtnText: {
    color: '#0a0a0f',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  replayBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  replayBtnText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
});
