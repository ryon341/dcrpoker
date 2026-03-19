import { api } from './client';

export interface HostPlayer {
  id: number;
  host_user_id: number;
  player_user_id: number;
  player_display_name: string;
  player_username?: string;
  player_phone: string;
  status: string;
}

export const hostPlayersApi = {
  // GET /api/my/roster — returns the authenticated host's own active roster
  getMyRoster: () =>
    api.get<{ ok: boolean; data: { players: HostPlayer[] } }>('/api/my/roster'),
};
