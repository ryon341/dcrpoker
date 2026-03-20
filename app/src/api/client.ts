import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// On mobile (Expo Go), localhost refers to the device itself — use the Metro
// server's LAN IP so the phone can reach the API on the same machine.
// On web in production, use empty string (relative URL) so nginx proxies /api/.
function resolveApiBase(): string {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      return ''; // production: relative URLs, nginx proxies /api/ → localhost:4000
    }
    return 'http://localhost:4000';
  }
  const metroHost = (Constants.expoConfig as any)?.hostUri?.split(':')[0];
  if (metroHost) return `http://${metroHost}:4000`;
  return 'http://localhost:4000';
}

export const API_BASE_URL = resolveApiBase();

const TIMEOUT_MS = 10_000;

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const token = await AsyncStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err: any) {
    clearTimeout(timer);
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out. Check your network connection.');
    }
    throw err;
  }
  clearTimeout(timer);

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    // Server returned HTML (e.g. nginx error page) — not a JSON API response
    throw new Error(`Server error (${res.status}): Could not reach the API. Please try again.`);
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || `Request failed: ${res.status}`);
  }

  return json;
}

export const api = {
  get:   <T>(path: string)                    => request<T>('GET',   path),
  post:  <T>(path: string, body?: unknown)    => request<T>('POST',  path, body),
  patch: <T>(path: string, body?: unknown)    => request<T>('PATCH', path, body),
  del:   <T>(path: string)                    => request<T>('DELETE', path),
};
