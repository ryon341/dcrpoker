import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { hostContactsApi, BulkContactInput } from '../../../src/api/hostContacts';

const PLACEHOLDER = `John Smith, +15550001111
Jane Doe, jane@example.com
+15552223333
Bob Jones, +15554445555, bob@example.com`;

function parseLines(raw: string): BulkContactInput[] {
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(',').map(p => p.trim());
      const result: BulkContactInput = { display_name: '', source: 'import' };

      for (const part of parts) {
        const isPhone = /^[+\d\s\-().]{7,}$/.test(part);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(part);
        if (isPhone && !result.phone) {
          result.phone = part.replace(/[\s\-().]/g, '');
        } else if (isEmail && !result.email) {
          result.email = part;
        } else if (!isPhone && !isEmail && !result.display_name) {
          result.display_name = part;
        }
      }

      // If only phone was found, use it as a display_name fallback so we meet the required field
      if (!result.display_name && result.phone) {
        result.display_name = result.phone;
      }

      return result;
    })
    .filter(r => r.display_name || r.phone || r.email);
}

export default function ImportPlayersScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<BulkContactInput[] | null>(null);
  const [result, setResult] = useState<{ inserted: number; duplicates: number; invalid: number } | null>(null);

  function handlePreview() {
    const parsed = parseLines(text);
    if (parsed.length === 0) {
      Alert.alert('Nothing to import', 'No valid contacts could be parsed. See the format tips below.');
      return;
    }
    setPreview(parsed);
    setResult(null);
  }

  async function handleImport() {
    if (!preview || preview.length === 0) return;
    setLoading(true);
    try {
      const res = await hostContactsApi.bulkCreate(preview);
      const d = res.data;
      setResult({ inserted: d.inserted_count, duplicates: d.duplicate_count, invalid: d.invalid_count });
      setPreview(null);
      setText('');
    } catch (e: any) {
      Alert.alert('Import failed', e.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.pageTitle}>📥 Import Players</Text>
      <Text style={s.pageSubtitle}>Paste a list of contacts below — one per line. Each line can contain a name, phone, and/or email separated by commas.</Text>

      {/* Format tips */}
      <View style={s.tipCard}>
        <Text style={s.tipTitle}>Format examples:</Text>
        <Text style={s.tipLine}>John Smith, +15550001111</Text>
        <Text style={s.tipLine}>Jane Doe, jane@example.com</Text>
        <Text style={s.tipLine}>+15552223333</Text>
        <Text style={s.tipLine}>Bob Jones, +15554445555, bob@example.com</Text>
      </View>

      {/* Input */}
      {!result && (
        <>
          <TextInput
            style={s.textArea}
            multiline
            value={text}
            onChangeText={t => { setText(t); setPreview(null); }}
            placeholder={PLACEHOLDER}
            placeholderTextColor="#444"
            textAlignVertical="top"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[s.btn, !text.trim() ? s.btnDisabled : null]}
            onPress={handlePreview}
            disabled={!text.trim()}
          >
            <Text style={s.btnText}>Preview ({parseLines(text).length} contacts)</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Preview */}
      {preview && preview.length > 0 && (
        <View>
          <Text style={s.sectionTitle}>Preview — {preview.length} contacts</Text>
          {preview.slice(0, 20).map((c, i) => (
            <View key={i} style={s.previewRow}>
              <Text style={s.previewName}>{c.display_name || '(unnamed)'}</Text>
              <Text style={s.previewMeta}>{[c.phone, c.email].filter(Boolean).join(' · ')}</Text>
            </View>
          ))}
          {preview.length > 20 && <Text style={s.moreText}>…and {preview.length - 20} more</Text>}

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity style={[s.btn, { flex: 1, backgroundColor: '#333' }]} onPress={() => setPreview(null)}>
              <Text style={s.btnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btn, { flex: 2 }]} onPress={handleImport} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Import {preview.length} Contacts</Text>}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Result */}
      {result && (
        <View style={s.resultCard}>
          <Text style={s.resultTitle}>✅ Import Complete</Text>
          <Text style={s.resultLine}>✓ {result.inserted} contacts added</Text>
          {result.duplicates > 0 ? <Text style={s.resultLine}>⚠️ {result.duplicates} duplicates skipped</Text> : null}
          {result.invalid > 0 ? <Text style={s.resultLine}>✗ {result.invalid} rows invalid</Text> : null}

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <TouchableOpacity style={[s.btn, { flex: 1, backgroundColor: '#333' }]} onPress={() => setResult(null)}>
              <Text style={s.btnText}>Import More</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btn, { flex: 1 }]} onPress={() => router.push('/(protected)/contacts')}>
              <Text style={s.btnText}>View Contacts</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content:   { padding: 16, paddingBottom: 60 },

  pageTitle:    { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  pageSubtitle: { color: '#888', fontSize: 13, marginBottom: 16, lineHeight: 18 },

  tipCard:  { backgroundColor: '#16213e', borderRadius: 8, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#2a2a4a' },
  tipTitle: { color: '#aaa', fontSize: 12, fontWeight: 'bold', marginBottom: 6 },
  tipLine:  { color: '#666', fontSize: 12, fontFamily: 'monospace', marginBottom: 2 },

  textArea: { backgroundColor: '#16213e', borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, color: '#fff', fontSize: 13, minHeight: 160, marginBottom: 14, fontFamily: 'monospace' },

  btn:         { backgroundColor: '#e94560', borderRadius: 8, paddingVertical: 13, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnText:     { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  sectionTitle: { color: '#aaa', fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  previewRow:   { backgroundColor: '#16213e', borderRadius: 6, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: '#2a2a4a' },
  previewName:  { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  previewMeta:  { color: '#888', fontSize: 12, marginTop: 2 },
  moreText:     { color: '#666', fontSize: 12, textAlign: 'center', marginTop: 4 },

  resultCard:  { backgroundColor: '#16213e', borderRadius: 10, padding: 20, borderWidth: 1, borderColor: '#2a2a4a' },
  resultTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  resultLine:  { color: '#aaa', fontSize: 14, marginBottom: 4 },
});
