import React, { useCallback, useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  generatePreflopQuestion,
  getPreflopFeedback,
  PreflopAnswer,
  PreflopQuestion,
} from '../../../src/lib/trainingEngine';
import { PREFLOP_BOOKS } from '../../../src/lib/gearData';

type Phase = 'question' | 'feedback';

export default function PreflopTrainer() {
  const [question, setQuestion] = useState<PreflopQuestion>(generatePreflopQuestion);
  const [phase,    setPhase]    = useState<Phase>('question');
  const [chosen,   setChosen]   = useState<PreflopAnswer | null>(null);
  const [score,    setScore]    = useState({ correct: 0, total: 0 });

  const answer = useCallback(
    (choice: PreflopAnswer) => {
      setChosen(choice);
      setPhase('feedback');
      setScore(s => ({
        correct: s.correct + (choice === question.correct ? 1 : 0),
        total:   s.total + 1,
      }));
    },
    [question.correct],
  );

  const next = useCallback(() => {
    setQuestion(generatePreflopQuestion());
    setChosen(null);
    setPhase('question');
  }, []);

  const isCorrect    = chosen === question.correct;
  const feedbackText = chosen ? getPreflopFeedback(question, chosen) : '';
  const playersLabel = question.players === '9max' ? '9-max' : '6-max';

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* ── Score bar ── */}
      <View style={s.scoreBar}>
        <Text style={s.scoreLabel}>Score</Text>
        <Text style={s.scoreValue}>
          {score.correct} / {score.total}
        </Text>
      </View>

      {/* ── Question card ── */}
      <View style={s.questionCard}>
        <Text style={s.handCaption}>Your Hand</Text>
        <Text style={s.hand}>{question.hand}</Text>

        <View style={s.detailsRow}>
          <View style={s.detail}>
            <Text style={s.detailLabel}>Position</Text>
            <Text style={s.detailValue}>{question.position}</Text>
          </View>
          <View style={s.detail}>
            <Text style={s.detailLabel}>Stack</Text>
            <Text style={s.detailValue}>{question.stack}</Text>
          </View>
          <View style={s.detail}>
            <Text style={s.detailLabel}>Table</Text>
            <Text style={s.detailValue}>{playersLabel}</Text>
          </View>
        </View>

        <Text style={s.prompt}>It folds to you. What do you do?</Text>
      </View>

      {/* ── Answer buttons ── */}
      {phase === 'question' && (
        <View style={s.answerRow}>
          <TouchableOpacity
            style={[s.answerBtn, s.raiseBtn]}
            onPress={() => answer('Raise')}
            activeOpacity={0.8}
          >
            <Text style={s.answerBtnText}>↑  Raise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.answerBtn, s.foldBtn]}
            onPress={() => answer('Fold')}
            activeOpacity={0.8}
          >
            <Text style={s.answerBtnText}>✕  Fold</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Feedback ── */}
      {phase === 'feedback' && (
        <>
          <View style={[s.feedbackCard, isCorrect ? s.fbCorrect : s.fbWrong]}>
            <Text style={s.feedbackIcon}>{isCorrect ? '✓' : '✗'}</Text>
            <Text style={s.feedbackTitle}>
              {isCorrect ? 'Correct!' : `Incorrect — correct play: ${question.correct}`}
            </Text>
            <Text style={s.feedbackBody}>{feedbackText}</Text>
          </View>
          <TouchableOpacity style={s.nextBtn} onPress={next} activeOpacity={0.8}>
            <Text style={s.nextBtnText}>Next Question  →</Text>
          </TouchableOpacity>
        </>
      )}

      {/* ── Book Recommendations ── */}
      {score.total > 0 && (
        <View style={s.booksWrap}>
          <Text style={s.booksHeading}>📚 Improve Your Edge</Text>
          <Text style={s.booksSub}>Sharpen your preflop game with these reads.</Text>
          {PREFLOP_BOOKS.map(b => (
            <View key={b.id} style={s.bookCard}>
              {b.ourPick ? (
                <View style={s.bookBadge}><Text style={s.bookBadgeText}>{b.ourPick}</Text></View>
              ) : null}
              <Text style={s.bookTitle}>{b.name}</Text>
              <Text style={s.bookAuthor}>by {b.author}</Text>
              <Text style={s.bookDesc} numberOfLines={2}>{b.description}</Text>
              <TouchableOpacity
                style={s.bookBtn}
                onPress={() => Linking.openURL(b.link).catch(() => {})}
                activeOpacity={0.8}
              >
                <Text style={s.bookBtnText}>View on Amazon  →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 20, paddingBottom: 60 },

  scoreBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  scoreLabel: { color: '#aaa', fontSize: 14 },
  scoreValue: { color: '#e94560', fontSize: 18, fontWeight: 'bold' },

  questionCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 22,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  handCaption: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  hand: {
    color: '#fff',
    fontSize: 58,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 3,
  },
  detailsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  detail: {
    backgroundColor: '#0f1b35',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 72,
  },
  detailLabel: {
    color: '#666',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  prompt: { color: '#aaa', fontSize: 14, textAlign: 'center' },

  answerRow: { flexDirection: 'row', gap: 14, marginBottom: 10 },
  answerBtn: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  raiseBtn:      { backgroundColor: '#1b5e20' },
  foldBtn:       { backgroundColor: '#b71c1c' },
  answerBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  feedbackCard: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  fbCorrect: { backgroundColor: '#1b5e2022', borderColor: '#2e7d32' },
  fbWrong:   { backgroundColor: '#b71c1c22', borderColor: '#c62828' },
  feedbackIcon:  { fontSize: 28, textAlign: 'center', marginBottom: 4 },
  feedbackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  feedbackBody: { color: '#ccc', fontSize: 13, lineHeight: 20, textAlign: 'center' },

  nextBtn: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  booksWrap:    { marginTop: 24 },
  booksHeading: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  booksSub:     { color: '#888', fontSize: 12, marginBottom: 12 },
  bookCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  bookBadge:     { alignSelf: 'flex-start', backgroundColor: '#e94560', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2, marginBottom: 6 },
  bookBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  bookTitle:     { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  bookAuthor:    { color: '#888', fontSize: 12, marginBottom: 6 },
  bookDesc:      { color: '#aaa', fontSize: 12, lineHeight: 17, marginBottom: 10 },
  bookBtn:       { backgroundColor: '#0f1b35', borderRadius: 7, paddingVertical: 9, alignItems: 'center', borderWidth: 1, borderColor: '#1a3060' },
  bookBtnText:   { color: '#e94560', fontSize: 13, fontWeight: 'bold' },
});
