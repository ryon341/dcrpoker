import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { handsApi, HandRecord, CreateHandPayload, GameType, ResultType, TableFormat, ReviewStatus } from '../../../src/api/hands';
import { getSpotPrefillFromHand } from '../../../src/lib/handStudyHelpers';

// ─── Constants ────────────────────────────────────────────────────────────────

const TAGS = [
  'punt', 'cooler', 'bad beat', 'hero call', 'bluff',
  'bad fold', 'tough spot', 'misplayed', 'standard', 'review later',
];

const POSITIONS = ['UTG', 'UTG+1', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

const STAKES_OPTIONS = ['0.5/1', '1/2', '1/3', '2/5', '5/10', '5T', '10T', '25T'];

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = 'list' | 'form' | 'detail';

interface FormState {
  game_type: GameType;
  stakes: string;
  table_format: TableFormat;
  position: string;
  hero_hand: string;
  stack_depth_bb: string;
  preflop_action: string;
  postflop_action: string;
  result_type: ResultType | '';
  result_amount: string;
  tags: string[];
  notes: string;
}

const DEFAULT_FORM: FormState = {
  game_type: 'cash',
  stakes: '1/2',
  table_format: '9max',
  position: '',
  hero_hand: '',
  stack_depth_bb: '100',
  preflop_action: '',
  postflop_action: '',
  result_type: '',
  result_amount: '',
  tags: [],
  notes: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resultColor(rt: ResultType | null | undefined) {
  if (rt === 'win')  return '#2e7d32';
  if (rt === 'loss') return '#c62828';
  return '#555';
}

function formatAmount(amount: number | null | undefined, rt: ResultType | null | undefined) {
  if (amount == null) return '—';
  const sign = rt === 'win' ? '+' : rt === 'loss' ? '-' : '';
  return `${sign}$${Math.abs(amount).toFixed(0)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

// ─── Small shared components ──────────────────────────────────────────────────

function PillSelect({
  options,
  value,
  onSelect,
  multi = false,
  selectedValues,
  style,
}: {
  options: string[];
  value?: string;
  onSelect: (v: string) => void;
  multi?: boolean;
  selectedValues?: string[];
  style?: object;
}) {
  return (
    <View style={[ps.row, style]}>
      {options.map(o => {
        const active = multi ? (selectedValues ?? []).includes(o) : value === o;
        return (
          <TouchableOpacity
            key={o}
            style={[ps.pill, active && ps.pillActive]}
            onPress={() => onSelect(o)}
            activeOpacity={0.75}
          >
            <Text style={[ps.text, active && ps.textActive]}>{o}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const ps = StyleSheet.create({
  row:        { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill:       { backgroundColor: '#0f1b35', borderRadius: 16, paddingHorizontal: 11, paddingVertical: 6, borderWidth: 1, borderColor: '#2a2a4a' },
  pillActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  text:       { color: '#888', fontSize: 12, fontWeight: '600' },
  textActive: { color: '#fff' },
});

function FieldLabel({ children }: { children: string }) {
  return <Text style={fl.label}>{children}</Text>;
}
const fl = StyleSheet.create({ label: { color: '#777', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 6, marginTop: 14 } });

// ─── List Screen ─────────────────────────────────────────────────────────────

function HandList({
  hands,
  loading,
  filterTag,
  filterStakes,
  filterGame,
  filterReview,
  onSetFilterTag,
  onSetFilterStakes,
  onSetFilterGame,
  onSetFilterReview,
  onAdd,
  onView,
  onDelete,
  onRefresh,
}: {
  hands: HandRecord[];
  loading: boolean;
  filterTag: string;
  filterStakes: string;
  filterGame: GameType | '';
  filterReview: string;
  onSetFilterTag: (v: string) => void;
  onSetFilterStakes: (v: string) => void;
  onSetFilterGame: (v: GameType | '') => void;
  onSetFilterReview: (v: string) => void;
  onAdd: () => void;
  onView: (h: HandRecord) => void;
  onDelete: (h: HandRecord) => void;
  onRefresh: () => void;
}) {
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.headerRow}>
        <View>
          <Text style={s.heading}>Hand Recorder</Text>
          <Text style={s.sub}>{hands.length} hand{hands.length !== 1 ? 's' : ''} logged</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={onAdd} activeOpacity={0.8}>
          <Text style={s.addBtnText}>+ Log Hand</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={s.filterBlock}>
        <Text style={s.filterLabel}>FILTER BY GAME</Text>
        <PillSelect
          options={['all', 'cash', 'tournament']}
          value={filterGame || 'all'}
          onSelect={v => onSetFilterGame(v === 'all' ? '' : v as GameType)}
        />

        <Text style={[s.filterLabel, { marginTop: 10 }]}>FILTER BY STAKES</Text>
        <PillSelect
          options={['all', ...STAKES_OPTIONS]}
          value={filterStakes || 'all'}
          onSelect={v => onSetFilterStakes(v === 'all' ? '' : v)}
        />

        <Text style={[s.filterLabel, { marginTop: 10 }]}>FILTER BY TAG</Text>
        <PillSelect
          options={['all', ...TAGS]}
          value={filterTag || 'all'}
          onSelect={v => onSetFilterTag(v === 'all' ? '' : v)}
        />

        <Text style={[s.filterLabel, { marginTop: 10 }]}>FILTER BY STATUS</Text>
        <PillSelect
          options={['all', 'review_later', 'studied']}
          value={filterReview || 'all'}
          onSelect={v => onSetFilterReview(v === 'all' ? '' : v)}
        />
      </View>

      {loading && <ActivityIndicator color="#e94560" style={{ marginTop: 30 }} />}

      {!loading && hands.length === 0 && (
        <View style={s.emptyBox}>
          <Text style={s.emptyIcon}>🃏</Text>
          <Text style={s.emptyText}>No hands logged yet.</Text>
          <TouchableOpacity style={s.emptyBtn} onPress={onAdd} activeOpacity={0.8}>
            <Text style={s.emptyBtnText}>Log your first hand</Text>
          </TouchableOpacity>
        </View>
      )}

      {hands.map(hand => (
        <TouchableOpacity key={hand.id} style={s.handCard} onPress={() => onView(hand)} activeOpacity={0.8}>
          <View style={s.handCardTop}>
            <View style={s.handCardLeft}>
              <Text style={s.handCardHand}>{hand.hero_hand}</Text>
              <Text style={s.handCardMeta}>
                {hand.position} · {hand.stakes ?? '—'} · {hand.table_format ?? '—'}
              </Text>
            </View>
            <View style={s.handCardRight}>
              <Text style={[s.handCardAmount, { color: resultColor(hand.result_type) }]}>
                {formatAmount(hand.result_amount, hand.result_type)}
              </Text>
              <Text style={s.handCardDate}>{formatDate(hand.created_at)}</Text>
            </View>
          </View>

          {hand.review_status && hand.review_status !== 'none' && (
            <View style={[s.reviewBadge, hand.review_status === 'studied' ? s.reviewBadgeStudied : s.reviewBadgeReviewLater]}>
              <Text style={s.reviewBadgeText}>{hand.review_status === 'studied' ? '✓ Studied' : '🔖 Review Later'}</Text>
            </View>
          )}

          {hand.tags.length > 0 && (
            <View style={s.tagRow}>
              {hand.tags.map(t => (
                <View key={t} style={s.tag}>
                  <Text style={s.tagText}>{t}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={s.deleteBtn}
            onPress={() => onDelete(hand)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={s.deleteBtnText}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Form Screen (Add / Edit) ─────────────────────────────────────────────────

function HandForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: FormState;
  onSave: (f: FormState) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const set = (key: keyof FormState, value: any) => setForm(f => ({ ...f, [key]: value }));

  const toggleTag = (t: string) => {
    set('tags', form.tags.includes(t) ? form.tags.filter(x => x !== t) : [...form.tags, t]);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.headerRow}>
        <Text style={s.heading}>{initial.hero_hand ? 'Edit Hand' : 'Log Hand'}</Text>
        <TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
          <Text style={s.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Game Type */}
      <FieldLabel>Game Type *</FieldLabel>
      <PillSelect
        options={['cash', 'tournament']}
        value={form.game_type}
        onSelect={v => set('game_type', v as GameType)}
      />

      {/* Table Format */}
      <FieldLabel>Table Format</FieldLabel>
      <PillSelect
        options={['6max', '9max', 'other']}
        value={form.table_format}
        onSelect={v => set('table_format', v as TableFormat)}
      />

      {/* Stakes */}
      <FieldLabel>Stakes</FieldLabel>
      <PillSelect
        options={STAKES_OPTIONS}
        value={form.stakes}
        onSelect={v => set('stakes', v)}
        style={{ marginBottom: 6 }}
      />
      <TextInput
        style={s.input}
        value={form.stakes}
        onChangeText={v => set('stakes', v)}
        placeholder="Or type custom (e.g. 10/20)"
        placeholderTextColor="#555"
      />

      {/* Position */}
      <FieldLabel>Position *</FieldLabel>
      <PillSelect
        options={POSITIONS}
        value={form.position}
        onSelect={v => set('position', v)}
      />

      {/* Hero Hand */}
      <FieldLabel>Hero Hand *</FieldLabel>
      <TextInput
        style={s.input}
        value={form.hero_hand}
        onChangeText={v => set('hero_hand', v.toUpperCase())}
        placeholder="e.g. AsKs or AKs"
        placeholderTextColor="#555"
        autoCapitalize="characters"
        maxLength={10}
      />

      {/* Stack Depth */}
      <FieldLabel>Stack Depth (bb)</FieldLabel>
      <TextInput
        style={s.input}
        value={form.stack_depth_bb}
        onChangeText={v => set('stack_depth_bb', v)}
        placeholder="e.g. 100"
        placeholderTextColor="#555"
        keyboardType="numeric"
      />

      {/* Preflop Action */}
      <FieldLabel>Preflop Action</FieldLabel>
      <TextInput
        style={[s.input, s.textarea]}
        value={form.preflop_action}
        onChangeText={v => set('preflop_action', v)}
        placeholder="e.g. CO opens 3bb, I 3-bet to 10bb..."
        placeholderTextColor="#555"
        multiline
        numberOfLines={3}
      />

      {/* Postflop Action */}
      <FieldLabel>Postflop Action</FieldLabel>
      <TextInput
        style={[s.input, s.textarea]}
        value={form.postflop_action}
        onChangeText={v => set('postflop_action', v)}
        placeholder="e.g. Flop K72r, c-bet 12bb..."
        placeholderTextColor="#555"
        multiline
        numberOfLines={3}
      />

      {/* Result */}
      <FieldLabel>Result</FieldLabel>
      <PillSelect
        options={['win', 'loss', 'chop']}
        value={form.result_type}
        onSelect={v => set('result_type', v as ResultType)}
      />
      <TextInput
        style={[s.input, { marginTop: 8 }]}
        value={form.result_amount}
        onChangeText={v => set('result_amount', v)}
        placeholder="Amount won/lost (e.g. 150)"
        placeholderTextColor="#555"
        keyboardType="numeric"
      />

      {/* Tags */}
      <FieldLabel>Tags</FieldLabel>
      <PillSelect
        options={TAGS}
        multi
        selectedValues={form.tags}
        onSelect={toggleTag}
      />

      {/* Notes */}
      <FieldLabel>Notes</FieldLabel>
      <TextInput
        style={[s.input, s.textarea]}
        value={form.notes}
        onChangeText={v => set('notes', v)}
        placeholder="Any thoughts on this hand..."
        placeholderTextColor="#555"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[s.saveBtn, saving && s.saveBtnDisabled]}
        onPress={() => onSave(form)}
        activeOpacity={0.8}
        disabled={saving}
      >
        {saving
          ? <ActivityIndicator color="#fff" />
          : <Text style={s.saveBtnText}>Save Hand</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Detail Screen ────────────────────────────────────────────────────────────

function HandDetail({
  hand,
  onEdit,
  onBack,
  onDelete,
  onStudyEV,
  onStudySpot,
  onMarkReview,
  onMarkStudied,
}: {
  hand: HandRecord;
  onEdit: () => void;
  onBack: () => void;
  onDelete: () => void;
  onStudyEV: () => void;
  onStudySpot: () => void;
  onMarkReview: () => void;
  onMarkStudied: () => void;
}) {
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.headerRow}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.editBtnSmall} onPress={onEdit} activeOpacity={0.8}>
          <Text style={s.editBtnSmallText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={s.detailCard}>
        <Text style={s.detailHand}>{hand.hero_hand}</Text>
        <Text style={[s.detailResult, { color: resultColor(hand.result_type) }]}>
          {formatAmount(hand.result_amount, hand.result_type)}
          {hand.result_type ? `  (${hand.result_type})` : ''}
        </Text>
        <Text style={s.detailDate}>{formatDate(hand.created_at)}</Text>
        {hand.review_status && hand.review_status !== 'none' && (
          <View style={[s.reviewBadge, hand.review_status === 'studied' ? s.reviewBadgeStudied : s.reviewBadgeReviewLater]}>
            <Text style={s.reviewBadgeText}>{hand.review_status === 'studied' ? '✓ Studied' : '🔖 Review Later'}</Text>
          </View>
        )}

        <View style={s.detailGrid}>
          {[
            ['Game',     hand.game_type],
            ['Format',   hand.table_format ?? '—'],
            ['Stakes',   hand.stakes ?? '—'],
            ['Position', hand.position],
            ['Stack',    hand.stack_depth_bb != null ? `${hand.stack_depth_bb}bb` : '—'],
          ].map(([lbl, val]) => (
            <View key={lbl} style={s.detailCell}>
              <Text style={s.detailCellLabel}>{lbl}</Text>
              <Text style={s.detailCellValue}>{val}</Text>
            </View>
          ))}
        </View>
      </View>

      {(hand.preflop_action || hand.postflop_action) && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Hand Action</Text>
          {hand.preflop_action ? (
            <>
              <Text style={s.actionLabel}>PREFLOP</Text>
              <Text style={s.actionText}>{hand.preflop_action}</Text>
            </>
          ) : null}
          {hand.postflop_action ? (
            <>
              <Text style={[s.actionLabel, { marginTop: 10 }]}>POSTFLOP</Text>
              <Text style={s.actionText}>{hand.postflop_action}</Text>
            </>
          ) : null}
        </View>
      )}

      {hand.tags.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Tags</Text>
          <View style={s.tagRow}>
            {hand.tags.map(t => (
              <View key={t} style={s.tag}>
                <Text style={s.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {hand.notes ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Notes</Text>
          <Text style={s.notesText}>{hand.notes}</Text>
        </View>
      ) : null}

      {/* Study Actions */}
      <View style={s.studySection}>
        <Text style={s.sectionTitle}>Study Actions</Text>
        <View style={s.studyGrid}>
          <TouchableOpacity style={s.studyBtn} onPress={onStudyEV} activeOpacity={0.8}>
            <Text style={s.studyBtnIcon}>📐</Text>
            <Text style={s.studyBtnText}>Analyze EV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.studyBtn} onPress={onStudySpot} activeOpacity={0.8}>
            <Text style={s.studyBtnIcon}>🧠</Text>
            <Text style={s.studyBtnText}>Train This Spot</Text>
          </TouchableOpacity>
        </View>
        <View style={[s.studyGrid, { marginTop: 8 }]}>
          <TouchableOpacity
            style={[s.studyBtn, hand.review_status === 'review_later' && s.studyBtnActive]}
            onPress={onMarkReview}
            activeOpacity={0.8}
          >
            <Text style={s.studyBtnIcon}>🔖</Text>
            <Text style={s.studyBtnText}>
              {hand.review_status === 'review_later' ? 'Unmark Review' : 'Mark for Review'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.studyBtn, hand.review_status === 'studied' && s.studyBtnActive]}
            onPress={onMarkStudied}
            activeOpacity={0.8}
          >
            <Text style={s.studyBtnIcon}>✅</Text>
            <Text style={s.studyBtnText}>
              {hand.review_status === 'studied' ? 'Unmark Studied' : 'Mark as Studied'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={s.deleteFullBtn} onPress={onDelete} activeOpacity={0.8}>
        <Text style={s.deleteFullBtnText}>Delete Hand</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HandRecorder() {
  const router = useRouter();
  const [screen,        setScreen]       = useState<Screen>('list');
  const [hands,         setHands]        = useState<HandRecord[]>([]);
  const [loading,       setLoading]      = useState(true);
  const [saving,        setSaving]       = useState(false);
  const [selectedHand,  setSelectedHand] = useState<HandRecord | null>(null);
  const [editForm,      setEditForm]     = useState<FormState>(DEFAULT_FORM);

  const [filterTag,    setFilterTag]    = useState('');
  const [filterStakes, setFilterStakes] = useState('');
  const [filterGame,   setFilterGame]   = useState<GameType | ''>('');
  const [filterReview, setFilterReview] = useState('');

  const loadHands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await handsApi.list({
        game_type:     filterGame || undefined,
        stakes:        filterStakes || undefined,
        tag:           filterTag || undefined,
        review_status: (filterReview as ReviewStatus) || undefined,
      });
      setHands((res as any).data ?? res);
    } catch (e) {
      // silently fail on load — empty list shown
    } finally {
      setLoading(false);
    }
  }, [filterGame, filterStakes, filterTag, filterReview]);

  useEffect(() => { loadHands(); }, [loadHands]);

  // ── Navigation ────────────────────────────────────────────────────────────

  const openAdd = useCallback(() => {
    setEditForm(DEFAULT_FORM);
    setSelectedHand(null);
    setScreen('form');
  }, []);

  const openEdit = useCallback((hand: HandRecord) => {
    setEditForm({
      game_type:      (hand.game_type as GameType) ?? 'cash',
      stakes:         hand.stakes ?? '',
      table_format:   (hand.table_format as TableFormat) ?? '9max',
      position:       hand.position,
      hero_hand:      hand.hero_hand,
      stack_depth_bb: hand.stack_depth_bb != null ? String(hand.stack_depth_bb) : '',
      preflop_action:  hand.preflop_action ?? '',
      postflop_action: hand.postflop_action ?? '',
      result_type:    (hand.result_type as ResultType) ?? '',
      result_amount:  hand.result_amount != null ? String(hand.result_amount) : '',
      tags:           hand.tags ?? [],
      notes:          hand.notes ?? '',
    });
    setSelectedHand(hand);
    setScreen('form');
  }, []);

  const openDetail = useCallback((hand: HandRecord) => {
    setSelectedHand(hand);
    setScreen('detail');
  }, []);

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleSave = useCallback(async (form: FormState) => {
    if (!form.game_type)  return Alert.alert('Required', 'Game type is required.');
    if (!form.position)   return Alert.alert('Required', 'Position is required.');
    if (!form.hero_hand)  return Alert.alert('Required', 'Hero hand is required.');

    const payload: CreateHandPayload = {
      game_type:       form.game_type,
      position:        form.position,
      hero_hand:       form.hero_hand,
      stakes:          form.stakes || undefined,
      table_format:    form.table_format || undefined,
      stack_depth_bb:  form.stack_depth_bb ? parseFloat(form.stack_depth_bb) : undefined,
      preflop_action:  form.preflop_action || undefined,
      postflop_action: form.postflop_action || undefined,
      result_type:     (form.result_type as ResultType) || undefined,
      result_amount:   form.result_amount ? parseFloat(form.result_amount) : undefined,
      tags:            form.tags.length > 0 ? form.tags : undefined,
      notes:           form.notes || undefined,
    };

    setSaving(true);
    try {
      if (selectedHand) {
        await handsApi.update(selectedHand.id, payload);
      } else {
        await handsApi.create(payload);
      }
      await loadHands();
      setScreen('list');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not save hand.');
    } finally {
      setSaving(false);
    }
  }, [selectedHand, loadHands]);

  const handleDelete = useCallback((hand: HandRecord) => {
    Alert.alert('Delete Hand', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await handsApi.remove(hand.id);
            await loadHands();
            if (screen === 'detail') setScreen('list');
          } catch (e: any) {
            Alert.alert('Error', e?.message ?? 'Could not delete hand.');
          }
        },
      },
    ]);
  }, [loadHands, screen]);

  const handleMarkReview = useCallback(async (hand: HandRecord) => {
    const newStatus: ReviewStatus = hand.review_status === 'review_later' ? 'none' : 'review_later';
    try {
      const res = await handsApi.update(hand.id, { review_status: newStatus });
      const updated = (res as any).data ?? res;
      setSelectedHand(updated);
      await loadHands();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not update review status.');
    }
  }, [loadHands]);

  const handleMarkStudied = useCallback(async (hand: HandRecord) => {
    const newStatus: ReviewStatus = hand.review_status === 'studied' ? 'none' : 'studied';
    try {
      const res = await handsApi.update(hand.id, { review_status: newStatus });
      const updated = (res as any).data ?? res;
      setSelectedHand(updated);
      await loadHands();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not update review status.');
    }
  }, [loadHands]);

  const handleStudyEV = useCallback((hand: HandRecord) => {
    router.push({
      pathname: '/(protected)/tools/ev-analyzer' as any,
      params: {
        handId:       String(hand.id),
        heroHand:     hand.hero_hand,
        position:     hand.position,
        stackDepthBb: hand.stack_depth_bb != null ? String(hand.stack_depth_bb) : '',
        gameType:     hand.game_type ?? '',
        stakes:       hand.stakes ?? '',
      },
    });
  }, [router]);

  const handleStudySpot = useCallback((hand: HandRecord) => {
    const prefill = getSpotPrefillFromHand(hand);
    router.push({
      pathname: '/(protected)/tools/training-spot' as any,
      params: {
        prefillCategory: prefill.category,
        heroHand:        prefill.heroHand ?? '',
        position:        prefill.position ?? '',
        gameType:        prefill.gameType ?? '',
        stackDepthBb:    prefill.stackDepthBb != null ? String(prefill.stackDepthBb) : '',
      },
    });
  }, [router]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (screen === 'form') {
    return (
      <HandForm
        initial={editForm}
        onSave={handleSave}
        onCancel={() => setScreen(selectedHand ? 'detail' : 'list')}
        saving={saving}
      />
    );
  }

  if (screen === 'detail' && selectedHand) {
    return (
      <HandDetail
        hand={selectedHand}
        onEdit={() => openEdit(selectedHand)}
        onBack={() => setScreen('list')}
        onDelete={() => handleDelete(selectedHand)}
        onStudyEV={() => handleStudyEV(selectedHand)}
        onStudySpot={() => handleStudySpot(selectedHand)}
        onMarkReview={() => handleMarkReview(selectedHand)}
        onMarkStudied={() => handleMarkStudied(selectedHand)}
      />
    );
  }

  return (
    <HandList
      hands={hands}
      loading={loading}
      filterTag={filterTag}
      filterStakes={filterStakes}
      filterGame={filterGame}
      filterReview={filterReview}
      onSetFilterTag={v => setFilterTag(v)}
      onSetFilterStakes={v => setFilterStakes(v)}
      onSetFilterGame={v => setFilterGame(v)}
      onSetFilterReview={v => setFilterReview(v)}
      onAdd={openAdd}
      onView={openDetail}
      onDelete={handleDelete}
      onRefresh={loadHands}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 20, paddingBottom: 60 },

  headerRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 8 },
  heading:    { color: '#e94560', fontSize: 24, fontWeight: 'bold' },
  sub:        { color: '#888', fontSize: 13, marginTop: 2 },
  cancelText: { color: '#e94560', fontSize: 15, fontWeight: '600' },
  backText:   { color: '#e94560', fontSize: 15, fontWeight: '600' },

  addBtn:     { backgroundColor: '#e94560', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 9 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  filterBlock: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  filterLabel: { color: '#555', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 },

  // Hand cards
  handCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  handCardTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  handCardLeft:   {},
  handCardHand:   { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  handCardMeta:   { color: '#888', fontSize: 12, marginTop: 2 },
  handCardRight:  { alignItems: 'flex-end' },
  handCardAmount: { fontSize: 18, fontWeight: 'bold' },
  handCardDate:   { color: '#666', fontSize: 11, marginTop: 2 },
  tagRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag:            { backgroundColor: '#0f1b35', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: '#1a3060' },
  tagText:        { color: '#aaa', fontSize: 11 },
  deleteBtn:      { position: 'absolute', top: 10, right: 10 },
  deleteBtnText:  { color: '#555', fontSize: 14 },

  // Empty state
  emptyBox:     { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  emptyIcon:    { fontSize: 48, marginBottom: 12 },
  emptyText:    { color: '#888', fontSize: 16, marginBottom: 20 },
  emptyBtn:     { backgroundColor: '#e94560', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 },
  emptyBtnText: { color: '#fff', fontWeight: 'bold' },

  // Form
  input: {
    backgroundColor: '#0f1b35',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    color: '#fff',
    padding: 12,
    fontSize: 14,
    marginTop: 6,
  },
  textarea:        { minHeight: 80, textAlignVertical: 'top' },
  saveBtn:         { backgroundColor: '#e94560', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText:     { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Detail
  detailCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 22,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  detailHand:       { color: '#fff', fontSize: 52, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  detailResult:     { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  detailDate:       { color: '#888', fontSize: 12, marginBottom: 18 },
  detailGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  detailCell:       { backgroundColor: '#0f1b35', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', minWidth: 80 },
  detailCellLabel:  { color: '#555', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  detailCellValue:  { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  section:       { backgroundColor: '#16213e', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#2a2a4a' },
  sectionTitle:  { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 10 },
  actionLabel:   { color: '#555', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 4 },
  actionText:    { color: '#ccc', fontSize: 14, lineHeight: 20 },
  notesText:     { color: '#ccc', fontSize: 14, lineHeight: 20 },

  editBtnSmall:     { backgroundColor: '#16213e', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: '#e94560' },
  editBtnSmallText: { color: '#e94560', fontWeight: 'bold', fontSize: 13 },

  deleteFullBtn:     { backgroundColor: '#1a0000', borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#c62828', marginTop: 10 },
  deleteFullBtnText: { color: '#ef5350', fontWeight: 'bold', fontSize: 15 },

  // Review badges
  reviewBadge:            { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  reviewBadgeReviewLater: { backgroundColor: '#3d2800', borderWidth: 1, borderColor: '#ff8f00' },
  reviewBadgeStudied:     { backgroundColor: '#003321', borderWidth: 1, borderColor: '#00c853' },
  reviewBadgeText:        { fontSize: 11, fontWeight: '700', color: '#fff' },

  // Study section
  studySection:  { backgroundColor: '#16213e', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#2a2a4a' },
  studyGrid:     { flexDirection: 'row', gap: 10 },
  studyBtn:      { flex: 1, backgroundColor: '#0f1b35', borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4a' },
  studyBtnActive:{ borderColor: '#e94560', backgroundColor: '#1a0020' },
  studyBtnIcon:  { fontSize: 22, marginBottom: 4 },
  studyBtnText:  { color: '#ccc', fontSize: 12, fontWeight: '600', textAlign: 'center' },
});
