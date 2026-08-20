import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { delay, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { createApiClient } from "./client";

const apiUrl = "https://api.example.test";

const server = setupServer(
  http.get(`${apiUrl}/products`, () =>
    HttpResponse.json({ items: [{ id: "sku_1", name: "Canvas tote" }] }),
  ),
  http.delete(`${apiUrl}/cart/items/sku_1`, () => new HttpResponse(null, { status: 204 })),
  http.get(`${apiUrl}/products/missing`, () =>
    HttpResponse.json({ message: "Product not found" }, { status: 404 }),
  ),
  http.get(`${apiUrl}/products/slow`, async () => {
    await delay(50);
    return HttpResponse.json({ id: "slow" });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("createApiClient", () => {
  const client = createApiClient({ baseUrl: apiUrl });

  it("returns a parsed JSON response from a successful request", async () => {
    await expect(client.get("/products")).resolves.toEqual({
      items: [{ id: "sku_1", name: "Canvas tote" }],
    });
  });

  it("returns undefined for a successful response with no content", async () => {
    await expect(client.delete("/cart/items/sku_1")).resolves.toBeUndefined();
  });

  it("normalizes an HTTP failure with endpoint and response data", async () => {
    await expect(client.get("/products/missing")).rejects.toMatchObject({
      name: "ApiError",
      code: "HTTP_ERROR",
      status: 404,
      endpoint: "/products/missing",
      data: { message: "Product not found" },
    });
  });

  it("normalizes a network failure", async () => {
    server.use(http.get(`${apiUrl}/products/offline`, () => HttpResponse.error()));

    await expect(client.get("/products/offline")).rejects.toMatchObject({
      name: "ApiError",
      code: "NETWORK_ERROR",
      endpoint: "/products/offline",
    });
  });

  it("normalizes a request that exceeds its timeout", async () => {
    const timedClient = createApiClient({ baseUrl: apiUrl, timeoutMs: 10 });

    await expect(timedClient.get("/products/slow")).rejects.toMatchObject({
      name: "ApiError",
      code: "TIMEOUT",
      endpoint: "/products/slow",
    });
  });
});
