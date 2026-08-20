import { describe, expect, it } from "vitest";

import { getPostAuthPath, notifyLoginSuccess, useAuthStore } from "./index";

describe("auth public interface", () => {
  it("exports the redirect helper, login notification, and auth store", () => {
    expect(getPostAuthPath()).toBe("/account");
    expect(notifyLoginSuccess).toBeTypeOf("function");
    expect(useAuthStore).toBeTypeOf("function");
  });
});
