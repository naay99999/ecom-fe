import { describe, expect, it } from "vitest";

import { getPostAuthPath } from "./redirect";

describe("getPostAuthPath", () => {
  it("returns the account route originally requested by the user", () => {
    expect(getPostAuthPath({ pathname: "/account/orders/123" })).toBe("/account/orders/123");
  });

  it("falls back to the account home for external or missing destinations", () => {
    expect(getPostAuthPath({ pathname: "/checkout" })).toBe("/account");
    expect(getPostAuthPath()).toBe("/account");
  });
});
