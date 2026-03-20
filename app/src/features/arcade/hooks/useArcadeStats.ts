import { useState, useEffect, useCallback } from 'react';
import { arcadeApi, ArcadeStat } from '../utils/arcadeApi';

export function useArcadeStats() {
  const [stats, setStats] = useState<ArcadeStat[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    arcadeApi.getStats()
      .then(res => setStats(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const statsMap = Object.fromEntries(stats.map(s => [s.game_id, s]));

  return { stats, statsMap, loading, refresh: load };
}
