import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { setupServer } from "msw/node";

import { handlers, resetMockAuthData } from "../../../mocks/handlers";
import { login, register, getCurrentUser, logout, refresh } from "./authApi";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(async () => {
  resetMockAuthData();
  // logout() is idempotent and always clears the mock's refresh cookie, so
  // this keeps sessions from one test leaking into the next.
  await logout();
});
afterAll(() => server.close());

describe("mock auth API", () => {
  it("registers a user and signs them in immediately", async () => {
    await expect(register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    })).resolves.toEqual({
      accessToken: expect.any(String),
      user: { id: expect.any(String), name: "Ada Lovelace", email: "ada@example.com" },
    });
  });

  it("rejects registration with an email that is already registered", async () => {
    const payload = {
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    };

    await register(payload);

    await expect(register(payload)).rejects.toMatchObject({
      status: 409,
      data: { message: "An account already exists for this email." },
    });
  });

  it("logs in a registered user and fetches that user with its access token", async () => {
    await register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });

    const session = await login({ email: "ada@example.com", password: "password123" });

    expect(session).toEqual({
      accessToken: expect.any(String),
      user: { id: expect.any(String), name: "Ada Lovelace", email: "ada@example.com" },
    });
    await expect(getCurrentUser(session.accessToken)).resolves.toEqual({ user: session.user });
  });

  it("rejects an invalid login and an absent current-user token", async () => {
    await expect(login({ email: "nobody@example.com", password: "password123" })).rejects
      .toMatchObject({ status: 401 });
    await expect(getCurrentUser()).rejects.toMatchObject({ status: 401 });
  });

  it("mints a new access token from the refresh cookie set at login", async () => {
    await register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });

    await expect(refresh()).resolves.toEqual({
      accessToken: expect.any(String),
      user: { id: expect.any(String), name: "Ada Lovelace", email: "ada@example.com" },
    });
  });

  it("rejects a refresh with no session cookie", async () => {
    await expect(refresh()).rejects.toMatchObject({ status: 401 });
  });

  it("logs out and clears the refresh cookie so a later refresh fails", async () => {
    await register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });

    await expect(logout()).resolves.toBeUndefined();
    await expect(refresh()).rejects.toMatchObject({ status: 401 });
  });
});
