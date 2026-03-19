import { api } from './client';

export interface BillingFeatures {
  canSendSms: boolean;
  canReceiveSms: boolean;
  canUseSeatTools: boolean;
  batchLimit: number | null;
}

export interface BillingSubscription {
  providerSubscriptionId: string;
  providerPlanId: string;
  startedAt: string | null;
  renewsAt: string | null;
  cancelledAt: string | null;
}

export interface BillingStatus {
  planLevel: 'level1' | 'level2' | 'level3';
  subscriptionStatus: string | null;
  smsUsage: number;
  smsLimit: number;
  smsOverage: number;
  // overage / credit accounting
  overageMessages: number;
  overageAmountCents: number;
  creditBalanceCents: number;
  creditsAppliedCents: number;
  netAmountCents: number;
  features: BillingFeatures;
  subscription: BillingSubscription | null;
}

export interface OverageLedger {
  year: number;
  month: number;
  includedMessages: number;
  messagesSent: number;
  overageMessages: number;
  overageAmountCents: number;
  creditBalanceCents: number;
  creditsAppliedCents: number;
  netAmountCents: number;
  status: string;
}

export interface SubscribeResult {
  planLevel: string;
  subscriptionId: string;
  approvalUrl: string;
}

export const billingApi = {
  async getStatus(): Promise<BillingStatus> {
    const res = await api.get<{ ok: boolean; data: BillingStatus }>('/api/my/billing');
    return res.data;
  },

  async subscribe(planLevel: 'level2' | 'level3'): Promise<SubscribeResult> {
    const res = await api.post<{ ok: boolean; data: SubscribeResult }>('/api/my/billing/subscribe', { planLevel });
    return res.data;
  },

  async cancel(): Promise<{ cancelled: boolean; subscriptionId: string }> {
    const res = await api.post<{ ok: boolean; data: { cancelled: boolean; subscriptionId: string } }>('/api/my/billing/cancel');
    return res.data;
  },

  async getOverage(): Promise<OverageLedger> {
    const res = await api.get<{ ok: boolean; data: OverageLedger }>('/api/my/billing/overage');
    return res.data;
  },
};
