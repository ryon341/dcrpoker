import { api } from './client';
import type { PokerChallengeProgress } from '../components/poker-challenge/progressStorage';
import type { DailyChallengeProgress } from '../components/poker-challenge/dailyStorage';

interface ProgressResponse {
  ok: boolean;
  data: { progress: PokerChallengeProgress | null };
}

interface SaveResponse {
  ok: boolean;
  data: { saved: boolean; reason?: string; progress?: PokerChallengeProgress };
}

interface DailyResponse {
  ok: boolean;
  data: { progress: DailyChallengeProgress | null };
}

export const pokerProgressApi = {
  /** Load main progression progress for the authenticated user. */
  loadProgress: (): Promise<PokerChallengeProgress | null> =>
    api.get<ProgressResponse>('/api/poker/progress').then(r => r.data.progress),

  /**
   * Save main progression progress.
   * Returns the server's copy if it rejected the write as stale.
   */
  saveProgress: (progress: PokerChallengeProgress): Promise<SaveResponse['data']> =>
    api.post<SaveResponse>('/api/poker/progress', { progress }).then(r => r.data),

  /** Load daily progress for a specific date. */
  loadDailyProgress: (dailyId: string): Promise<DailyChallengeProgress | null> =>
    api
      .get<DailyResponse>(`/api/poker/daily?dailyId=${encodeURIComponent(dailyId)}`)
      .then(r => r.data.progress),

  /** Save daily progress for a specific date. */
  saveDailyProgress: (dailyId: string, progress: DailyChallengeProgress): Promise<void> =>
    api
      .post<SaveResponse>('/api/poker/daily', { dailyId, progress })
      .then(() => undefined),
};
