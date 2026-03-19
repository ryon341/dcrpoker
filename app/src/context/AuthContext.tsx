import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, User } from '../api/auth';

const TOKEN_KEY = 'auth_token';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (phone: string) => Promise<void>;
  register: (body: { phone: string; display_name: string; email?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  // On mount: restore token and validate with /api/auth/me
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(TOKEN_KEY);
      if (!stored) {
        setState({ user: null, token: null, isLoading: false });
        return;
      }
      try {
        const res = await authApi.me();
        // /me only returns { id, phone, roles } — enrich with stored data
        setState({
          user: {
            id: res.user.id,
            phone: res.user.phone,
            display_name: '',   // will be blank on restore only
            roles: res.user.roles,
          },
          token: stored,
          isLoading: false,
        });
      } catch {
        await AsyncStorage.removeItem(TOKEN_KEY);
        setState({ user: null, token: null, isLoading: false });
      }
    })();
  }, []);

  async function login(phone: string) {
    const res = await authApi.login({ phone });
    await AsyncStorage.setItem(TOKEN_KEY, res.token);
    setState({ user: res.user, token: res.token, isLoading: false });
  }

  async function register(body: { phone: string; display_name: string; email?: string }) {
    const res = await authApi.register(body);
    await AsyncStorage.setItem(TOKEN_KEY, res.token);
    setState({ user: res.user, token: res.token, isLoading: false });
  }

  async function logout() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setState({ user: null, token: null, isLoading: false });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
