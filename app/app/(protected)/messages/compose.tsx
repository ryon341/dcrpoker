import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Modal, FlatList, ActivityIndicator, Alert,
  Linking, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { gamesApi, Game, GameInvite } from '../../../src/api/games';
import { playersApi, HostPlayer } from '../../../src/api/players';
import { messageTemplatesApi, MessageTemplate } from '../../../src/api/messageTemplates';
import {
  Recipient,
  splitRecipientsIntoBatches,
  extractPhones,
  extractEmails,
  filterBySms,
  filterByEmail,
  buildSmsLink,
  buildMailtoLink,
} from '../../../src/utils/messaging';
import { copyToClipboard } from '../../../src/utils/copy';
import { smsApi, SmsSendResult } from '../../../src/api/sms';
import { billingApi } from '../../../src/api/billing';

type Source = 'game' | 'players';
type Channel = 'sms' | 'email';

function recipientFromInvite(inv: GameInvite): Recipient {
  return {
    id: inv.player_user_id,
    display_name: inv.player_display_name,
    phone: inv.player_phone,
    email: inv.player_email,
  };
}

function recipientFromPlayer(p: HostPlayer): Recipient {
  return {
    id: p.player_user_id,
    display_name: p.display_name,
    phone: p.phone,
    email: p.email,
  };
}

