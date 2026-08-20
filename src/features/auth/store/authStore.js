import { create } from "zustand";
import { persist } from "zustand/middleware";

import * as authApi from "../api/authApi";
import { notifySessionExpired } from "../lib/notifications";

const emptySession = {
  token: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...emptySession,
      isHydrated: false,

      register: async ({ name, email, password }) => {
        await authApi.register({ name, email, password });
        const session = await authApi.login({ email, password });
        set({ ...session, isAuthenticated: true });
        return session.user;
      },

      login: async ({ email, password }) => {
        const session = await authApi.login({ email, password });
        set({ ...session, isAuthenticated: true });
        return session.user;
      },

      restoreSession: async () => {
        const { token } = get();
        if (!token) {
          set({ isHydrated: true });
          return;
        }

        try {
          const { user } = await authApi.getCurrentUser(token);
          set({ user, isAuthenticated: true, isHydrated: true });
        } catch {
          set({ ...emptySession, isHydrated: true });
          notifySessionExpired();
        }
      },

      logout: async () => {
        const { token } = get();
        try {
          if (token) await authApi.logout(token);
        } finally {
          set(emptySession);
        }
      },
    }),
    {
      name: "ecom.auth.session",
      partialize: ({ token, user }) => ({ token, user }),
      onRehydrateStorage: () => (state) => {
        state?.restoreSession();
      },
    },
  ),
);
