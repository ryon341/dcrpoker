import AsyncStorage from '@react-native-async-storage/async-storage';

const ARCADE_KEY = 'dcr_guest_arcade_stats';

export interface GuestArcadeStat {
  game_id: string;
  high_score: number;
  best_streak: number;
  total_plays: number;
  last_score: number;
}

type GuestArcadeMap = Record<string, GuestArcadeStat>;

async function readArcadeMap(): Promise<GuestArcadeMap> {
  try {
    const raw = await AsyncStorage.getItem(ARCADE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function writeArcadeMap(map: GuestArcadeMap): Promise<void> {
  try {
    await AsyncStorage.setItem(ARCADE_KEY, JSON.stringify(map));
  } catch {}
}

export async function getAllGuestArcadeStats(): Promise<GuestArcadeStat[]> {
  const map = await readArcadeMap();
  return Object.values(map);
}

export async function getGuestGameStats(gameId: string): Promise<GuestArcadeStat | null> {
  const map = await readArcadeMap();
  return map[gameId] ?? null;
}

export async function submitGuestResult(gameId: string, score: number, streak: number): Promise<void> {
  const map = await readArcadeMap();
  const prev = map[gameId] ?? { game_id: gameId, high_score: 0, best_streak: 0, total_plays: 0, last_score: 0 };
  map[gameId] = {
    game_id: gameId,
    high_score: Math.max(prev.high_score, score),
    best_streak: Math.max(prev.best_streak, streak),
    total_plays: prev.total_plays + 1,
    last_score: score,
  };
  await writeArcadeMap(map);
}
