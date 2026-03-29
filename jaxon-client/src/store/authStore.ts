import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Check initial mount using localStorage if living in the browser, otherwise empty.
// We keep side-effects minimal for Next.js SSR.
const isClient = typeof window !== 'undefined';
const storedToken = isClient ? localStorage.getItem('token') : null;
const storedUser = isClient ? JSON.parse(localStorage.getItem('user') || 'null') : null;

export const useAuthStore = create<AuthState>()((set) => ({
  user: storedUser as User | null,
  token: storedToken,
  isAuthenticated: !!storedToken && !!storedUser,

  login: (user: User, token: string) => {
    if (isClient) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (isClient) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false });
    // Soft redirect is usually handled by a hook/layout, but token wipe is fast here.
  },
}));
