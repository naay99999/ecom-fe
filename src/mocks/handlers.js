import { http, HttpResponse } from "msw";

const USERS_STORAGE_KEY = "ecom.mock-auth.users";
const REFRESH_COOKIE_NAME = "ecom_refresh_token";
const ACCESS_TOKEN_PREFIX = "mock-access-";
const REFRESH_TOKEN_PREFIX = "mock-refresh-";

let memoryUsers = [];

function getStoredUsers() {
  if (typeof localStorage === "undefined") return memoryUsers;

  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  memoryUsers = users;
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function toUser({ id, name, email }) {
  return { id, name, email };
}

function error(message, status) {
  return HttpResponse.json({ message }, { status });
}

export function resetMockAuthData() {
  memoryUsers = [];
  if (typeof localStorage !== "undefined") localStorage.removeItem(USERS_STORAGE_KEY);
}

// --- token/cookie helpers -------------------------------------------------
// Access token: short-lived, sent as a Bearer header, kept in memory by the
// client (never persisted). Refresh token: long-lived, issued as an httpOnly
// cookie the client's JS can never read — that's what keeps it safe from XSS.

function userIdFromAccessToken(request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token?.startsWith(ACCESS_TOKEN_PREFIX)) return undefined;
  return token.slice(ACCESS_TOKEN_PREFIX.length);
}

function userIdFromRefreshCookie(cookies) {
  // MSW exposes intercepted cookies via this resolver argument, not via
  // request.headers.get("cookie") — the browser interceptor (unlike the
  // node one) doesn't mirror them onto the header, since real httpOnly
  // cookies aren't visible there either.
  const refreshToken = cookies[REFRESH_COOKIE_NAME];
  return refreshToken?.startsWith(REFRESH_TOKEN_PREFIX)
    ? refreshToken.slice(REFRESH_TOKEN_PREFIX.length)
    : undefined;
}

function setRefreshCookieHeader(userId) {
  // Max-Age here stands in for "refresh session lifetime" (7 days). SameSite=Lax
  // stops the cookie riding along on cross-site requests. `Secure` is omitted
  // only because local dev runs over http — a real deployment must add it.
  return `${REFRESH_COOKIE_NAME}=${REFRESH_TOKEN_PREFIX}${userId}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`;
}

function clearRefreshCookieHeader() {
  return `${REFRESH_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

function authenticatedResponse(user, status = 200) {
  return HttpResponse.json(
    { accessToken: `${ACCESS_TOKEN_PREFIX}${user.id}`, user: toUser(user) },
    { status, headers: { "Set-Cookie": setRefreshCookieHeader(user.id) } },
  );
}

export const handlers = [
  http.post("*/api/auth/register", async ({ request }) => {
    const { name, email, password } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name?.trim() || !normalizedEmail || !password) {
      return error("Name, email, and password are required.", 400);
    }
    if (password.length < 8) return error("Password must be at least 8 characters long.", 400);

    const users = getStoredUsers();
    if (users.some((user) => user.email === normalizedEmail)) {
      return error("An account already exists for this email.", 409);
    }

    const user = {
      id: globalThis.crypto?.randomUUID?.() ?? `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
    };
    saveUsers([...users, user]);
    // Sign the user in immediately, same as login — avoids a second round
    // trip from the client just to exchange credentials it already has.
    return authenticatedResponse(user, 201);
  }),

  http.post("*/api/auth/login", async ({ request }) => {
    const { email, password } = await request.json();
    const user = getStoredUsers().find((candidate) =>
      candidate.email === email?.trim().toLowerCase() && candidate.password === password,
    );

    if (!user) return error("Email or password is incorrect.", 401);
    return authenticatedResponse(user);
  }),

  http.post("*/api/auth/refresh", ({ cookies }) => {
    const userId = userIdFromRefreshCookie(cookies);
    const user = userId && getStoredUsers().find((candidate) => candidate.id === userId);

    if (!user) return error("Session expired. Please sign in again.", 401);
    return authenticatedResponse(user);
  }),

  http.post("*/api/auth/logout", () => {
    // Idempotent by design: always clear the refresh cookie, whether or not
    // the caller's access token / cookie was still valid.
    return new HttpResponse(null, { status: 204, headers: { "Set-Cookie": clearRefreshCookieHeader() } });
  }),

  http.get("*/api/auth/user", ({ request }) => {
    const userId = userIdFromAccessToken(request);
    const user = userId && getStoredUsers().find((candidate) => candidate.id === userId);

    if (!user) return error("You must be logged in.", 401);
    return HttpResponse.json({ user: toUser(user) });
  }),
];
