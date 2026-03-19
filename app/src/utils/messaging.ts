/**
 * Messaging utilities for Level 1 manual messaging.
 * No messages are sent by DCR Poker — helpers only.
 */

export interface Recipient {
  id: number;
  display_name: string;
  phone?: string | null;
  email?: string | null;
}

/** Split recipients into batches of `size` (default 10). */
export function splitRecipientsIntoBatches<T>(recipients: T[], size = 10): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < recipients.length; i += size) {
    batches.push(recipients.slice(i, i + size));
  }
  return batches;
}

/** Filter recipients that have a usable phone number. */
export function extractPhones(recipients: Recipient[]): string[] {
  return recipients
    .map((r) => r.phone)
    .filter((p): p is string => Boolean(p && p.trim()));
}

/** Filter recipients that have a usable email address. */
export function extractEmails(recipients: Recipient[]): string[] {
  return recipients
    .map((r) => r.email)
    .filter((e): e is string => Boolean(e && e.trim()));
}

/** Keep only recipients that have a phone (for SMS mode). */
export function filterBySms(recipients: Recipient[]): Recipient[] {
  return recipients.filter((r) => r.phone && r.phone.trim());
}

/** Keep only recipients that have an email (for email mode). */
export function filterByEmail(recipients: Recipient[]): Recipient[] {
  return recipients.filter((r) => r.email && r.email.trim());
}

/**
 * Build a best-effort SMS deep link.
 * Most platforms support `sms:` with a body param for single recipients.
 * Multi-recipient support is inconsistent — we join numbers with semicolons or commas.
 * Platform limitation: iOS uses `;` separator, Android uses `,`. Web may not open SMS at all.
 */
export function buildSmsLink(phones: string[], body: string): string {
  const numbers = phones.join(',');
  const encoded = encodeURIComponent(body);
  // Use `?&body=` for iOS / Android compatibility attempt
  return `sms:${numbers}?body=${encoded}`;
}

/**
 * Build a mailto: link for best-effort email opening.
 * Platform limitation: mailto: body length is limited by OS/app; very long bodies may be truncated.
 */
export function buildMailtoLink(emails: string[], subject: string, body: string): string {
  const to = emails.join(',');
  const params = new URLSearchParams({ subject, body }).toString();
  return `mailto:${to}?${params}`;
}