export default function ComposeScreen() {
  const params = useLocalSearchParams<{ source?: string; gameId?: string; gameTitle?: string }>();
  const router = useRouter();

  const initialSource: Source = params.source === 'players' ? 'players' : 'game';

  const [source, setSource] = useState<Source>(initialSource);
  const [channel, setChannel] = useState<Channel>('sms');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState<string>('');

  const [canSendSms, setCanSendSms] = useState(false);
  const isLevel2 = canSendSms;
  const [sendingBatchIdx, setSendingBatchIdx] = useState<number | null>(null);
  const [batchResults, setBatchResults] = useState<Record<number, SmsSendResult>>({});

  // Game mode state
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>(params.gameId || '');
  const [gameInvites, setGameInvites] = useState<GameInvite[]>([]);
  const [gameTitle, setGameTitle] = useState(params.gameTitle || '');
  const [gamePickerVisible, setGamePickerVisible] = useState(false);
  const [loadingGames, setLoadingGames] = useState(false);

  // Players mode state
  const [allPlayers, setAllPlayers] = useState<HostPlayer[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<number>>(new Set());
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [playerPickerVisible, setPlayerPickerVisible] = useState(false);

  // Templates
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [templatePickerVisible, setTemplatePickerVisible] = useState(false);

  // Load games list for picker
  const loadGames = useCallback(async () => {
    setLoadingGames(true);
    try {
      const res = await gamesApi.list({ is_active: '1' });
      setGames(res.data.games);
    } catch { /* ignore */ }
    setLoadingGames(false);
  }, []);

  // Load invites for selected game
  const loadGameInvites = useCallback(async (gameId: string) => {
    try {
      const res = await gamesApi.listInvites(gameId);
      setGameInvites(res.data.invites);
    } catch { /* ignore */ }
  }, []);

  // Load players roster
  const loadPlayers = useCallback(async () => {
    setLoadingPlayers(true);
    try {
      const res = await playersApi.listMyPlayers();
      setAllPlayers(res.data.players);
    } catch { /* ignore */ }
    setLoadingPlayers(false);
  }, []);

  // Load templates
  const loadTemplates = useCallback(async () => {
    try {
      const res = await messageTemplatesApi.list();
      setTemplates(res.data.templates.filter((t) => t.is_active));
    } catch { /* ignore */ }
  }, []);

  // Load billing plan to know if DCR-relay send is available
  useEffect(() => {
    billingApi.getStatus()
      .then(s => setCanSendSms(s.features.canSendSms))
      .catch(() => setCanSendSms(false));
  }, []);

  useEffect(() => {
    loadGames();
    loadPlayers();
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedGameId) loadGameInvites(selectedGameId);
  }, [selectedGameId]);

  // Compute raw recipients from source
  const rawRecipients: Recipient[] =
    source === 'game'
      ? gameInvites.map(recipientFromInvite)
      : allPlayers
          .filter((p) => selectedPlayerIds.has(p.player_user_id))
          .map(recipientFromPlayer);

  // Filter by channel
  const filteredRecipients =
    channel === 'sms' ? filterBySms(rawRecipients) : filterByEmail(rawRecipients);

  const batches = splitRecipientsIntoBatches(filteredRecipients, 10);

  // Clipboard helper with feedback
  async function doCopy(text: string, label: string) {
    try {
      await copyToClipboard(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      Alert.alert('Copy failed', 'Could not copy to clipboard.');
    }
  }

  // Open SMS/email link
  async function openLink(url: string) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Cannot open app',
          'Your device or browser may not support this action. Use the copy buttons instead.'
        );
      }
    } catch {
      Alert.alert('Error', 'Failed to open the app. Use copy buttons instead.');
    }
  }

  function applyTemplate(t: MessageTemplate) {
    setChannel(t.channel);
    setSubject(t.subject || '');
    setBody(t.body);
    setTemplatePickerVisible(false);
  }

  async function sendBatchViaDcr(batchIndex: number, phones: string[]) {
    if (!body.trim() || phones.length === 0) return;
    setSendingBatchIdx(batchIndex);
    try {
      const res = await smsApi.send(phones, body.trim());
      setBatchResults((prev) => ({ ...prev, [batchIndex]: res.data }));
      if (res.data.failed_count > 0) {
        Alert.alert(
          'Partial Send',
          `${res.data.sent_count} sent, ${res.data.failed_count} failed.\nCheck recipient phone numbers.`
        );
      }
    } catch (e: any) {
      Alert.alert('Send Failed', e.message || 'Could not send messages.');
    } finally {
      setSendingBatchIdx(null);
    }
  }

  const noRecipientsMsg =
    source === 'game' && !selectedGameId
      ? 'Select a game to see recipients.'
      : rawRecipients.length === 0
      ? source === 'game'
        ? 'No players invited to this game yet.'
        : 'Select players from your roster.'
      : filteredRecipients.length === 0
      ? `No recipients have a valid ${channel === 'sms' ? 'phone number' : 'email address'}.`
      : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Compose Message</Text>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          {isLevel2
            ? 'Level 2: Messages will be sent from DCR Poker via Twilio.\nRecipients split into batches of 10.'
            : 'Level 1 manual messaging — messages are sent via your device\'s apps.\nRecipients split into batches of 10.'}
        </Text>
      </View>

      {/* Source picker */}
      <View style={styles.row}>
        <Text style={styles.label}>Source</Text>
        <View style={styles.segmented}>
          <TouchableOpacity
            style={[styles.seg, source === 'game' && styles.segActive]}
            onPress={() => setSource('game')}
          >
            <Text style={[styles.segText, source === 'game' && styles.segActiveText]}>Game</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.seg, source === 'players' && styles.segActive]}
            onPress={() => setSource('players')}
          >
            <Text style={[styles.segText, source === 'players' && styles.segActiveText]}>My Players</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Game selector */}
      {source === 'game' && (
        <TouchableOpacity style={styles.selectBtn} onPress={() => setGamePickerVisible(true)}>
          <Text style={styles.selectBtnText}>
            {gameTitle || 'Select a game...'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Player selector */}
      {source === 'players' && (
        <TouchableOpacity style={styles.selectBtn} onPress={() => setPlayerPickerVisible(true)}>
          <Text style={styles.selectBtnText}>
            {selectedPlayerIds.size > 0
              ? `${selectedPlayerIds.size} player(s) selected`
              : 'Select players...'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Channel picker */}
      <View style={styles.row}>
        <Text style={styles.label}>Channel</Text>
        <View style={styles.segmented}>
          <TouchableOpacity
            style={[styles.seg, channel === 'sms' && styles.segActive]}
            onPress={() => setChannel('sms')}
          >
            <Text style={[styles.segText, channel === 'sms' && styles.segActiveText]}>SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.seg, channel === 'email' && styles.segActive]}
            onPress={() => setChannel('email')}
          >
            <Text style={[styles.segText, channel === 'email' && styles.segActiveText]}>Email</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Template picker trigger */}
      <TouchableOpacity
        style={styles.templateBtn}
        onPress={() => setTemplatePickerVisible(true)}
      >
        <Text style={styles.templateBtnText}>📋 Use a Template</Text>
      </TouchableOpacity>

      {/* Subject (email only) */}
      {channel === 'email' && (
        <TextInput
          style={styles.input}
          placeholder="Subject"
          placeholderTextColor="#555"
          value={subject}
          onChangeText={setSubject}
        />
      )}

      {/* Body */}
      <TextInput
        style={[styles.input, styles.bodyInput]}
        placeholder="Message body..."
        placeholderTextColor="#555"
        value={body}
        onChangeText={setBody}
        multiline
      />

      {/* Save as template */}
      {body.trim().length > 0 && (
        <TouchableOpacity
          style={styles.saveTemplateBtn}
          onPress={() =>
            router.push(
              `/(protected)/messages/templates/create?channel=${channel}&subject=${encodeURIComponent(
                subject
              )}&body=${encodeURIComponent(body)}`
            )
          }
        >
          <Text style={styles.saveTemplateBtnText}>💾 Save as Template</Text>
        </TouchableOpacity>
      )}

      {/* Recipient summary */}
      <View style={styles.recipientSummary}>
        <Text style={styles.recipientCount}>
          {filteredRecipients.length} valid recipient(s) → {batches.length} batch(es)
        </Text>
        {rawRecipients.length > filteredRecipients.length && (
          <Text style={styles.recipientFiltered}>
            {rawRecipients.length - filteredRecipients.length} recipient(s) filtered out (missing{' '}
            {channel === 'sms' ? 'phone' : 'email'}).
          </Text>
        )}
      </View>

      {/* No recipients message */}
      {noRecipientsMsg ? (
        <Text style={styles.emptyText}>{noRecipientsMsg}</Text>
      ) : (
        batches.map((batch, batchIndex) => (
          <BatchCard
            key={batchIndex}
            batchIndex={batchIndex}
            batch={batch}
            channel={channel}
            subject={subject}
            body={body}
            copied={copied}
            isLevel2={isLevel2}
            sendingDcr={sendingBatchIdx === batchIndex}
            sendResult={batchResults[batchIndex] ?? null}
            onCopy={doCopy}
            onOpenLink={openLink}
            onSendDcr={(phones) => sendBatchViaDcr(batchIndex, phones)}
          />
        ))
      )}

      {/* Game picker modal */}
      <Modal
        visible={gamePickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGamePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select a Game</Text>
            {loadingGames ? (
              <ActivityIndicator color="#e94560" />
            ) : games.length === 0 ? (
              <Text style={styles.emptyText}>No active games found.</Text>
            ) : (
              <FlatList
                data={games}
                keyExtractor={(g) => String(g.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickItem}
                    onPress={() => {
                      setSelectedGameId(String(item.id));
                      setGameTitle(item.title);
                      setGamePickerVisible(false);
                    }}
                  >
                    <Text style={styles.pickItemText}>{item.title}</Text>
                    {item.stakes_label ? (
                      <Text style={styles.pickItemSub}>{item.stakes_label}</Text>
                    ) : null}
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={styles.modalClose} onPress={() => setGamePickerVisible(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Players picker modal */}
      <Modal
        visible={playerPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPlayerPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Players</Text>
            {loadingPlayers ? (
              <ActivityIndicator color="#e94560" />
            ) : allPlayers.length === 0 ? (
              <Text style={styles.emptyText}>No players on your roster yet.</Text>
            ) : (
              <FlatList
                data={allPlayers}
                keyExtractor={(p) => String(p.player_user_id)}
                renderItem={({ item }) => {
                  const selected = selectedPlayerIds.has(item.player_user_id);
                  return (
                    <TouchableOpacity
                      style={[styles.pickItem, selected && styles.pickItemSelected]}
                      onPress={() => {
                        const next = new Set(selectedPlayerIds);
                        if (next.has(item.player_user_id)) {
                          next.delete(item.player_user_id);
                        } else {
                          next.add(item.player_user_id);
                        }
                        setSelectedPlayerIds(next);
                      }}
                    >
                      <Text style={styles.pickItemText}>
                        {selected ? '✓ ' : ''}
                        {item.display_name}
                      </Text>
                      {item.phone ? <Text style={styles.pickItemSub}>{item.phone}</Text> : null}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setPlayerPickerVisible(false)}
            >
              <Text style={styles.primaryBtnText}>Done ({selectedPlayerIds.size} selected)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Template picker modal */}
      <Modal
        visible={templatePickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTemplatePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Choose a Template</Text>
            {templates.length === 0 ? (
              <Text style={styles.emptyText}>No templates saved yet.</Text>
            ) : (
              <FlatList
                data={templates}
                keyExtractor={(t) => String(t.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickItem}
                    onPress={() => applyTemplate(item)}
                  >
                    <Text style={styles.pickItemText}>{item.name}</Text>
                    <Text style={styles.pickItemSub}>
                      {item.channel.toUpperCase()} — {item.body.substring(0, 60)}
                      {item.body.length > 60 ? '…' : ''}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={styles.modalClose} onPress={() => setTemplatePickerVisible(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {copied ? (
        <View style={styles.copiedBanner}>
          <Text style={styles.copiedText}>✓ Copied: {copied}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

interface BatchCardProps {
  batchIndex: number;
  batch: Recipient[];
  channel: Channel;
  subject: string;
  body: string;
  copied: string;
  isLevel2: boolean;
  sendingDcr: boolean;
  sendResult: SmsSendResult | null;
  onCopy: (text: string, label: string) => Promise<void>;
  onOpenLink: (url: string) => Promise<void>;
  onSendDcr: (phones: string[]) => Promise<void>;
}

function BatchCard({ batchIndex, batch, channel, subject, body, copied, isLevel2, sendingDcr, sendResult, onCopy, onOpenLink, onSendDcr }: BatchCardProps) {
  const phones = extractPhones(batch);
  const emails = extractEmails(batch);

  const hasBody = body.trim().length > 0;

  if (channel === 'sms') {
    const smsLink = buildSmsLink(phones, body);
    return (
      <View style={styles.batchCard}>
        <Text style={styles.batchTitle}>Batch {batchIndex + 1} — {batch.length} recipient(s)</Text>
        {batch.map((r) => (
          <Text key={r.id} style={styles.batchRecipient}>
            {r.display_name} {r.phone ? `· ${r.phone}` : ''}
          </Text>
        ))}
        <View style={styles.batchActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onCopy(phones.join(', '), `Numbers (batch ${batchIndex + 1})`)}
          >
            <Text style={styles.actionBtnText}>Copy Numbers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, !hasBody && styles.actionBtnDisabled]}
            disabled={!hasBody}
            onPress={() => onCopy(body, `Message (batch ${batchIndex + 1})`)}
          >
            <Text style={styles.actionBtnText}>Copy Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnPrimary, !hasBody && styles.actionBtnDisabled]}
            disabled={!hasBody}
            onPress={() => onOpenLink(smsLink)}
          >
            <Text style={[styles.actionBtnText, styles.actionBtnPrimaryText]}>Open SMS App</Text>
          </TouchableOpacity>
          {isLevel2 && hasBody && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnLevel2, (!hasBody || sendingDcr) && styles.actionBtnDisabled]}
              disabled={!hasBody || sendingDcr}
              onPress={() => onSendDcr(phones)}
            >
              {sendingDcr ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[styles.actionBtnText, styles.actionBtnLevel2Text]}>🚀 Send via DCR Poker</Text>
              )}
            </TouchableOpacity>
          )}
          {sendResult && (
            <View style={styles.sendResultRow}>
              <Text style={styles.sendResultText}>
                ✓ {sendResult.sent_count} sent
                {sendResult.failed_count > 0 ? `  ·  ${sendResult.failed_count} failed` : ''}
                {'  ·  '}Usage {sendResult.usage.current} / {sendResult.usage.limit}
                {sendResult.usage.overage ? '  ⚠️ over limit' : ''}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  const mailtoLink = buildMailtoLink(emails, subject, body);
  return (
    <View style={styles.batchCard}>
      <Text style={styles.batchTitle}>Batch {batchIndex + 1} — {batch.length} recipient(s)</Text>
      {batch.map((r) => (
        <Text key={r.id} style={styles.batchRecipient}>
          {r.display_name} {r.email ? `· ${r.email}` : ''}
        </Text>
      ))}
      <View style={styles.batchActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onCopy(emails.join(', '), `Emails (batch ${batchIndex + 1})`)}
        >
          <Text style={styles.actionBtnText}>Copy Emails</Text>
        </TouchableOpacity>
        {subject.trim().length > 0 && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onCopy(subject, `Subject (batch ${batchIndex + 1})`)}
          >
            <Text style={styles.actionBtnText}>Copy Subject</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionBtn, !hasBody && styles.actionBtnDisabled]}
          disabled={!hasBody}
          onPress={() => onCopy(body, `Message (batch ${batchIndex + 1})`)}
        >
          <Text style={styles.actionBtnText}>Copy Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnPrimary, !hasBody && styles.actionBtnDisabled]}
          disabled={!hasBody}
          onPress={() => onOpenLink(mailtoLink)}
        >
          <Text style={[styles.actionBtnText, styles.actionBtnPrimaryText]}>Open Email App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 20, paddingTop: 40, paddingBottom: 60 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  notice: {
    backgroundColor: '#0f3460', borderRadius: 8, padding: 12, marginBottom: 20,
    borderLeftWidth: 4, borderLeftColor: '#e94560',
  },
  noticeText: { color: '#ccc', fontSize: 12, lineHeight: 18 },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 16 },
  row: { marginBottom: 4 },
  segmented: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#2a2a4a' },
  seg: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#16213e' },
  segActive: { backgroundColor: '#e94560' },
  segText: { color: '#aaa', fontWeight: '600', fontSize: 14 },
  segActiveText: { color: '#fff' },
  selectBtn: {
    backgroundColor: '#16213e', borderRadius: 8, padding: 14,
    borderWidth: 1, borderColor: '#2a2a4a', marginTop: 12,
  },
  selectBtnText: { color: '#fff', fontSize: 14 },
  templateBtn: {
    borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#2a2a4a',
    alignItems: 'center', marginTop: 16,
  },
  templateBtnText: { color: '#aaa', fontSize: 13 },
  input: {
    backgroundColor: '#16213e', borderRadius: 8, padding: 14,
    color: '#fff', fontSize: 14, borderWidth: 1, borderColor: '#2a2a4a', marginTop: 12,
  },
  bodyInput: { minHeight: 100, textAlignVertical: 'top' },
  saveTemplateBtn: {
    borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#0f3460',
    alignItems: 'center', marginTop: 10,
  },
  saveTemplateBtnText: { color: '#7ab', fontSize: 13 },
  recipientSummary: {
    backgroundColor: '#16213e', borderRadius: 8, padding: 12,
    marginTop: 20, marginBottom: 8, borderWidth: 1, borderColor: '#2a2a4a',
  },
  recipientCount: { color: '#e94560', fontWeight: '600', fontSize: 14 },
  recipientFiltered: { color: '#888', fontSize: 12, marginTop: 4 },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center', marginVertical: 20 },
  batchCard: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#2a2a4a',
  },
  batchTitle: { color: '#e94560', fontWeight: 'bold', fontSize: 13, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  batchRecipient: { color: '#ccc', fontSize: 13, marginBottom: 4 },
  batchActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  actionBtn: {
    borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12,
    borderWidth: 1, borderColor: '#2a2a4a', backgroundColor: '#0f2040',
  },
  actionBtnPrimary: { backgroundColor: '#0f3460', borderColor: '#1a5080' },
  actionBtnDisabled: { opacity: 0.4 },
  actionBtnText: { color: '#ccc', fontSize: 12, fontWeight: '600' },
  actionBtnPrimaryText: { color: '#fff' },
  actionBtnLevel2: { backgroundColor: '#1a5a2a', borderColor: '#2a8a3a' },
  actionBtnLevel2Text: { color: '#7eff9e', fontWeight: 'bold' },
  sendResultRow: {
    width: '100%', marginTop: 8, backgroundColor: '#0a2a14',
    borderRadius: 6, padding: 8, borderWidth: 1, borderColor: '#1a5a2a',
  },
  sendResultText: { color: '#7eff9e', fontSize: 12 },
  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#16213e', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, maxHeight: '75%',
  },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  modalClose: {
    backgroundColor: '#2a2a4a', borderRadius: 8, padding: 14,
    alignItems: 'center', marginTop: 12,
  },
  modalCloseText: { color: '#aaa', fontWeight: '600' },
  pickItem: {
    padding: 14, borderBottomWidth: 1, borderBottomColor: '#2a2a4a',
  },
  pickItemSelected: { backgroundColor: '#0f3460' },
  pickItemText: { color: '#fff', fontSize: 15 },
  pickItemSub: { color: '#888', fontSize: 12, marginTop: 2 },
  primaryBtn: {
    backgroundColor: '#e94560', borderRadius: 8, padding: 14,
    alignItems: 'center', marginTop: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  copiedBanner: {
    position: 'absolute', bottom: 80, left: 20, right: 20,
    backgroundColor: '#1a6b3a', borderRadius: 8, padding: 12, alignItems: 'center',
  },
  copiedText: { color: '#fff', fontWeight: 'bold' },
});
