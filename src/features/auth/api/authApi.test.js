import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { setupServer } from "msw/node";

import { handlers, resetMockAuthData } from "../../../mocks/handlers";
import { login, register, getCurrentUser, logout } from "./authApi";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => resetMockAuthData());
afterAll(() => server.close());

describe("mock auth API", () => {
  it("registers a user and returns a safe user object", async () => {
    await expect(register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    })).resolves.toEqual({
      user: {
        id: expect.any(String),
        name: "Ada Lovelace",
        email: "ada@example.com",
      },
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

  it("logs in a registered user and fetches that user with its token", async () => {
    await register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });

    const session = await login({ email: "ada@example.com", password: "password123" });

    expect(session).toEqual({
      token: expect.any(String),
      user: { id: expect.any(String), name: "Ada Lovelace", email: "ada@example.com" },
    });
    await expect(getCurrentUser(session.token)).resolves.toEqual({ user: session.user });
  });

  it("rejects an invalid login and an absent current-user token", async () => {
    await expect(login({ email: "nobody@example.com", password: "password123" })).rejects
      .toMatchObject({ status: 401 });
    await expect(getCurrentUser()).rejects.toMatchObject({ status: 401 });
  });

  it("logs out an authenticated session", async () => {
    await register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });
    const { token } = await login({ email: "ada@example.com", password: "password123" });

    await expect(logout(token)).resolves.toBeUndefined();
  });
});
