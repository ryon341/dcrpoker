import { api } from './client';

export interface ReferredHost {
  id: number;
  display_name: string;
  phone: string;
  status: 'pending' | 'qualified' | 'credited' | 'cancelled';
  created_at: string;
}

export interface ReferralSummary {
  totalReferred: number;
  qualified: number;
  credited: number;
}

export interface ReferralsData {
  referralCode: string;
  summary: ReferralSummary;
  referredHosts: ReferredHost[];
}

export const referralsApi = {
  async getReferrals(): Promise<ReferralsData> {
    const res = await api.get<{ ok: boolean; data: ReferralsData }>('/api/my/referrals');
    return res.data;
  },

  async applyReferralCode(referralCode: string): Promise<{ id: number; referrerHostUserId: number; status: string }> {
    const res = await api.post<{ ok: boolean; data: { id: number; referrerHostUserId: number; status: string } }>('/api/my/referrals/apply', { referralCode });
    return res.data;
  },
};
