import { api } from './client';

export interface PublicVenue {
  id: number;
  name: string;
  city: string;
  state?: string;
  address?: string;
  website?: string;
  notes?: string;
  is_active: number;
}

export interface PublicGame {
  id: number;
  venue_id: number;
  venue_name: string;
  city: string;
  state?: string;
  address?: string;
  website?: string;
  title: string;
  game_type?: string;
  stake?: string;
  schedule_text?: string;
  buy_in?: string;
  is_tournament: number;
  notes?: string;
  is_active: number;
}

export const publicGamesApi = {
  list: (params?: { city?: string; state?: string; game_type?: string; is_tournament?: string }) => {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return api.get<{ ok: boolean; data: { games: PublicGame[] } }>(`/api/public-games${qs}`);
  },

  get: (id: number | string) =>
    api.get<{ ok: boolean; data: { game: PublicGame } }>(`/api/public-games/${id}`),

  // Admin
  adminListVenues: () =>
    api.get<{ ok: boolean; data: { venues: PublicVenue[] } }>('/api/public-games/admin/venues'),

  adminCreateVenue: (body: Partial<PublicVenue>) =>
    api.post<{ ok: boolean; data: { venue: PublicVenue } }>('/api/public-games/admin/venues', body),

  adminUpdateVenue: (id: number, body: Partial<PublicVenue>) =>
    api.patch<{ ok: boolean; data: { venue: PublicVenue } }>(`/api/public-games/admin/venues/${id}`, body),

  adminListGames: () =>
    api.get<{ ok: boolean; data: { games: PublicGame[] } }>('/api/public-games/admin/games'),

  adminCreateGame: (body: Partial<PublicGame>) =>
    api.post<{ ok: boolean; data: { game: PublicGame } }>('/api/public-games/admin/games', body),

  adminUpdateGame: (id: number, body: Partial<PublicGame>) =>
    api.patch<{ ok: boolean; data: { game: PublicGame } }>(`/api/public-games/admin/games/${id}`, body),
};
