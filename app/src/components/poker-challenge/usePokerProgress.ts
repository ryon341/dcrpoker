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

export function usePokerProgress() {
  const { user, isLoading } = useAuth();
  const isGuest = !user;
  const userId  = user ? String(user.id) : null;

  const [savedProgress, setSavedProgress]   = useState<PokerChallengeProgress | null>(null);
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Load correct progress once auth resolves
  useEffect(() => {
    if (isLoading) return;
    (async () => {
      const progress = isGuest
        ? await loadGuestProgress()
        : await loadUserProgress(userId!);
      setSavedProgress(progress);
      setProgressLoaded(true);
    })();
  }, [isLoading, isGuest, userId]);

  const saveProgress = useCallback(
    async (progress: PokerChallengeProgress) => {
      if (isGuest) {
        await saveGuestProgress(progress);
      } else if (userId) {
        await saveUserProgress(userId, progress);
      }
    },
    [isGuest, userId],
  );

  const resetProgress = useCallback(async () => {
    if (isGuest) {
      await clearGuestProgress();
    } else if (userId) {
      await clearUserProgress(userId);
    }
    setSavedProgress(null);
  }, [isGuest, userId]);

  return { isGuest, progressLoaded, savedProgress, saveProgress, resetProgress };
}
