import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  loadGuestProgress,
  saveGuestProgress,
  clearGuestProgress,
  loadUserProgress,
  saveUserProgress,
  clearUserProgress,
  PokerChallengeProgress,
} from './progressStorage';
import { pokerProgressApi } from '../../api/pokerProgress';

export function usePokerProgress() {
  const { user, isLoading } = useAuth();
  const isGuest = !user;
  const userId  = user ? String(user.id) : null;

  const [savedProgress, setSavedProgress]         = useState<PokerChallengeProgress | null>(null);
  const [progressLoaded, setProgressLoaded]       = useState(false);
  const [didMigrateGuestProgress, setDidMigrate] = useState(false);

  // Load correct progress once auth resolves
  useEffect(() => {
    if (isLoading) return;
    (async () => {
      let progress: PokerChallengeProgress | null = null;

      if (!isGuest && userId) {
        // 1. Try backend
        try {
          progress = await pokerProgressApi.loadProgress();
        } catch {
          // offline / error — fall back to local
          progress = await loadUserProgress(userId);
        }

        // 2. Guest → user migration: if user has no backend record, check guest storage
        if (!progress) {
          const guest = await loadGuestProgress();
          if (guest) {
            try {
              await pokerProgressApi.saveProgress(guest);
            } catch {
              // best-effort migration; local copy below acts as fallback
            }
            await saveUserProgress(userId, guest);
            await clearGuestProgress();
            setDidMigrate(true);
            progress = guest;
          }
        }
      } else {
        progress = await loadGuestProgress();
      }

      setSavedProgress(progress);
      setProgressLoaded(true);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isGuest, userId]);

  const saveProgress = useCallback(
    async (progress: PokerChallengeProgress) => {
      if (!isGuest && userId) {
        // Fire-and-forget to backend; keep local as offline backup
        pokerProgressApi.saveProgress(progress).catch(() => {});
        await saveUserProgress(userId, progress);
      } else {
        await saveGuestProgress(progress);
      }
    },
    [isGuest, userId],
  );

  const resetProgress = useCallback(async () => {
    if (!isGuest && userId) {
      // Overwrite backend with a null marker isn't ideal; just clear local
      // and let next save create a fresh backend record
      await clearUserProgress(userId);
      pokerProgressApi.saveProgress({
        level: 1, score: 0, handsCompleted: 0,
        currentChallengeIndex: 0, challengeHistory: [],
        wheelPending: false, lastWheelResult: null,
        updatedAt: new Date().toISOString(),
        stats: undefined as any,
      } as any).catch(() => {});
    } else {
      await clearGuestProgress();
    }
    setSavedProgress(null);
  }, [isGuest, userId]);

  return { isGuest, progressLoaded, savedProgress, saveProgress, resetProgress, didMigrateGuestProgress };
}
