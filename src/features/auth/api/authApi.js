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

export function logout(token) {
  return apiClient.post("/auth/logout", undefined, withAuth(token));
}

export function getCurrentUser(token) {
  return apiClient.get("/auth/user", withAuth(token));
}
