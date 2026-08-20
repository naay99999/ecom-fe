import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

import { toast } from "../../../components/ui/toast";
import {
  notifyAccountAccessRequired,
  notifyLoginSuccess,
  notifySessionExpired,
} from "./notifications";

describe("auth notifications", () => {
  const listener = vi.fn();
  const unsubscribe = toast[" subscribe"](listener);

  afterEach(() => listener.mockClear());

  it("announces a successful login with the user's name", () => {
    notifyLoginSuccess({ name: "Ada" });

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      action: "add",
      options: expect.objectContaining({
        title: "Welcome back, Ada",
        type: "success",
      }),
    }));
  });

  it("announces why an unauthenticated visitor was redirected", () => {
    notifyAccountAccessRequired();

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      action: "add",
      options: expect.objectContaining({
        title: "Sign in required",
        description: "Please sign in to access My Account.",
        type: "warning",
      }),
    }));
  });

  it("announces when a persisted session is no longer valid", () => {
    notifySessionExpired();

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      action: "add",
      options: expect.objectContaining({
        title: "Session expired",
        type: "warning",
      }),
    }));
  });

  afterAll(() => unsubscribe());
});
