// ─── TC099 — Challenge Review Screen ─────────────────────────────────────────
// Dev-only admin surface for inspecting, quarantining, and overriding
// challenge questions. Reads raw banks + analytics; drafts changes locally;
// generates copy-pasteable registry patches.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Alert, Clipboard, ActivityIndicator,
} from 'react-native';
import { T } from '../ui/Theme';
import { rawTierQuestionBanks } from './data/tierQuestionBanks';
import { QUESTION_REVIEW_REGISTRY, isValidReplacementQuestion } from './challengeQuestionReviewRegistry';
import type { QuestionReviewStatus, ReviewedQuestionEntry } from './challengeQuestionReviewRegistry';
import type { ChallengeQuestion, ChallengeTier } from './challengeQuestionTypes';
import {
  loadReviewDrafts, saveReviewDraft, removeReviewDraft, clearReviewDrafts,
  getMergedReviewRegistry,
  type ReviewDraftEntry,
} from './challengeReviewDraftStorage';
import {
  exportAllDraftsAsPatch,
  exportSingleDraftSnippet,
} from './challengeReviewExport';
import { getPerQuestionStats, type QuestionPerformanceSummary } from './challengeAnalyticsStorage';


// ── Flat question list ────────────────────────────────────────────────────────

type FlatQuestion = ChallengeQuestion & { tierKey: ChallengeTier };

