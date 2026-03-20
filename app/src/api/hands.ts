import { api } from './client';

export type ResultType   = 'win' | 'loss' | 'chop';
export type GameType     = 'cash' | 'tournament';
export type TableFormat  = '6max' | '9max' | 'other';
export type ReviewStatus = 'none' | 'review_later' | 'studied';

export interface HandRecord {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  game_type: GameType;
  stakes: string | null;
  table_format: TableFormat | null;
  position: string;
  hero_hand: string;
  stack_depth_bb: number | null;
  preflop_action: string | null;
  postflop_action: string | null;
  result_amount: number | null;
  result_type: ResultType | null;
  tags: string[];
  notes: string | null;
  review_status: ReviewStatus;
}

export interface CreateHandPayload {
  game_type: GameType;
  position: string;
  hero_hand: string;
  stakes?: string;
  table_format?: TableFormat;
  stack_depth_bb?: number;
  preflop_action?: string;
  postflop_action?: string;
  result_amount?: number;
  result_type?: ResultType;
  tags?: string[];
  notes?: string;
  review_status?: ReviewStatus;
}

export interface HandFilters {
  game_type?: GameType;
  stakes?: string;
  tag?: string;
  review_status?: ReviewStatus | '';
  limit?: number;
  offset?: number;
}

export const handsApi = {
  create: (payload: CreateHandPayload) =>
    api.post<HandRecord>('/api/my/hands', payload),

  list: (filters: HandFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.game_type)     params.set('game_type', filters.game_type);
    if (filters.stakes)        params.set('stakes', filters.stakes);
    if (filters.tag)           params.set('tag', filters.tag);
    if (filters.review_status) params.set('review_status', filters.review_status);
    if (filters.limit)         params.set('limit', String(filters.limit));
    if (filters.offset)        params.set('offset', String(filters.offset));
    const qs = params.toString();
    return api.get<HandRecord[]>(`/api/my/hands${qs ? `?${qs}` : ''}`);
  },

  get: (id: number) =>
    api.get<HandRecord>(`/api/my/hands/${id}`),

  update: (id: number, payload: Partial<CreateHandPayload> & { review_status?: ReviewStatus }) =>
    api.patch<HandRecord>(`/api/my/hands/${id}`, payload),

  remove: (id: number) =>
    api.del<{ deleted: boolean }>(`/api/my/hands/${id}`),
};
