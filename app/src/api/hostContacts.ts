import { api } from './client';

export interface HostContact {
  id: number;
  host_user_id: number;
  display_name: string;
  phone?: string;
  email?: string;
  source: string;
  status: string;
  notes?: string;
  registered_user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateContactBody {
  display_name: string;
  phone?: string;
  email?: string;
  source?: string;
  notes?: string;
}

export interface UpdateContactBody {
  display_name?: string;
  phone?: string;
  email?: string;
  status?: string;
  notes?: string;
}

export interface BulkContactResult {
  inserted_count: number;
  invalid_count: number;
  duplicate_count: number;
  inserted: HostContact[];
  invalid: { row: number; reason: string }[];
  duplicates: { row: number; reason: string }[];
}

export interface BulkContactInput {
  display_name: string;
  phone?: string;
  email?: string;
  source?: string;
  notes?: string;
}

export const hostContactsApi = {
  list: (params?: { status?: string; source?: string }) => {
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return api.get<{ ok: boolean; data: { contacts: HostContact[] } }>(
      `/api/host-contacts${qs}`
    );
  },

  get: (id: number | string) =>
    api.get<{ ok: boolean; data: { contact: HostContact } }>(
      `/api/host-contacts/${id}`
    ),

  create: (body: CreateContactBody) =>
    api.post<{ ok: boolean; data: { contact: HostContact } }>(
      '/api/host-contacts',
      body
    ),

  update: (id: number | string, body: UpdateContactBody) =>
    api.patch<{ ok: boolean; data: { contact: HostContact } }>(
      `/api/host-contacts/${id}`,
      body
    ),

  bulkCreate: (contacts: BulkContactInput[]) =>
    api.post<{ ok: boolean; data: BulkContactResult }>(
      '/api/host-contacts/bulk',
      { contacts }
    ),
};
