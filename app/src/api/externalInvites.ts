import { api, API_BASE_URL } from './client';

export interface ExternalInvite {
  id: number;
  host_user_id: number;
  host_contact_id?: number;
  game_id?: number;
  invite_code: string;
  invite_url: string;
  status: string;
  channel: string;
  recipient_phone?: string;
  recipient_email?: string;
  expires_at?: string;
  accepted_at?: string;
  registered_user_id?: number;
  created_at: string;
}

export interface InvitePreview extends ExternalInvite {
  host_display_name: string;
  game_name?: string;
  game_date?: string;
}

export interface CreateInviteBody {
  // Flow A — from existing contact
  host_contact_id?: number;
  // Flow B — direct prospect
  contact_display_name?: string;
  recipient_phone?: string;
  recipient_email?: string;
  // optional
  game_id?: number;
  channel?: string;
  expires_at?: string;
}

export function buildInviteUrl(code: string) {
  return `${API_BASE_URL}/invite/${code}`;
}

export const externalInvitesApi = {
  list: (params?: { status?: string; game_id?: string }) => {
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return api.get<{ ok: boolean; data: { invites: ExternalInvite[] } }>(
      `/api/external-invites${qs}`
    );
  },

  get: (id: number | string) =>
    api.get<{ ok: boolean; data: { invite: ExternalInvite } }>(
      `/api/external-invites/${id}`
    ),

  create: (body: CreateInviteBody) =>
    api.post<{ ok: boolean; data: { invite: ExternalInvite } }>(
      '/api/external-invites',
      body
    ),

  preview: (code: string) =>
    api.get<{ ok: boolean; data: { valid: boolean; invite: InvitePreview; reason?: string } }>(
      `/api/invites/${code}`
    ),

  accept: (code: string) =>
    api.post<{ ok: boolean; data: { message: string } }>(
      `/api/invites/${code}/accept`
    ),
};
