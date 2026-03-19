import { api } from './client';

export interface SmsUsage {
  current: number;
  limit: number;
  overage: boolean;
}

export interface SmsSendResult {
  sent_count: number;
  failed_count: number;
  usage: SmsUsage;
}

export const smsApi = {
  /**
   * Send SMS messages to a batch of recipients via DCR Poker / Twilio.
   * Requires Level 2 plan on the host account.
   */
  send: (recipients: string[], message: string) =>
    api.post<{ ok: boolean; data: SmsSendResult }>('/api/sms/send', {
      recipients,
      message,
    }),
};
