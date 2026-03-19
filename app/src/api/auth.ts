import { api } from './client';

export interface User {
  id: number;
  phone: string;
  display_name: string;
  username?: string;
  email?: string;
  roles?: string[];
}

// Auth controller does NOT use respond.js ok() — token/user are top-level
export interface AuthResponse {
  ok: boolean;
  token: string;
  user: User;
}

// /api/auth/me returns { ok, user } (top-level, no data wrapper)
export interface MeResponse {
  ok: boolean;
  user: {
    id: number;
    phone: string;
    roles: string[];
  };
}

export const authApi = {
  register: (body: { phone: string; display_name: string; email?: string }) =>
    api.post<AuthResponse>('/api/auth/register', body),

  // Login is phone-only — no password yet
  login: (body: { phone: string }) =>
    api.post<AuthResponse>('/api/auth/login', body),

  me: () =>
    api.get<MeResponse>('/api/auth/me'),
};
