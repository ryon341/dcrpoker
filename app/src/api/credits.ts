import { api } from './client';

export interface CreditTransaction {
  id: number;
  type: string;
  amount_cents: number;
  description: string | null;
  reference_type: string | null;
  reference_id: number | null;
  created_at: string;
}

export interface CreditsData {
  balanceCents: number;
  transactions: CreditTransaction[];
}

export const creditsApi = {
  async getCredits(): Promise<CreditsData> {
    const res = await api.get<{ ok: boolean; data: CreditsData }>('/api/my/credits');
    return res.data;
  },

  // DEV/TEST ONLY — grant a manual credit to own account
  async testGrant(amountCents: number, description?: string): Promise<{ transactionId: number; newBalanceCents: number }> {
    const res = await api.post<{ ok: boolean; data: { transactionId: number; newBalanceCents: number } }>('/api/my/credits/test-grant', { amount_cents: amountCents, description });
    return res.data;
  },
};
