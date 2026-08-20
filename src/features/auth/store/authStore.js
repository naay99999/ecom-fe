import { create } from "zustand";

import * as authApi from "../api/authApi";
import { notifySessionExpired } from "../lib/notifications";

const emptySession = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create((set, get) => ({
  ...emptySession,
  isHydrated: false,

  register: async ({ name, email, password }) => {
    const result = await authApi.register({ name, email, password });
    if (result?.accessToken) {
      set({ accessToken: result.accessToken, user: result.user, isAuthenticated: true });
      return result.user;
    }

    // Defensive fallback: some backends don't sign the user in on
    // registration. authApi.login does the extra round trip only then.
    const session = await authApi.login({ email, password });
    set({ accessToken: session.accessToken, user: session.user, isAuthenticated: true });
    return session.user;
  },

  login: async ({ email, password }) => {
    const session = await authApi.login({ email, password });
    set({ accessToken: session.accessToken, user: session.user, isAuthenticated: true });
    return session.user;
  },

  // The access token lives in memory only (never persisted), so a fresh page
  // load has none. Call this once at app start: it asks the server to mint a
  // new access token from the httpOnly refresh cookie set at login. If there
  // is no valid cookie (never logged in, or it expired), this just leaves
  // the session empty — that's an expected, silent outcome, not an error.
  bootstrap: async () => {
    await get().refreshAccessToken();
    set({ isHydrated: true });
  },

  refreshAccessToken: async () => {
    try {
      const { accessToken, user } = await authApi.refresh();
      set({ accessToken, user, isAuthenticated: true });
      return accessToken;
    } catch {
      set(emptySession);
      return null;
    }
  },

  // Run any authenticated request through this instead of calling the API
  // directly. On a 401 (access token expired mid-session) it silently mints
  // a new one from the refresh cookie and retries once; if that also fails,
  // it clears the session and lets the user know before rethrowing so the
  // caller's own error handling still runs. This is the one place session
  // expiry is handled — every future protected endpoint should go through
  // it rather than re-implementing its own retry/expiry logic.
  callAuthenticated: async (requestFn) => {
    const hadToken = Boolean(get().accessToken);
    try {
      return await requestFn(get().accessToken);
    } catch (requestError) {
      if (requestError?.status !== 401) throw requestError;

      const refreshedToken = await get().refreshAccessToken();
      if (refreshedToken) return requestFn(refreshedToken);

      if (hadToken) notifySessionExpired();
      throw requestError;
    }
  },

  refreshUser: async () => {
    const { user } = await get().callAuthenticated((accessToken) => authApi.getCurrentUser(accessToken));
    set({ user });
    return user;
  },

  logout: async () => {
    const { accessToken } = get();
    try {
      if (accessToken) await authApi.logout(accessToken);
    } catch {
      // Best effort — the local session drops below regardless of whether
      // the server call succeeded (e.g. the token was already expired).
    } finally {
      set(emptySession);
    }
  },
}));
