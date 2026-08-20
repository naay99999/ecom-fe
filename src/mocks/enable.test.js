import { describe, expect, it } from "vitest";
import { shouldEnableMocks } from "./enable";

describe("shouldEnableMocks", () => {
  it("enables mocks only for an explicit development flag", () => {
    expect(shouldEnableMocks({ isDevelopment: true, flag: "true" })).toBe(true);
    expect(shouldEnableMocks({ isDevelopment: true, flag: "false" })).toBe(false);
    expect(shouldEnableMocks({ isDevelopment: false, flag: "true" })).toBe(false);
  });
});
