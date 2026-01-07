import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  userId: string | null;
  userName: string;
  userEmail: string;
  setUser: (userId: string, userName: string, userEmail: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      userName: '',
      userEmail: '',

      setUser: (userId, userName, userEmail) =>
        set({ userId, userName, userEmail }),

      clearUser: () =>
        set({
          userId: null,
          userName: 'Demo User',
          userEmail: 'demo@example.com',
        }),
    }),
    {
      name: 'user-storage',
    }
  )
);
