import { api } from '../../../api/client';

export interface ArcadeStat {
  game_id: string;
  high_score: number;
  best_streak: number;
  total_plays: number;
  last_score: number | null;
  last_played_at: string | null;
}

export const arcadeApi = {
  getStats: () =>
    api.get<{ ok: boolean; data: ArcadeStat[] }>('/api/arcade/stats'),

  getGameStats: (gameId: string) =>
    api.get<{ ok: boolean; data: ArcadeStat | null }>(`/api/arcade/stats/${gameId}`),

  submitResult: (payload: { gameId: string; score: number; streak: number }) =>
    api.post<{ ok: boolean; data: { saved: boolean } }>('/api/arcade/submit', payload),
};
