import { api } from './client';

export interface PokerSession {
  id: number;
  played_at: string;
  game_type: string;
  stakes_label: string | null;
  location_name: string | null;
  buy_in_amount_cents: number;
  cash_out_amount_cents: number;
  profit_loss_cents: number;
  hours_played_decimal: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BankrollAdjustment {
  id: number;
  amount_cents: number;
  adjustment_type: string;
  description: string | null;
  created_at: string;
}

export interface BankrollSummary {
  filters: { from: string | null; to: string | null; game_type: string | null };
  session_count: number;
  total_profit_loss_cents: number;
  total_hours_played_decimal: number;
  average_profit_per_session_cents: number;
  average_profit_per_hour_cents: number;
  current_bankroll_cents: number;
  biggest_win_cents: number;
  biggest_loss_cents: number;
}

export interface TrendPoint {
  session_id: number;
  played_at: string;
  profit_loss_cents: number;
  hours_played_decimal: number;
  cumulative_profit_cents: number;
}

export interface TrendData {
  points: TrendPoint[];
  recent: {
    last7DaysProfitCents: number;
    last30DaysProfitCents: number;
    last7DaysHours: number;
    last30DaysHours: number;
  };
}

export interface SummaryFilters {
  from?: string;
  to?: string;
  game_type?: string;
}

export interface CreateSessionInput {
  played_at: string;
  game_type?: string;
  stakes_label?: string;
  location_name?: string;
  buy_in_amount_cents: number;
  cash_out_amount_cents: number;
  hours_played_decimal: number;
  notes?: string;
}

export interface UpdateSessionInput {
  played_at?: string;
  game_type?: string;
  stakes_label?: string;
  location_name?: string;
  buy_in_amount_cents?: number;
  cash_out_amount_cents?: number;
  hours_played_decimal?: number;
  notes?: string;
}

export interface CreateAdjustmentInput {
  amount_cents: number;
  adjustment_type?: string;
  description?: string;
}

function toQS(params?: object): string {
  if (!params) return '';
  const pairs = Object.entries(params).filter(([, v]) => v != null) as [string, string][];
  return pairs.length > 0 ? '?' + new URLSearchParams(pairs).toString() : '';
}

export const bankrollApi = {
  async getSummary(filters?: SummaryFilters): Promise<BankrollSummary> {
    const res = await api.get<{ ok: boolean; data: BankrollSummary }>(`/api/my/bankroll/summary${toQS(filters)}`);
    return res.data;
  },

  async getTrends(filters?: SummaryFilters): Promise<TrendData> {
    const res = await api.get<{ ok: boolean; data: TrendData }>(`/api/my/bankroll/trends${toQS(filters)}`);
    return res.data;
  },

  async getSessions(filters?: { game_type?: string; from?: string; to?: string }): Promise<PokerSession[]> {
    const res = await api.get<{ ok: boolean; data: PokerSession[] }>(`/api/my/bankroll/sessions${toQS(filters)}`);
    return res.data;
  },

  async getSession(id: number): Promise<PokerSession> {
    const res = await api.get<{ ok: boolean; data: PokerSession }>(`/api/my/bankroll/sessions/${id}`);
    return res.data;
  },

  async createSession(input: CreateSessionInput): Promise<PokerSession> {
    const res = await api.post<{ ok: boolean; data: PokerSession }>('/api/my/bankroll/sessions', input);
    return res.data;
  },

  async updateSession(id: number, input: UpdateSessionInput): Promise<PokerSession> {
    const res = await api.patch<{ ok: boolean; data: PokerSession }>(`/api/my/bankroll/sessions/${id}`, input);
    return res.data;
  },

  async deleteSession(id: number): Promise<void> {
    await api.del(`/api/my/bankroll/sessions/${id}`);
  },

  async getAdjustments(): Promise<BankrollAdjustment[]> {
    const res = await api.get<{ ok: boolean; data: BankrollAdjustment[] }>('/api/my/bankroll/adjustments');
    return res.data;
  },

  async createAdjustment(input: CreateAdjustmentInput): Promise<BankrollAdjustment> {
    const res = await api.post<{ ok: boolean; data: BankrollAdjustment }>('/api/my/bankroll/adjustments', input);
    return res.data;
  },
};
