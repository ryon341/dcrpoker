import { api } from './client';

export interface AppNotification {
  id: number;
  type: string;
  title: string;
  body: string;
  related_entity_type?: string;
  related_entity_id?: number;
  is_read: number;
  created_at: string;
}

export interface NotificationsData {
  notifications: AppNotification[];
  unreadCount: number;
}

export const notificationsApi = {
  list: () =>
    api.get<{ ok: boolean; data: NotificationsData }>('/api/my/notifications'),

  markRead: (id: number) =>
    api.patch<{ ok: boolean; data: { id: number; is_read: boolean } }>(
      `/api/my/notifications/${id}/read`, {}
    ),

  markAllRead: () =>
    api.patch<{ ok: boolean; data: { marked: boolean } }>(
      '/api/my/notifications/read-all', {}
    ),
};
