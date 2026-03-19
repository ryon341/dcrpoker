import { api } from './client';

export interface MessageTemplate {
  id: number;
  host_user_id: number;
  name: string;
  channel: 'sms' | 'email';
  subject?: string | null;
  body: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateBody {
  name: string;
  channel: 'sms' | 'email';
  subject?: string;
  body: string;
}

export interface UpdateTemplateBody {
  name?: string;
  channel?: 'sms' | 'email';
  subject?: string | null;
  body?: string;
  is_active?: boolean;
}

export const messageTemplatesApi = {
  list: (params?: { channel?: string; is_active?: string }) => {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return api.get<{ ok: boolean; data: { templates: MessageTemplate[] } }>(
      `/api/my/message-templates${qs}`
    );
  },

  get: (id: number | string) =>
    api.get<{ ok: boolean; data: { template: MessageTemplate } }>(
      `/api/my/message-templates/${id}`
    ),

  create: (body: CreateTemplateBody) =>
    api.post<{ ok: boolean; data: { template: MessageTemplate } }>(
      '/api/my/message-templates',
      body
    ),

  update: (id: number | string, body: UpdateTemplateBody) =>
    api.patch<{ ok: boolean; data: { template: MessageTemplate } }>(
      `/api/my/message-templates/${id}`,
      body
    ),
};
