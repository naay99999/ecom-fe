import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { setupServer } from "msw/node";

import { handlers, resetMockAuthData } from "../../../mocks/handlers";
import { logout as apiLogout } from "../api/authApi";
import { useAuthStore } from "./authStore";

const server = setupServer(...handlers);
const emptyState = { accessToken: null, user: null, isAuthenticated: false };

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(async () => {
  resetMockAuthData();
  // Clears the mock's refresh cookie too, so sessions don't leak across tests.
  await apiLogout();
  useAuthStore.setState({ ...emptyState, isHydrated: true });
});
afterAll(() => server.close());

describe("useAuthStore", () => {
  it("registers and authenticates a new user in a single round trip", async () => {
    await useAuthStore.getState().register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });

    expect(useAuthStore.getState()).toMatchObject({
      accessToken: expect.any(String),
      user: { name: "Ada Lovelace", email: "ada@example.com" },
      isAuthenticated: true,
    });
  });

  it("restores a session on bootstrap from the refresh cookie", async () => {
    await useAuthStore.getState().register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });
    // Simulate a fresh page load: no access token in memory yet.
    useAuthStore.setState({ ...emptyState, isHydrated: false });

    await useAuthStore.getState().bootstrap();

    expect(useAuthStore.getState()).toMatchObject({
      accessToken: expect.any(String),
      user: { name: "Ada Lovelace", email: "ada@example.com" },
      isAuthenticated: true,
      isHydrated: true,
    });
  });

  it("leaves the session empty on bootstrap when there is no refresh cookie", async () => {
    await useAuthStore.getState().bootstrap();

    expect(useAuthStore.getState()).toMatchObject({ ...emptyState, isHydrated: true });
  });

  it("silently refreshes an expired access token and retries the call", async () => {
    await useAuthStore.getState().register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });
    // A stale access token still in memory — the refresh cookie is still good.
    useAuthStore.setState({ accessToken: "mock-access-does-not-exist" });

    const user = await useAuthStore.getState().refreshUser();

    expect(user).toMatchObject({ name: "Ada Lovelace", email: "ada@example.com" });
    expect(useAuthStore.getState().accessToken).not.toBe("mock-access-does-not-exist");
  });

  it("clears the session when both the access token and refresh cookie are invalid", async () => {
    useAuthStore.setState({
      accessToken: "mock-access-does-not-exist",
      user: { id: "x", name: "Missing", email: "missing@example.com" },
      isAuthenticated: true,
    });

    await expect(useAuthStore.getState().refreshUser()).rejects.toMatchObject({ status: 401 });

    expect(useAuthStore.getState()).toMatchObject(emptyState);
  });

  it("logs out and clears the active session", async () => {
    await useAuthStore.getState().register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState()).toMatchObject(emptyState);
  });
});
