import { useState, useEffect, useCallback } from 'react';
import { arcadeApi, ArcadeStat } from '../utils/arcadeApi';
import { useAuth } from '../../../context/AuthContext';
import { getAllGuestArcadeStats, GuestArcadeStat } from '../../../utils/guestStorage';

export function useArcadeStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<(ArcadeStat | GuestArcadeStat)[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    if (user) {
      arcadeApi.getStats()
        .then(res => setStats(res.data ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      getAllGuestArcadeStats()
        .then(setStats)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const statsMap = Object.fromEntries(stats.map(s => [s.game_id, s]));

  return { stats, statsMap, loading, refresh: load };
}
