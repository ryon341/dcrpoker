import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { messageTemplatesApi } from '../../../../src/api/messageTemplates';

type Channel = 'sms' | 'email';

export default function CreateTemplateScreen() {
  const params = useLocalSearchParams<{ channel?: string; subject?: string; body?: string }>();
  const router = useRouter();

  const [name, setName] = useState('');
  const [channel, setChannel] = useState<Channel>((params.channel as Channel) || 'sms');
  const [subject, setSubject] = useState(params.subject || '');
  const [body, setBody] = useState(params.body || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    if (!name.trim()) { setError('Template name is required.'); return; }
    if (!body.trim()) { setError('Message body is required.'); return; }
    setError('');
    setSaving(true);
    try {
      await messageTemplatesApi.create({
        name: name.trim(),
        channel,
        subject: channel === 'email' ? subject.trim() || undefined : undefined,
        body: body.trim(),
      });
      router.back();
    } catch (e: any) {
      setError(e.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>New Template</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Friday Game Invite"
        placeholderTextColor="#555"
        value={name}
        onChangeText={setName}
      />

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

      {channel === 'email' && (
        <>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. DCR Poker — You're Invited"
            placeholderTextColor="#555"
            value={subject}
            onChangeText={setSubject}
          />
        </>
      )}

      <Text style={styles.label}>Message Body *</Text>
      <TextInput
        style={[styles.input, styles.bodyInput]}
        placeholder="Type your message here..."
        placeholderTextColor="#555"
        value={body}
        onChangeText={setBody}
        multiline
      />

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={save}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>Save Template</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 20, paddingTop: 48, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  errorText: { color: '#ff6b6b', fontSize: 14, marginBottom: 12 },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: '#16213e', borderRadius: 8, padding: 14,
    color: '#fff', fontSize: 14, borderWidth: 1, borderColor: '#2a2a4a',
  },
  bodyInput: { minHeight: 120, textAlignVertical: 'top' },
  segmented: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#2a2a4a' },
  seg: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#16213e' },
  segActive: { backgroundColor: '#e94560' },
  segText: { color: '#aaa', fontWeight: '600', fontSize: 14 },
  segActiveText: { color: '#fff' },
  saveBtn: { backgroundColor: '#e94560', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 30 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 10 },
  cancelBtnText: { color: '#666', fontSize: 14 },
});
