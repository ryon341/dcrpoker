import { api } from './client';

export interface Game {
  id: number;
  host_user_id: number;
  title: string;
  description?: string;
  location_name?: string;
  address_line_1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  game_type?: string;
  stakes_label?: string;
  starts_at?: string;
  ends_at?: string;
  status: string;
  visibility: string;
  is_active: number;
  max_players?: number;
  invite_count?: number;
}

export interface GameInvite {
  id: number;
  game_id: number;
  player_user_id: number;
  player_display_name: string;
  player_username?: string;
  player_phone: string;
  player_email?: string;
  status: string;
  rsvp_status?: string;
  seat_preference?: string;
  assigned_seat_number?: number;
  waitlist_position?: number;
  invited_at: string;
  responded_at?: string;
}

export interface GameRsvp {
  id: number;
  status: string;
  rsvp_status: string;
  seat_preference?: string;
  assigned_seat_number?: number;
  waitlist_position?: number;
  responded_at?: string;
  player_display_name: string;
  player_username?: string;
  player_phone: string;
  player_email?: string;
}

export interface RsvpSummary {
  confirmed_count: number;
  waitlisted_count: number;
  declined_count: number;
  open_seats: number;
}

export interface RsvpDashboardData {
  game: { id: number; title: string; max_players: number; seat_assignment_enabled: number };
  summary: RsvpSummary;
  rsvps: GameRsvp[];
}

export interface CreateGameBody {
  title: string;
  description?: string;
  location_name?: string;
  address_line_1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  game_type?: string;
  stakes_label?: string;
  starts_at?: string;
  ends_at?: string;
  status?: string;
}

export const gamesApi = {
  create: (body: CreateGameBody) =>
    api.post<{ ok: boolean; data: { game: Game } }>('/api/my/games', body),

  list: (params?: { status?: string; is_active?: string }) => {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return api.get<{ ok: boolean; data: { games: Game[] } }>(`/api/my/games${qs}`);
  },

  get: (id: number | string) =>
    api.get<{ ok: boolean; data: { game: Game } }>(`/api/my/games/${id}`),

  update: (id: number | string, body: Partial<CreateGameBody>) =>
    api.patch<{ ok: boolean; data: { game: Game } }>(`/api/my/games/${id}`, body),

  listInvites: (gameId: number | string) =>
    api.get<{ ok: boolean; data: { invites: GameInvite[] } }>(`/api/my/games/${gameId}/invites`),

  invitePlayer: (gameId: number | string, player_user_id: number) =>
    api.post<{ ok: boolean; data: { invite_created: boolean; host_player_created: boolean; game_invite: GameInvite } }>(
      `/api/my/games/${gameId}/invites`,
      { player_user_id }
    ),

  inviteFromHostList: (gameId: number | string, player_user_ids: number[]) =>
    api.post<{ ok: boolean; data: { invited_count: number; duplicate_count: number; invalid_count: number; invited_player_user_ids: number[]; duplicate_player_user_ids: number[]; invalid_player_user_ids: number[] } }>(
      `/api/my/games/${gameId}/invites/from-host-list`,
      { player_user_ids }
    ),

  listRsvps: (gameId: number | string) =>
    api.get<{ ok: boolean; data: RsvpDashboardData }>(`/api/my/games/${gameId}/rsvps`),

  updateRsvp: (gameId: number | string, inviteId: number, body: {
    rsvp_status?: string;
    seat_preference?: string;
    assigned_seat_number?: number | null;
    waitlist_position?: number | null;
  }) =>
    api.patch<{ ok: boolean; data: GameRsvp }>(`/api/my/games/${gameId}/rsvps/${inviteId}`, body),

  assignSeat: (gameId: number | string, invite_id: number, seat_number: number) =>
    api.post<{ ok: boolean; data: { invite_id: number; assigned_seat_number: number; rsvp_status: string } }>(
      `/api/my/games/${gameId}/assign-seat`,
      { invite_id, seat_number }
    ),

  clearSeat: (gameId: number | string, invite_id: number) =>
    api.post<{ ok: boolean; data: { invite_id: number; assigned_seat_number: null } }>(
      `/api/my/games/${gameId}/clear-seat`,
      { invite_id }
    ),

  promoteWaitlist: (gameId: number | string, invite_id: number, seat_number?: number | null) =>
    api.post<{ ok: boolean; data: { promoted_invite_id: number; assigned_seat_number: number | null; rsvp_status: string } }>(
      `/api/my/games/${gameId}/promote-waitlist`,
      { invite_id, seat_number: seat_number ?? null }
    ),

  reorderWaitlist: (gameId: number | string, ordered_invite_ids: number[]) =>
    api.post<{ ok: boolean; data: { reordered_count: number } }>(
      `/api/my/games/${gameId}/reorder-waitlist`,
      { ordered_invite_ids }
    ),
};
