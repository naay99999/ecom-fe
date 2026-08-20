import { apiClient } from "../../../lib/api/client";

function withAuth(token) {
  return token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
}

export function register(payload) {
  return apiClient.post("/auth/register", payload);
}

export function login(payload) {
  return apiClient.post("/auth/login", payload);
}

// Mints a new short-lived access token from the httpOnly refresh cookie the
// server set at login/register. No token to attach here — the cookie rides
// along automatically (see apiClient's credentials: "include").
export function refresh() {
  return apiClient.post("/auth/refresh");
}

export function logout(token) {
  return apiClient.post("/auth/logout", undefined, withAuth(token));
}

export function getCurrentUser(token) {
  return apiClient.get("/auth/user", withAuth(token));
}
