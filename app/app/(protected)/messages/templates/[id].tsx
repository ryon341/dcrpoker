import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Switch,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { messageTemplatesApi, MessageTemplate } from '../../../../src/api/messageTemplates';

type Channel = 'sms' | 'email';

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [channel, setChannel] = useState<Channel>('sms');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await messageTemplatesApi.get(id!);
      const t: MessageTemplate = res.data.template;
      setName(t.name);
      setChannel(t.channel);
      setSubject(t.subject || '');
      setBody(t.body);
      setIsActive(t.is_active === 1);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load template');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!name.trim()) { setError('Template name is required.'); return; }
    if (!body.trim()) { setError('Message body is required.'); return; }
    setError('');
    setSaving(true);
    try {
      await messageTemplatesApi.update(id!, {
        name: name.trim(),
        channel,
        subject: channel === 'email' ? subject.trim() || null : null,
        body: body.trim(),
        is_active: isActive,
      });
      router.back();
    } catch (e: any) {
      setError(e.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e94560" size="large" />
      </View>
    );
  }

  if (error && !name) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Edit Template</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholderTextColor="#555"
        placeholder="Template name"
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
            value={subject}
            onChangeText={setSubject}
            placeholderTextColor="#555"
            placeholder="Email subject"
          />
        </>
      )}

      <Text style={styles.label}>Message Body *</Text>
      <TextInput
        style={[styles.input, styles.bodyInput]}
        value={body}
        onChangeText={setBody}
        placeholderTextColor="#555"
        placeholder="Message body..."
        multiline
      />

      <View style={styles.activeRow}>
        <Text style={styles.activeLabel}>Active</Text>
        <Switch
          value={isActive}
          onValueChange={setIsActive}
          trackColor={{ false: '#333', true: '#e94560' }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={save}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>Save Changes</Text>
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
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
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
  activeRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#16213e', borderRadius: 8, padding: 14,
    borderWidth: 1, borderColor: '#2a2a4a', marginTop: 20,
  },
  activeLabel: { color: '#fff', fontSize: 15 },
  saveBtn: { backgroundColor: '#e94560', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 24 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 10 },
  cancelBtnText: { color: '#666', fontSize: 14 },
});
