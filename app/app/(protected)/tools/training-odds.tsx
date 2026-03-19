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
  generateOddsQuestion,
  getOddsFeedback,
  OddsQuestion,
} from '../../../src/lib/trainingEngine';
import { ODDS_BOOKS } from '../../../src/lib/gearData';

type Phase = 'question' | 'feedback';

export default function OddsTrainer() {
  const [question,     setQuestion]     = useState<OddsQuestion>(generateOddsQuestion);
  const [phase,        setPhase]        = useState<Phase>('question');
  const [chosenIndex,  setChosenIndex]  = useState<number | null>(null);
  const [score,        setScore]        = useState({ correct: 0, total: 0 });

  const answer = useCallback(
    (index: number) => {
      setChosenIndex(index);
      setPhase('feedback');
      setScore(s => ({
        correct: s.correct + (index === question.correctIndex ? 1 : 0),
        total:   s.total + 1,
      }));
    },
    [question.correctIndex],
  );

  const next = useCallback(() => {
    setQuestion(generateOddsQuestion());
    setChosenIndex(null);
    setPhase('question');
  }, []);

  const isCorrect    = chosenIndex === question.correctIndex;
  const feedbackText = getOddsFeedback(question, isCorrect);

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
        <Text style={s.questionPre}>You're on the flop with</Text>
        <Text style={s.drawLabel}>{question.drawLabel}</Text>
        <Text style={s.questionPost}>
          What is your chance to improve by the river?
        </Text>
      </View>

      {/* ── Answer choices ── */}
      <View style={s.choicesGrid}>
        {question.choices.map((pct, i) => {
          const isChosen = chosenIndex === i;
          const isRight  = i === question.correctIndex;

          const extraStyle =
            phase === 'feedback'
              ? isRight
                ? s.choiceCorrect
                : isChosen
                  ? s.choiceWrong
                  : s.choiceDim
              : null;

          return (
            <TouchableOpacity
              key={i}
              style={[s.choiceBtn, extraStyle]}
              onPress={phase === 'question' ? () => answer(i) : undefined}
              activeOpacity={phase === 'question' ? 0.75 : 1}
            >
              <Text
                style={[
                  s.choiceText,
                  phase === 'feedback' && (isRight || isChosen) && s.choiceTextBold,
                ]}
              >
                {pct}%
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Feedback ── */}
      {phase === 'feedback' && (
        <>
          <View style={[s.feedbackCard, isCorrect ? s.fbCorrect : s.fbWrong]}>
            <Text style={s.feedbackIcon}>{isCorrect ? '✓' : '✗'}</Text>
            <Text style={s.feedbackTitle}>{isCorrect ? 'Correct!' : 'Not quite'}</Text>
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
          <Text style={s.booksSub}>Books that break down the math behind the game.</Text>
          {ODDS_BOOKS.map(b => (
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
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  questionPre:  { color: '#888', fontSize: 14, marginBottom: 10 },
  drawLabel: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 26,
  },
  questionPost: { color: '#aaa', fontSize: 14, textAlign: 'center' },

  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  choiceBtn: {
    width: '47%',
    paddingVertical: 22,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#0f3460',
    borderWidth: 1,
    borderColor: '#1a4a7a',
  },
  choiceCorrect: { backgroundColor: '#1b5e20', borderColor: '#2e7d32' },
  choiceWrong:   { backgroundColor: '#b71c1c', borderColor: '#c62828' },
  choiceDim:     { opacity: 0.4 },
  choiceText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  choiceTextBold: { fontWeight: 'bold', fontSize: 24 },

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
