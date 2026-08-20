import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { setupServer } from "msw/node";

import { handlers, resetMockAuthData } from "../../../mocks/handlers";
import { useAuthStore } from "./authStore";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  resetMockAuthData();
  useAuthStore.setState({ user: null, token: null, isHydrated: true });
});
afterAll(() => server.close());

describe("useAuthStore", () => {
  it("registers and authenticates a new user", async () => {
    await useAuthStore.getState().register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });

    expect(useAuthStore.getState()).toMatchObject({
      token: expect.any(String),
      user: { name: "Ada Lovelace", email: "ada@example.com" },
      isAuthenticated: true,
    });
  });

  it("clears a session when current user rejects its persisted token", async () => {
    useAuthStore.setState({
      token: "mock-token-missing-user",
      user: { id: "missing-user", name: "Missing", email: "missing@example.com" },
    });

    await useAuthStore.getState().restoreSession();

    expect(useAuthStore.getState()).toMatchObject({ token: null, user: null, isAuthenticated: false });
  });

  it("logs out and clears the active session", async () => {
    await useAuthStore.getState().register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState()).toMatchObject({ token: null, user: null, isAuthenticated: false });
  });
});
