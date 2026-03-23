import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  /** Global level number (1–25) */
  level: number;
  sessionCorrect: number;
  sessionLength: number;
  passed: boolean;
  onRetry: () => void;
  onNext: () => void;
};

export function SessionSummaryModal({
  visible,
  level,
  sessionCorrect,
  sessionLength,
  passed,
  onRetry,
  onNext,
}: Props) {
  const pct = Math.round((sessionCorrect / sessionLength) * 100);
  const passTarget = Math.ceil(sessionLength * 0.7);

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.levelLabel}>LEVEL {level}</Text>
          <Text style={s.title}>SESSION COMPLETE</Text>

          {/* Score display */}
          <View style={s.scoreRow}>
            <Text style={s.scoreNum}>{sessionCorrect}</Text>
            <Text style={s.scoreSep}>/</Text>
            <Text style={s.scoreTotal}>{sessionLength}</Text>
          </View>
          <Text style={s.scoreLabel}>{pct}% CORRECT</Text>

          {/* Pass / fail badge */}
          <View style={[s.badge, passed ? s.passedBadge : s.failedBadge]}>
            <Text style={s.badgeText}>
              {passed ? '✓ PASSED' : '✗ NOT QUITE'}
            </Text>
          </View>

          <Text style={s.hint}>
            {passed
              ? 'Level passed — next level unlocked!'
              : `Need ${passTarget} / ${sessionLength} correct to pass.`}
          </Text>

          {/* Action buttons — Next Level (primary) on top, Retry (secondary) below */}
          <View style={s.btnStack}>
            <TouchableOpacity
              style={[
                s.btn,
                s.nextBtn,
                !passed && s.btnDisabled,
              ]}
              onPress={passed ? onNext : undefined}
              disabled={!passed}
            >
              <Text style={s.btnText}>Next Level →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.btn, s.retryBtn]} onPress={onRetry}>
              <Text style={[s.btnText, s.retryText]}>Retry Level</Text>
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
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#14142a',
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2e2e50',
  },
  levelLabel: {
    color: '#666',
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 18,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
  },
  scoreNum: {
    color: '#f0c040',
    fontSize: 52,
    fontWeight: '800',
    lineHeight: 58,
  },
  scoreSep: {
    color: '#555',
    fontSize: 36,
    fontWeight: '300',
  },
  scoreTotal: {
    color: '#888',
    fontSize: 36,
    fontWeight: '400',
  },
  scoreLabel: {
    color: '#888',
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 20,
    marginBottom: 14,
  },
  passedBadge: { backgroundColor: '#163326' },
  failedBadge: { backgroundColor: '#331616' },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  hint: {
    color: '#777',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  btnStack: {
    gap: 10,
    width: '100%',
  },
  btn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  retryBtn: {
    backgroundColor: '#1e1e38',
    borderWidth: 1,
    borderColor: '#36365a',
  },
  nextBtn: {
    backgroundColor: '#b8882a',
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  retryText: {
    color: '#aaa',
  },
});
