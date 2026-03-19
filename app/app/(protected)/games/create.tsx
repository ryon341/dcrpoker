import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { gamesApi, CreateGameBody } from '../../../src/api/games';

const STATUS_OPTIONS = ['draft', 'published'];
const GAME_TYPES = ['cash', 'tournament', 'sit-n-go', 'other'];

export default function CreateGameScreen() {
  const router = useRouter();
  const [form, setForm] = useState<CreateGameBody>({
    title: '',
    description: '',
    location_name: '',
    address_line_1: '',
    city: '',
    state: '',
    postal_code: '',
    game_type: 'cash',
    stakes_label: '',
    starts_at: '',
    ends_at: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(key: keyof CreateGameBody) {
    return (val: string) => setForm(f => ({ ...f, [key]: val }));
  }

  /**
   * Try to coerce a user-entered date/time string into MySQL-compatible format.
   * Accepts: ISO strings, "YYYY-MM-DD", "YYYY-MM-DD HH:MM", "YYYY-MM-DDTHH:MM:SS".
   * Returns null if the value cannot be parsed.
   */
  function normalizeDateTime(val: string): string | null {
    const trimmed = val.trim();
    if (!trimmed) return null;
    // Already looks like MySQL datetime
    if (/^\d{4}-\d{2}-\d{2}(T| )\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
      return trimmed.replace('T', ' ');
    }
    // Try native Date parse as a fallback
    const d = new Date(trimmed);
    if (isNaN(d.getTime())) return null;
    // Format as YYYY-MM-DD HH:MM:SS
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  async function handleCreate() {
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    // Validate and normalize datetime fields
    if (form.starts_at && form.starts_at.trim()) {
      const normalized = normalizeDateTime(form.starts_at);
      if (!normalized) {
        setError('Starts At: use format YYYY-MM-DD HH:MM  e.g. 2026-03-25 19:00');
        return;
      }
      form.starts_at = normalized;
    }
    if (form.ends_at && form.ends_at.trim()) {
      const normalized = normalizeDateTime(form.ends_at);
      if (!normalized) {
        setError('Ends At: use format YYYY-MM-DD HH:MM  e.g. 2026-03-26 01:00');
        return;
      }
      form.ends_at = normalized;
    }

    setError('');
    setLoading(true);
    try {
      const body: CreateGameBody = { ...form };
      // Strip empty strings to avoid sending blank values
      Object.keys(body).forEach(k => {
        const key = k as keyof CreateGameBody;
        if (body[key] === '') (body as any)[key] = undefined;
      });
      const res = await gamesApi.create(body);
      router.replace(`/(protected)/games/${res.data.game.id}`);
    } catch (e: any) {
      setError(e.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Field label="Title *" value={form.title} onChangeText={set('title')} placeholder="Friday Night 1/2 NL" />
        <Field label="Description" value={form.description!} onChangeText={set('description')} placeholder="Details about the game" multiline />
        <Field label="Location Name" value={form.location_name!} onChangeText={set('location_name')} placeholder="Deer Creek Garage Room" />
        <Field label="Address" value={form.address_line_1!} onChangeText={set('address_line_1')} placeholder="123 Main St" />
        <Field label="City" value={form.city!} onChangeText={set('city')} placeholder="Richmond" />
        <Field label="State" value={form.state!} onChangeText={set('state')} placeholder="VA" />
        <Field label="Postal Code" value={form.postal_code!} onChangeText={set('postal_code')} placeholder="23220" />
        <Field label="Stakes" value={form.stakes_label!} onChangeText={set('stakes_label')} placeholder="1/2 NL Hold'em" />
        <Field label="Starts At" value={form.starts_at!} onChangeText={set('starts_at')} placeholder="2026-03-25 19:00" hint="YYYY-MM-DD HH:MM" />
        <Field label="Ends At" value={form.ends_at!} onChangeText={set('ends_at')} placeholder="2026-03-26 01:00" hint="YYYY-MM-DD HH:MM" />

        <Text style={styles.label}>Game Type</Text>
        <View style={styles.row}>
          {GAME_TYPES.map(t => (
            <TouchableOpacity
              key={t} onPress={() => set('game_type')(t)}
              style={[styles.chip, form.game_type === t && styles.chipActive]}
            >
              <Text style={[styles.chipText, form.game_type === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Status</Text>
        <View style={styles.row}>
          {STATUS_OPTIONS.map(s => (
            <TouchableOpacity
              key={s} onPress={() => set('status')(s)}
              style={[styles.chip, form.status === s && styles.chipActive]}
            >
              <Text style={[styles.chipText, form.status === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Create Game</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label, value, onChangeText, placeholder, multiline, hint,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; multiline?: boolean; hint?: string;
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#555"
        multiline={multiline}
        autoCapitalize="none"
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#1a1a2e' },
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 20, paddingBottom: 40 },
  label: { color: '#ccc', marginBottom: 6, fontSize: 14 },
  input: {
    backgroundColor: '#16213e', color: '#fff', borderRadius: 8,
    padding: 12, marginBottom: 16, fontSize: 15,
    borderWidth: 1, borderColor: '#2a2a4a',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 6,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  chipActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  chipText: { color: '#aaa', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  button: {
    backgroundColor: '#e94560', borderRadius: 8, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  error: { color: '#ff6b6b', marginBottom: 16, textAlign: 'center' },
  hint: { color: '#888', fontSize: 11, marginTop: -12, marginBottom: 14 },
});
