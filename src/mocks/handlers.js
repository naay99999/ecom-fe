import { http, HttpResponse } from "msw";

const USERS_STORAGE_KEY = "ecom.mock-auth.users";
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

function createToken(userId) {
  return `mock-token-${userId}`;
}

function getUserFromRequest(request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token?.startsWith("mock-token-")) return undefined;

  return getStoredUsers().find((user) => token === createToken(user.id));
}

function error(message, status) {
  return HttpResponse.json({ message }, { status });
}

export function resetMockAuthData() {
  memoryUsers = [];
  if (typeof localStorage !== "undefined") localStorage.removeItem(USERS_STORAGE_KEY);
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
    return HttpResponse.json({ user: toUser(user) }, { status: 201 });
  }),

  http.post("*/api/auth/login", async ({ request }) => {
    const { email, password } = await request.json();
    const user = getStoredUsers().find((candidate) =>
      candidate.email === email?.trim().toLowerCase() && candidate.password === password,
    );

    if (!user) return error("Email or password is incorrect.", 401);
    return HttpResponse.json({ token: createToken(user.id), user: toUser(user) });
  }),

  http.post("*/api/auth/logout", ({ request }) => {
    if (!getUserFromRequest(request)) return error("You must be logged in.", 401);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/api/auth/user", ({ request }) => {
    const user = getUserFromRequest(request);
    if (!user) return error("You must be logged in.", 401);
    return HttpResponse.json({ user: toUser(user) });
  }),
];
