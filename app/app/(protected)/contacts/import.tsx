import { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { parseCsvContacts, markDuplicates, ParsedContact } from '../../../src/utils/csvContacts';
import { hostContactsApi, BulkContactInput } from '../../../src/api/hostContacts';

interface RowState extends ParsedContact {
  selected: boolean;
}

interface ImportResult {
  inserted_count: number;
  invalid_count: number;
  duplicate_count: number;
}

export default function ImportContactsScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [rows, setRows] = useState<RowState[]>([]);
  const [parsed, setParsed] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');

  // --- CSV file reading (web only) ---
  function openFilePicker() {
    if (Platform.OS !== 'web') return;
    if (!fileInputRef.current) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv,text/csv';
      input.onchange = (e: Event) => handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
      fileInputRef.current = input;
    }
    fileInputRef.current.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      await processCSV(text);
    };
    reader.readAsText(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  }

  async function processCSV(text: string) {
    setError('');
    const contacts = parseCsvContacts(text);
    if (contacts.length === 0) {
      setError('No rows found in CSV. Make sure the file has a header row and at least one data row.');
      return;
    }

    // Fetch existing contacts for duplicate hints
    let withDuplicates = contacts;
    try {
      const existing = await hostContactsApi.list();
      withDuplicates = markDuplicates(contacts, existing.data.contacts);
    } catch {
      // Duplicate detection optional — continue without
    }

    const rowStates: RowState[] = withDuplicates.map((c) => ({
      ...c,
      // Pre-select valid rows, deselect invalid + suspected duplicates
      selected: c.valid && !c.possible_duplicate,
    }));

    setRows(rowStates);
    setParsed(true);
  }

  function toggleRow(index: number) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, selected: !r.selected } : r)));
  }

  function selectAllValid() {
    setRows((prev) => prev.map((r) => ({ ...r, selected: r.valid })));
  }

  function clearSelection() {
    setRows((prev) => prev.map((r) => ({ ...r, selected: false })));
  }

  async function handleImport() {
    const selected = rows.filter((r) => r.selected);
    if (selected.length === 0) {
      setError('Select at least one contact to import');
      return;
    }

    setError('');
    setImporting(true);
    try {
      const payload: BulkContactInput[] = selected.map((r) => ({
        display_name: r.display_name,
        phone: r.phone || undefined,
        email: r.email || undefined,
        source: 'csv',
      }));

      const res = await hostContactsApi.bulkCreate(payload);
      setResult({
        inserted_count: res.data.inserted_count,
        invalid_count: res.data.invalid_count,
        duplicate_count: res.data.duplicate_count,
      });
    } catch (e: any) {
      setError(e.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  }

  // --- Success screen ---
  if (result) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.logoText}>Import Complete</Text>
        <View style={styles.summaryBox}>
          <SummaryRow label="Imported" value={result.inserted_count} color="#2ecc71" />
          <SummaryRow label="Invalid (skipped)" value={result.invalid_count} color="#888" />
          <SummaryRow label="Duplicates (skipped)" value={result.duplicate_count} color="#d4a017" />
        </View>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace('/(protected)/contacts')}
        >
          <Text style={styles.buttonText}>Back to Contacts</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // --- Mobile placeholder ---
  if (Platform.OS !== 'web' && !parsed) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Import Contacts</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upload CSV</Text>
          <Text style={styles.cardBody}>
            CSV import is available on the web version of this app.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Import from Phone Contacts</Text>
          <Text style={styles.cardBody}>
            Phone contact import will be added in a later update.
          </Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // --- Preview state ---
  if (parsed) {
    const total = rows.length;
    const validCount = rows.filter((r) => r.valid).length;
    const selectedCount = rows.filter((r) => r.selected).length;
    const invalidCount = rows.filter((r) => !r.valid).length;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => { setParsed(false); setRows([]); }} style={styles.back}>
          <Text style={styles.backText}>← Re-upload</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Preview Import</Text>

        {/* Stats bar */}
        <View style={styles.statsRow}>
          <Stat label="Total" value={total} />
          <Stat label="Valid" value={validCount} color="#2ecc71" />
          <Stat label="Selected" value={selectedCount} color="#e94560" />
          <Stat label="Invalid" value={invalidCount} color="#888" />
        </View>

        {/* Selection controls */}
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.controlBtn} onPress={selectAllValid}>
            <Text style={styles.controlBtnText}>Select all valid</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={clearSelection}>
            <Text style={styles.controlBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Row list */}
        {rows.map((row, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.rowCard,
              row.selected && styles.rowCardSelected,
              !row.valid && styles.rowCardInvalid,
            ]}
            onPress={() => row.valid && toggleRow(idx)}
            activeOpacity={row.valid ? 0.7 : 1}
          >
            <View style={styles.rowHeader}>
              {row.valid ? (
                <View style={[styles.checkbox, row.selected && styles.checkboxChecked]}>
                  {row.selected ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
              ) : (
                <View style={styles.checkboxInvalid}>
                  <Text style={styles.checkmark}>✕</Text>
                </View>
              )}
              <Text style={[styles.rowName, !row.valid && styles.rowNameInvalid]}>
                {row.display_name || '(no name)'}
              </Text>
              {row.possible_duplicate ? (
                <View style={styles.dupBadge}>
                  <Text style={styles.dupBadgeText}>dup?</Text>
                </View>
              ) : null}
            </View>

            {row.phone ? <Text style={styles.rowMeta}>{row.phone}</Text> : null}
            {row.email ? <Text style={styles.rowMeta}>{row.email}</Text> : null}

            {!row.valid ? (
              <Text style={styles.invalidReason}>{row.invalid_reason}</Text>
            ) : row.possible_duplicate ? (
              <Text style={styles.dupReason}>{row.duplicate_reason}</Text>
            ) : null}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.primaryButton, (importing || selectedCount === 0) && styles.buttonDisabled]}
          onPress={handleImport}
          disabled={importing || selectedCount === 0}
        >
          {importing
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Import {selectedCount} Contact{selectedCount !== 1 ? 's' : ''}</Text>}
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // --- Upload screen (web, initial state) ---
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Import Contacts</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* CSV Upload */}
      <TouchableOpacity style={styles.uploadCard} onPress={openFilePicker}>
        <Text style={styles.uploadIcon}>📂</Text>
        <Text style={styles.uploadTitle}>Upload CSV File</Text>
        <Text style={styles.uploadSubtitle}>Tap to select a .csv file from your device</Text>
      </TouchableOpacity>

      <View style={styles.formatBox}>
        <Text style={styles.formatTitle}>Supported CSV format</Text>
        <Text style={styles.formatCode}>{'name,phone,email\nJohn Smith,5551234567,john@example.com\nSarah Jones,5552223333,\nMike Carter,,mike@example.com'}</Text>
        <Text style={styles.formatNote}>
          Accepted name columns: <Text style={styles.bold}>name</Text>, <Text style={styles.bold}>display_name</Text>, <Text style={styles.bold}>full_name</Text>
        </Text>
        <Text style={styles.formatNote}>A row needs a name + at least phone or email to be valid.</Text>
      </View>

      {/* Mobile placeholder card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Import from Phone Contacts</Text>
        <Text style={styles.cardBody}>Phone contact import will be added in a later update.</Text>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SummaryRow({ label, value, color = '#fff' }: { label: string; value: number; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
      <Text style={{ color: '#aaa', fontSize: 14 }}>{label}</Text>
      <Text style={{ color, fontSize: 14, fontWeight: 'bold' }}>{value}</Text>
    </View>
  );
}

function Stat({ label, value, color = '#fff' }: { label: string; value: number; color?: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color, fontSize: 20, fontWeight: 'bold' }}>{value}</Text>
      <Text style={{ color: '#666', fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 24 },
  back: { marginBottom: 16 },
  backText: { color: '#e94560', fontSize: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#2ecc71', textAlign: 'center', marginBottom: 28, marginTop: 20 },
  error: { color: '#ff6b6b', marginBottom: 16, textAlign: 'center' },

  // Upload card
  uploadCard: {
    backgroundColor: '#16213e', borderRadius: 12, padding: 32,
    alignItems: 'center', borderWidth: 2, borderColor: '#e94560',
    borderStyle: 'dashed', marginBottom: 24,
  },
  uploadIcon: { fontSize: 36, marginBottom: 12 },
  uploadTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  uploadSubtitle: { color: '#888', fontSize: 13 },

  // Format hint box
  formatBox: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 16,
    borderWidth: 1, borderColor: '#2a2a4a', marginBottom: 20,
  },
  formatTitle: { color: '#aaa', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  formatCode: {
    color: '#7ec8e3', fontFamily: 'monospace', fontSize: 12,
    backgroundColor: '#0d0d1a', padding: 10, borderRadius: 6, marginBottom: 8,
  },
  formatNote: { color: '#666', fontSize: 12, marginBottom: 3 },
  bold: { fontWeight: 'bold', color: '#aaa' },

  // Mobile placeholder card
  card: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 20,
    borderWidth: 1, borderColor: '#2a2a4a', marginBottom: 16,
  },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  cardBody: { color: '#888', fontSize: 13, marginBottom: 12 },
  comingSoonBadge: {
    alignSelf: 'flex-start', backgroundColor: '#0f3460',
    borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4,
  },
  comingSoonText: { color: '#7ec8e3', fontSize: 12 },

  // Stats bar
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#16213e', borderRadius: 10, padding: 16,
    borderWidth: 1, borderColor: '#2a2a4a', marginBottom: 12,
  },
  controlRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  controlBtn: {
    borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  controlBtnText: { color: '#aaa', fontSize: 13 },

  // Preview rows
  rowCard: {
    backgroundColor: '#16213e', borderRadius: 8, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: '#2a2a4a',
  },
  rowCardSelected: { borderColor: '#e94560' },
  rowCardInvalid: { opacity: 0.5 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1,
    borderColor: '#555', marginRight: 10, alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#e94560', borderColor: '#e94560' },
  checkboxInvalid: {
    width: 20, height: 20, borderRadius: 4, marginRight: 10,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#444',
  },
  checkmark: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  rowName: { color: '#fff', fontSize: 15, fontWeight: '600', flex: 1 },
  rowNameInvalid: { color: '#666' },
  rowMeta: { color: '#aaa', fontSize: 13, marginTop: 2 },
  invalidReason: { color: '#ff6b6b', fontSize: 12, marginTop: 4 },
  dupBadge: {
    backgroundColor: '#3a2a00', borderRadius: 4,
    paddingHorizontal: 7, paddingVertical: 2, marginLeft: 8,
  },
  dupBadgeText: { color: '#d4a017', fontSize: 11 },
  dupReason: { color: '#d4a017', fontSize: 12, marginTop: 4 },

  // Summary box
  summaryBox: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 20,
    borderWidth: 1, borderColor: '#2a2a4a', marginBottom: 28,
  },

  primaryButton: {
    backgroundColor: '#e94560', borderRadius: 8, padding: 16,
    alignItems: 'center', marginTop: 20, marginBottom: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
