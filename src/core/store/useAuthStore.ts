import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type UserRole = 'client' | 'cleaner';

interface AuthState {
  phone: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  setAuth: (phone: string, role: UserRole) => void;
  logout: () => void;
}

/** В AsyncStorage кладём только данные сессии: экшены живут в коде */
type PersistedAuthState = Pick<AuthState, 'phone' | 'role' | 'isAuthenticated'>;

/** Ключ, под которым сессия пользователя хранится в AsyncStorage */
export const AUTH_STORAGE_KEY = 'auth-storage';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      phone: null,
      role: null,
      isAuthenticated: false,

      setAuth: (phone, role) => set({ phone, role, isAuthenticated: true }),

      logout: () => set({ phone: null, role: null, isAuthenticated: false }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage<PersistedAuthState>(() => AsyncStorage),
      version: 1,
      partialize: (state): PersistedAuthState => ({
        phone: state.phone,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);