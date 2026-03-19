export interface ParsedContact {
  display_name: string;
  phone: string;
  email: string;
  valid: boolean;
  invalid_reason?: string;
  // set after duplicate check
  possible_duplicate?: boolean;
  duplicate_reason?: string;
}

function normalizePhone(raw: string): string {
  // Strip spaces, dashes, parentheses, dots
  return raw.replace(/[\s\-().]/g, '');
}

/**
 * Parse a CSV string into an array of contacts.
 * Accepts headers: name | display_name | full_name  →  display_name
 *                  phone
 *                  email
 */
export function parseCsvContacts(csvText: string): ParsedContact[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  // Parse header row
  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());

  const nameIdx = firstIndex(headers, ['name', 'display_name', 'full_name']);
  const phoneIdx = firstIndex(headers, ['phone']);
  const emailIdx = firstIndex(headers, ['email']);

  const results: ParsedContact[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);

    const rawName = nameIdx >= 0 ? (cols[nameIdx] || '').trim() : '';
    const rawPhone = phoneIdx >= 0 ? (cols[phoneIdx] || '').trim() : '';
    const rawEmail = emailIdx >= 0 ? (cols[emailIdx] || '').trim() : '';

    const display_name = rawName;
    const phone = rawPhone ? normalizePhone(rawPhone) : '';
    const email = rawEmail ? rawEmail.toLowerCase() : '';

    let valid = true;
    let invalid_reason: string | undefined;

    if (!display_name) {
      valid = false;
      invalid_reason = 'Missing display name';
    } else if (!phone && !email) {
      valid = false;
      invalid_reason = 'Missing phone and email';
    }

    results.push({ display_name, phone, email, valid, invalid_reason });
  }

  return results;
}

/**
 * Mark rows that likely duplicate existing contacts (by phone or email).
 */
export function markDuplicates(
  parsed: ParsedContact[],
  existing: { phone?: string | null; email?: string | null }[]
): ParsedContact[] {
  const existingPhones = new Set(existing.map((c) => c.phone).filter(Boolean) as string[]);
  const existingEmails = new Set(existing.map((c) => c.email).filter(Boolean) as string[]);

  return parsed.map((row) => {
    if (!row.valid) return row;
    if (row.phone && existingPhones.has(row.phone)) {
      return { ...row, possible_duplicate: true, duplicate_reason: 'Phone matches existing contact' };
    }
    if (row.email && existingEmails.has(row.email)) {
      return { ...row, possible_duplicate: true, duplicate_reason: 'Email matches existing contact' };
    }
    return { ...row, possible_duplicate: false };
  });
}

/** Split one CSV line respecting quoted fields. */
function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function firstIndex(headers: string[], candidates: string[]): number {
  for (const c of candidates) {
    const idx = headers.indexOf(c);
    if (idx >= 0) return idx;
  }
  return -1;
}
