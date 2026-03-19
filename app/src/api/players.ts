import { api } from './client';

export interface PlayerResult {
  id: number;
  display_name: string;
  username?: string;
  phone?: string;
  email?: string;
}

export interface HostPlayer {
  id: number;
  host_user_id: number;
  player_user_id: number;
  display_name: string;
  username?: string;
  phone?: string;
  email?: string;
  status: string;
  notes?: string;
}

export const playersApi = {
  search: (q: string) =>
    api.get<{ ok: boolean; data: { players: PlayerResult[] } }>(
      `/api/player-search?q=${encodeURIComponent(q)}`
    ),

  addToMyPlayers: (player_user_id: number, notes?: string) =>
    api.post<{ ok: boolean; data: { host_player_created: boolean; host_player: HostPlayer } }>(
      '/api/my/players',
      { player_user_id, notes }
    ),

  listMyPlayers: (status?: string) => {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return api.get<{ ok: boolean; data: { players: HostPlayer[] } }>(
      `/api/my/players${qs}`
    );
  },

  addPlayerToGame: (gameId: number | string, player_user_id: number, notes?: string) =>
    api.post<{ ok: boolean; data: { host_player_created: boolean; game_invite_created: boolean } }>(
      `/api/my/games/${gameId}/add-player`,
      { player_user_id, notes }
    ),
};