function buildFlatList(): FlatQuestion[] {
  const out: FlatQuestion[] = [];
  for (const [tier, qs] of Object.entries(rawTierQuestionBanks) as [ChallengeTier, ChallengeQuestion[]][]) {
    for (const q of qs) {
      out.push({ ...q, tierKey: tier });
    }
  }
  return out;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusColor(status: QuestionReviewStatus | undefined): string {
  if (status === 'quarantined') return T.red;
  if (status === 'overridden')  return T.gold;
  return T.green;
}

function statusLabel(status: QuestionReviewStatus | undefined): string {
  if (status === 'quarantined') return 'QUAR';
  if (status === 'overridden')  return 'OVRD';
  return 'OK';
}

function accuracyColor(acc: number | undefined): string {
  if (acc === undefined) return T.muted;
  if (acc <= 30) return T.red;
  if (acc <= 55) return T.gold;
  return T.green;
}

const ALL_TIERS: ChallengeTier[] = ['beginner', 'apprentice', 'grinder', 'chip_leader', 'master'];
const ALL_CATS = ['action', 'ev', 'outs', 'position', 'pressure'];
const ALL_STATUSES: Array<'all' | QuestionReviewStatus> = ['all', 'quarantined', 'overridden', 'active'];

// ── Main component ────────────────────────────────────────────────────────────

export function ChallengeReviewScreen(): React.ReactElement {
  // Data state
  const [allQuestions] = useState<FlatQuestion[]>(() => buildFlatList());
  const [perfMap,    setPerfMap]    = useState<Record<string, QuestionPerformanceSummary>>({});
  const [drafts,     setDrafts]     = useState<Record<string, ReviewDraftEntry>>({});
  const [loading,    setLoading]    = useState(true);

  // Filter state
  const [search,     setSearch]     = useState('');
  const [filterTier, setFilterTier] = useState<'all' | ChallengeTier>('all');
  const [filterCat,  setFilterCat]  = useState<'all' | string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | QuestionReviewStatus>('all');
  const [sortBy,     setSortBy]     = useState<'id' | 'miss' | 'easy'>('id');

  // Detail / edit state
  const [selected,      setSelected]      = useState<FlatQuestion | null>(null);
  const [draftStatus,   setDraftStatus]   = useState<QuestionReviewStatus>('active');
  const [draftReason,   setDraftReason]   = useState('');
  const [draftNotes,    setDraftNotes]    = useState('');
  const [draftRepJson,  setDraftRepJson]  = useState('');
  const [repJsonError,  setRepJsonError]  = useState('');
  const [exportText,    setExportText]    = useState('');
  const [previewActive, setPreviewActive] = useState(false);
  const [previewCounts, setPreviewCounts] = useState<Record<string, number>>({});

  // Load analytics + drafts on mount
  useEffect(() => {
    Promise.all([getPerQuestionStats(), loadReviewDrafts()]).then(([perf, loaded]) => {
      setPerfMap(perf);
      setDrafts(loaded);
      setLoading(false);
    });
  }, []);

  // Effective review status per question (draft overrides registry)
  const effectiveStatus = useCallback((id: string): QuestionReviewStatus => {
    if (drafts[id]) return drafts[id].status;
    return QUESTION_REVIEW_REGISTRY[id]?.status ?? 'active';
  }, [drafts]);

  // Filtered + sorted question list
  const filteredQuestions = useMemo(() => {
    const q = search.toLowerCase();
    let list = allQuestions.filter(question => {
      if (q && !question.id.toLowerCase().includes(q) && !question.prompt.toLowerCase().includes(q)) return false;
      if (filterTier !== 'all' && question.tierKey !== filterTier) return false;
      if (filterCat  !== 'all' && question.category !== filterCat) return false;
      const s = effectiveStatus(question.id);
      if (filterStatus !== 'all' && s !== filterStatus) return false;
      return true;
    });

    if (sortBy === 'miss') {
      list = [...list].sort((a, b) => {
        const pa = perfMap[a.id];
        const pb = perfMap[b.id];
        const ma = pa ? (pa.attempts > 0 ? 100 - pa.accuracy : 0) : 0;
        const mb = pb ? (pb.attempts > 0 ? 100 - pb.accuracy : 0) : 0;
        return mb - ma;
      });
    } else if (sortBy === 'easy') {
      list = [...list].sort((a, b) => {
        const pa = perfMap[a.id];
        const pb = perfMap[b.id];
        const aa = pa ? pa.accuracy : 0;
        const ab = pb ? pb.accuracy : 0;
        return ab - aa;
      });
    }

    return list;
  }, [allQuestions, search, filterTier, filterCat, filterStatus, sortBy, effectiveStatus, perfMap]);

  // Load draft fields when a question is selected
  const selectQuestion = useCallback((q: FlatQuestion) => {
    setSelected(q);
    setExportText('');
    setRepJsonError('');
    const d = drafts[q.id];
    const reg = QUESTION_REVIEW_REGISTRY[q.id];
    setDraftStatus(d?.status ?? reg?.status ?? 'active');
    setDraftReason(d?.reason ?? reg?.reason ?? '');
    setDraftNotes(d?.notes ?? reg?.notes ?? '');
    setDraftRepJson(
      d?.replacementQuestionJson ??
      (reg?.replacementQuestion ? JSON.stringify(reg.replacementQuestion, null, 2) : ''),
    );
  }, [drafts]);

  // Save draft
  const handleSaveDraft = useCallback(async () => {
    if (!selected) return;

    // Validate replacement JSON if override
    if (draftStatus === 'overridden') {
      if (!draftRepJson.trim()) {
        setRepJsonError('Replacement question JSON is required for override status.');
        return;
      }
      try {
        const parsed = JSON.parse(draftRepJson);
        if (!isValidReplacementQuestion(parsed)) {
          setRepJsonError('Replacement question is invalid. Must have id, tier, level, category, prompt, explanation, tags, correctAction or choices+correctAnswer.');
          return;
        }
      } catch {
        setRepJsonError('Invalid JSON — check syntax.');
        return;
      }
    }
    if ((draftStatus === 'quarantined' || draftStatus === 'overridden') && !draftReason.trim()) {
      Alert.alert('Reason required', 'Please enter a reason before saving.');
      return;
    }

    setRepJsonError('');
    const entry: ReviewDraftEntry = {
      questionId:              selected.id,
      status:                  draftStatus,
      tier:                    selected.tier,
      category:                selected.category,
      reason:                  draftReason,
      notes:                   draftNotes || undefined,
      replacementQuestionJson: draftStatus === 'overridden' ? draftRepJson : undefined,
      updatedAt:               new Date().toISOString(),
    };
    await saveReviewDraft(entry);
    setDrafts(prev => ({ ...prev, [entry.questionId]: entry }));
  }, [selected, draftStatus, draftReason, draftNotes, draftRepJson]);

  // Revert to checked-in state
  const handleRevertDraft = useCallback(async () => {
    if (!selected) return;
    await removeReviewDraft(selected.id);
    setDrafts(prev => {
      const next = { ...prev };
      delete next[selected.id];
      return next;
    });
    selectQuestion(selected);
  }, [selected, selectQuestion]);

  // Export single draft
  const handleExportSelected = useCallback(() => {
    if (!selected || !drafts[selected.id]) {
      setExportText('// No draft saved for this question yet.');
      return;
    }
    setExportText(exportSingleDraftSnippet(drafts[selected.id]));
  }, [selected, drafts]);

  // Export all drafts
  const handleExportAll = useCallback(() => {
    setExportText(exportAllDraftsAsPatch(drafts));
  }, [drafts]);

  // Copy export to clipboard
  const handleCopyExport = useCallback(() => {
    if (exportText) {
      Clipboard.setString(exportText);
      Alert.alert('Copied', 'Patch code copied to clipboard.');
    }
  }, [exportText]);

  // Apply a custom registry to a bank (used for preview, since applyQuestionReviewLayer reads global registry)
  const applyRegistryToBank = useCallback(
    (bank: ChallengeQuestion[], registry: Record<string, ReviewedQuestionEntry>): number =>
      bank.filter(q => {
        const entry = registry[q.id];
        if (!entry || entry.status === 'active') return true;
        if (entry.status === 'quarantined') return false;
        if (entry.status === 'overridden') {
          return !!(entry.replacementQuestion && isValidReplacementQuestion(entry.replacementQuestion));
        }
        return true;
      }).length,
    [],
  );

  // Session preview
  const handlePreview = useCallback(() => {
    const merged = getMergedReviewRegistry(drafts);
    const counts: Record<string, number> = {};
    for (const [tier, bank] of Object.entries(rawTierQuestionBanks) as [ChallengeTier, ChallengeQuestion[]][]) {
      counts[tier] = applyRegistryToBank(bank, merged);
    }
    setPreviewCounts(counts);
    setPreviewActive(true);
  }, [drafts, applyRegistryToBank]);

  // Clear all drafts
  const handleClearAll = useCallback(() => {
    Alert.alert('Clear all drafts?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: async () => {
          await clearReviewDrafts();
          setDrafts({});
          setPreviewActive(false);
        },
      },
    ]);
  }, []);

  if (loading) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator color={T.gold} size="large" />
        <Text style={s.loadingText}>Loading review data…</Text>
      </View>
    );
  }

  const draftCount    = Object.keys(drafts).length;
  const quarCount     = Object.values(drafts).filter(d => d.status === 'quarantined').length;
  const overrideCount = Object.values(drafts).filter(d => d.status === 'overridden').length;

  return (
    <View style={s.root}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>⚙️  Challenge Review  <Text style={s.devBadge}>[DEV]</Text></Text>
        <Text style={s.headerSub}>
          {allQuestions.length} Qs · {draftCount} drafts ({quarCount} quar, {overrideCount} override)
        </Text>
      </View>

      <View style={s.body}>
        {/* ── Left: filter + list ─────────────────────────────────────────── */}
        <View style={s.leftPane}>
          {/* Search */}
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search ID or prompt…"
            placeholderTextColor={T.muted}
          />

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow}>
            {ALL_TIERS.map(tier => (
              <TouchableOpacity
                key={tier}
                style={[s.filterChip, filterTier === tier && s.filterChipActive]}
                onPress={() => setFilterTier(prev => (prev === tier ? 'all' : tier))}
              >
                <Text style={[s.filterChipText, filterTier === tier && s.filterChipTextActive]}>
                  {tier.replace('_', '·')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow}>
            {ALL_CATS.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[s.filterChip, filterCat === cat && s.filterChipActive]}
                onPress={() => setFilterCat(prev => (prev === cat ? 'all' : cat))}
              >
                <Text style={[s.filterChipText, filterCat === cat && s.filterChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow}>
            {ALL_STATUSES.map(st => (
              <TouchableOpacity
                key={st}
                style={[s.filterChip, filterStatus === st && s.filterChipActive]}
                onPress={() => setFilterStatus(st as typeof filterStatus)}
              >
                <Text style={[s.filterChipText, filterStatus === st && s.filterChipTextActive]}>{st}</Text>
              </TouchableOpacity>
            ))}
            {(['id', 'miss', 'easy'] as const).map(s2 => (
              <TouchableOpacity
                key={s2}
                style={[s.filterChip, sortBy === s2 && s.filterChipActive]}
                onPress={() => setSortBy(s2)}
              >
                <Text style={[s.filterChipText, sortBy === s2 && s.filterChipTextActive]}>
                  sort:{s2}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.listCount}>{filteredQuestions.length} shown</Text>

          {/* Question list */}
          <ScrollView style={s.questionList} keyboardShouldPersistTaps="handled">
            {filteredQuestions.map(q => {
              const perf   = perfMap[q.id];
              const status = effectiveStatus(q.id);
              const isSelected = selected?.id === q.id;
              return (
                <TouchableOpacity
                  key={q.id}
                  style={[s.questionRow, isSelected && s.questionRowSelected]}
                  onPress={() => selectQuestion(q)}
                >
                  <View style={s.questionRowLeft}>
                    <Text style={s.questionId} numberOfLines={1}>{q.id}</Text>
                    <Text style={s.questionMeta}>{q.tierKey}  /  {q.category}  /  L{q.level}</Text>
                  </View>
                  <View style={s.questionRowRight}>
                    {perf && perf.attempts > 0 ? (
                      <Text style={[s.accBadge, { color: accuracyColor(perf.accuracy) }]}>
                        {perf.accuracy}%
                      </Text>
                    ) : (
                      <Text style={s.noData}>—</Text>
                    )}
                    <View style={[s.statusBadge, { backgroundColor: statusColor(status) + '33' }]}>
                      <Text style={[s.statusBadgeText, { color: statusColor(status) }]}>{statusLabel(status)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Right: detail + editor ──────────────────────────────────────── */}
        <ScrollView style={s.rightPane} keyboardShouldPersistTaps="handled">
          {!selected ? (
            <View style={s.emptyState}>
              <Text style={s.emptyText}>Select a question to inspect</Text>
            </View>
          ) : (
            <>
              {/* ── Question detail ───────────────────────────────────────── */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>QUESTION DETAIL</Text>
                <DetailRow label="ID"       value={selected.id} mono />
                <DetailRow label="Tier"     value={selected.tier} />
                <DetailRow label="Category" value={selected.category} />
                <DetailRow label="Level"    value={String(selected.level)} />
                <DetailRow
                  label="Status"
                  value={effectiveStatus(selected.id)}
                  valueColor={statusColor(effectiveStatus(selected.id))}
                />
                {drafts[selected.id] && (
                  <Text style={s.draftFlag}>✏ Draft pending (not yet in checked-in registry)</Text>
                )}
              </View>

              <View style={s.section}>
                <Text style={s.sectionTitle}>PROMPT</Text>
                <Text style={s.promptText}>{selected.prompt}</Text>
              </View>

              <View style={s.section}>
                <Text style={s.sectionTitle}>ANSWER</Text>
                {selected.category === 'action' ? (
                  <DetailRow label="Correct action" value={selected.correctAction ?? '—'} />
                ) : (
                  <>
                    <DetailRow label="Correct answer" value={selected.correctAnswer ?? '—'} />
                    <DetailRow label="Choices" value={(selected.choices ?? []).join('  |  ')} />
                  </>
                )}
                <Text style={s.explanationText}>{selected.explanation}</Text>
              </View>

              {/* ── Analytics ─────────────────────────────────────────────── */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>ANALYTICS</Text>
                {perfMap[selected.id] ? (
                  <>
                    <DetailRow label="Attempts"  value={String(perfMap[selected.id].attempts)} />
                    <DetailRow label="Correct"   value={String(perfMap[selected.id].correct)} />
                    <DetailRow label="Incorrect" value={String(perfMap[selected.id].incorrect)} />
                    <DetailRow
                      label="Accuracy"
                      value={`${perfMap[selected.id].accuracy}%`}
                      valueColor={accuracyColor(perfMap[selected.id].accuracy)}
                    />
                  </>
                ) : (
                  <Text style={s.noDataText}>No analytics data for this question yet.</Text>
                )}
              </View>

              {/* ── Draft editor ──────────────────────────────────────────── */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>REVIEW DRAFT</Text>

                {/* Status selector */}
                <Text style={s.fieldLabel}>Status</Text>
                <View style={s.statusRow}>
                  {(['active', 'quarantined', 'overridden'] as QuestionReviewStatus[]).map(st => (
                    <TouchableOpacity
                      key={st}
                      style={[s.statusBtn, draftStatus === st && { backgroundColor: statusColor(st) + '44', borderColor: statusColor(st) }]}
                      onPress={() => { setDraftStatus(st); setRepJsonError(''); }}
                    >
                      <Text style={[s.statusBtnText, draftStatus === st && { color: statusColor(st) }]}>{st}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Reason */}
                <Text style={s.fieldLabel}>Reason {(draftStatus !== 'active') ? '*' : ''}</Text>
                <TextInput
                  style={s.textArea}
                  value={draftReason}
                  onChangeText={setDraftReason}
                  placeholder="Why is this question flagged?"
                  placeholderTextColor={T.muted}
                  multiline
                  numberOfLines={2}
                />

                {/* Notes */}
                <Text style={s.fieldLabel}>Notes (optional)</Text>
                <TextInput
                  style={s.textArea}
                  value={draftNotes}
                  onChangeText={setDraftNotes}
                  placeholder="Additional context…"
                  placeholderTextColor={T.muted}
                  multiline
                  numberOfLines={2}
                />

                {/* Replacement JSON */}
                {draftStatus === 'overridden' && (
                  <>
                    <Text style={s.fieldLabel}>Replacement Question (JSON) *</Text>
                    <Text style={s.fieldHint}>
                      Must be a valid ChallengeQuestion. Required fields: id, tier, level, category, prompt, explanation, tags, correctAction (action) OR choices + correctAnswer (others).
                    </Text>
                    <TextInput
                      style={[s.codeArea, repJsonError ? s.codeAreaError : null]}
                      value={draftRepJson}
                      onChangeText={txt => { setDraftRepJson(txt); setRepJsonError(''); }}
                      placeholder={'{\n  "id": "...",\n  "tier": "...",\n  ...\n}'}
                      placeholderTextColor={T.muted}
                      multiline
                      numberOfLines={8}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {repJsonError !== '' && (
                      <Text style={s.errorText}>{repJsonError}</Text>
                    )}
                  </>
                )}

                {/* Action buttons */}
                <View style={s.actionRow}>
                  <TouchableOpacity style={s.btnPrimary} onPress={handleSaveDraft}>
                    <Text style={s.btnPrimaryText}>Save Draft</Text>
                  </TouchableOpacity>
                  {drafts[selected.id] && (
                    <TouchableOpacity style={s.btnSecondary} onPress={handleRevertDraft}>
                      <Text style={s.btnSecondaryText}>Revert</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* ── Export ────────────────────────────────────────────────── */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>EXPORT</Text>
                <View style={s.actionRow}>
                  <TouchableOpacity style={s.btnSecondary} onPress={handleExportSelected}>
                    <Text style={s.btnSecondaryText}>Export This</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.btnSecondary} onPress={handleExportAll}>
                    <Text style={s.btnSecondaryText}>Export All ({draftCount})</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.btnSecondary} onPress={handlePreview}>
                    <Text style={s.btnSecondaryText}>Preview</Text>
                  </TouchableOpacity>
                </View>

                {previewActive && (
                  <View style={s.previewBox}>
                    <Text style={s.previewTitle}>Session preview — bank sizes after draft applied:</Text>
                    {Object.entries(previewCounts).map(([tier, count]) => (
                      <Text key={tier} style={s.previewRow}>
                        {tier.padEnd(12)}  {count} / {rawTierQuestionBanks[tier as ChallengeTier].length}
                      </Text>
                    ))}
                  </View>
                )}

                {exportText !== '' && (
                  <>
                    <ScrollView style={s.exportBox} horizontal>
                      <Text style={s.exportCode} selectable>{exportText}</Text>
                    </ScrollView>
                    <TouchableOpacity style={s.btnPrimary} onPress={handleCopyExport}>
                      <Text style={s.btnPrimaryText}>Copy to Clipboard</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Clear all drafts */}
              {draftCount > 0 && (
                <View style={[s.section, { marginBottom: 40 }]}>
                  <TouchableOpacity style={s.btnDanger} onPress={handleClearAll}>
                    <Text style={s.btnDangerText}>Clear All Drafts ({draftCount})</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

// ── Small helper component ────────────────────────────────────────────────────

function DetailRow({
  label, value, mono, valueColor,
}: { label: string; value: string; mono?: boolean; valueColor?: string }): React.ReactElement {
  return (
    <View style={s.detailRow}>
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={[s.detailValue, mono && s.mono, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root:              { flex: 1, backgroundColor: T.bg },
  loadingContainer:  { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: T.bg },
  loadingText:       { color: T.muted, marginTop: 12, fontSize: 14 },

  header:     { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border, backgroundColor: T.bgAlt },
  headerTitle: { color: T.white, fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  headerSub:   { color: T.muted, fontSize: 12, marginTop: 2 },
  devBadge:    { color: T.red, fontSize: 13, fontWeight: '600' },

  body:      { flex: 1, flexDirection: 'row' },
  leftPane:  { width: 280, borderRightWidth: 1, borderRightColor: T.border, backgroundColor: T.bgAlt },
  rightPane: { flex: 1, padding: 16 },

  searchInput: { backgroundColor: T.cardGlass, color: T.white, borderWidth: 1, borderColor: T.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, margin: 10, fontSize: 13 },

  filterRow:     { paddingHorizontal: 10, marginBottom: 4, flexShrink: 0 },
  filterChip:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: T.border, marginRight: 6, backgroundColor: T.card },
  filterChipActive: { borderColor: T.gold, backgroundColor: T.goldFaint },
  filterChipText:      { color: T.muted, fontSize: 11 },
  filterChipTextActive: { color: T.gold },

  listCount:    { color: T.muted, fontSize: 11, paddingHorizontal: 12, paddingVertical: 4 },
  questionList: { flex: 1 },

  questionRow:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: T.border + '55' },
  questionRowSelected: { backgroundColor: T.goldFaint },
  questionRowLeft:     { flex: 1, minWidth: 0 },
  questionRowRight:    { alignItems: 'flex-end', gap: 4 },
  questionId:          { color: T.silver, fontSize: 11, fontFamily: 'monospace' },
  questionMeta:        { color: T.muted, fontSize: 10, marginTop: 1 },
  accBadge:            { fontSize: 11, fontWeight: '700' },
  noData:              { color: T.faint, fontSize: 11 },
  statusBadge:         { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  statusBadgeText:     { fontSize: 10, fontWeight: '700' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText:  { color: T.muted, fontSize: 14 },

  section:      { marginBottom: 20, backgroundColor: T.card, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: T.border },
  sectionTitle: { color: T.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },

  detailRow:   { flexDirection: 'row', marginBottom: 6 },
  detailLabel: { color: T.muted, fontSize: 12, width: 110 },
  detailValue: { color: T.silver, fontSize: 12, flex: 1 },
  mono:        { fontFamily: 'monospace', fontSize: 11 },

  promptText:      { color: T.white, fontSize: 13, lineHeight: 19 },
  explanationText: { color: T.muted, fontSize: 12, lineHeight: 17, marginTop: 8, fontStyle: 'italic' },

  noDataText:  { color: T.muted, fontSize: 12, fontStyle: 'italic' },
  draftFlag:   { color: T.gold, fontSize: 11, marginTop: 6 },

  fieldLabel: { color: T.muted, fontSize: 11, fontWeight: '600', marginBottom: 4, marginTop: 10 },
  fieldHint:  { color: T.faint, fontSize: 10, marginBottom: 4, lineHeight: 14 },

  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  statusBtn: {
    flex: 1, paddingVertical: 6, borderRadius: 8, borderWidth: 1,
    borderColor: T.border, alignItems: 'center', backgroundColor: T.cardGlass,
  },
  statusBtnText: { color: T.muted, fontSize: 12 },

  textArea: {
    backgroundColor: T.cardGlass, color: T.white, borderWidth: 1, borderColor: T.border,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, minHeight: 56,
    textAlignVertical: 'top',
  },
  codeArea: {
    backgroundColor: T.bgDeep, color: T.silver, borderWidth: 1, borderColor: T.border,
    borderRadius: 8, padding: 10, fontSize: 11, fontFamily: 'monospace', minHeight: 100,
    textAlignVertical: 'top',
  },
  codeAreaError: { borderColor: T.red },
  errorText: { color: T.red, fontSize: 12, marginTop: 4 },

  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  btnPrimary:      { flex: 1, minWidth: 100, backgroundColor: T.gold, borderRadius: 8, paddingVertical: 9, alignItems: 'center' },
  btnPrimaryText:  { color: T.bg, fontWeight: '700', fontSize: 13 },
  btnSecondary:    { flex: 1, minWidth: 80, backgroundColor: T.cardGlass, borderRadius: 8, paddingVertical: 9, alignItems: 'center', borderWidth: 1, borderColor: T.border },
  btnSecondaryText: { color: T.silver, fontSize: 13 },
  btnDanger:       { borderRadius: 8, paddingVertical: 9, alignItems: 'center', borderWidth: 1, borderColor: T.red + '66', backgroundColor: T.red + '18' },
  btnDangerText:   { color: T.red, fontSize: 13 },

  previewBox:   { marginTop: 10, backgroundColor: T.bgDeep, borderRadius: 8, padding: 10 },
  previewTitle: { color: T.muted, fontSize: 11, marginBottom: 6 },
  previewRow:   { color: T.silver, fontFamily: 'monospace', fontSize: 11, marginBottom: 2 },

  exportBox:  { marginTop: 10, backgroundColor: T.bgDeep, borderRadius: 8, padding: 10, maxHeight: 200 },
  exportCode: { color: T.silver, fontFamily: 'monospace', fontSize: 10, lineHeight: 15 },
});
