import { describe, expect, it } from "vitest";
import { ApiError } from "./api/client";
import { shouldRetryQuery } from "./queryClient";

describe("shouldRetryQuery", () => {
  it("does not retry client-side HTTP failures", () => {
    expect(shouldRetryQuery(0, new ApiError("Missing", { status: 404, code: "HTTP_ERROR" }))).toBe(false);
  });

  it("retries a transient network failure twice", () => {
    const error = new ApiError("Offline", { code: "NETWORK_ERROR" });

    expect(shouldRetryQuery(0, error)).toBe(true);
    expect(shouldRetryQuery(1, error)).toBe(true);
    expect(shouldRetryQuery(2, error)).toBe(false);
  });
});
