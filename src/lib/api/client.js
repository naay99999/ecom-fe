const DEFAULT_BASE_URL = "/api";
const DEFAULT_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  constructor(message, { code, status, endpoint, data, cause } = {}) {
    super(message, { cause });
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.endpoint = endpoint;
    this.data = data;
  }
}

function getTimeout(timeoutMs) {
  const parsedTimeout = Number(timeoutMs);
  return Number.isFinite(parsedTimeout) && parsedTimeout > 0
    ? parsedTimeout
    : DEFAULT_TIMEOUT_MS;
}

function createUrl(baseUrl, endpoint, query) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(
    `${normalizedBaseUrl}${normalizedEndpoint}`,
    typeof window === "undefined" ? "http://localhost" : window.location.origin,
  );

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, String(item)));
    } else {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

function isJsonBody(body) {
  return body !== undefined &&
    body !== null &&
    typeof body === "object" &&
    !(body instanceof Blob) &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams);
}

async function parseResponseBody(response) {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || undefined;
}

function getErrorMessage(status, data) {
  if (data && typeof data === "object" && typeof data.message === "string") {
    return data.message;
  }

  return status >= 500 ? "The server could not process the request." : "The request could not be completed.";
}

export function createApiClient({
  baseUrl = DEFAULT_BASE_URL,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  const request = async (endpoint, options = {}) => {
    const {
      body,
      headers,
      method = "GET",
      query,
      signal: callerSignal,
    } = options;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), getTimeout(timeoutMs));
    const abortFromCaller = () => controller.abort(callerSignal?.reason);

    if (callerSignal) callerSignal.addEventListener("abort", abortFromCaller, { once: true });

    try {
      const jsonBody = isJsonBody(body);
      const response = await fetch(createUrl(baseUrl, endpoint, query), {
        method,
        body: jsonBody ? JSON.stringify(body) : body,
        signal: controller.signal,
        // Auth relies on an httpOnly refresh cookie (see features/auth) — the
        // browser attaches/receives it automatically, JS never touches it.
        credentials: "include",
        headers: {
          Accept: "application/json",
          ...(jsonBody ? { "Content-Type": "application/json" } : {}),
          ...headers,
        },
      });
      const data = await parseResponseBody(response);

      if (!response.ok) {
        throw new ApiError(getErrorMessage(response.status, data), {
          code: "HTTP_ERROR",
          status: response.status,
          endpoint,
          data,
        });
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;

      const code = controller.signal.aborted
        ? (callerSignal?.aborted ? "REQUEST_ABORTED" : "TIMEOUT")
        : "NETWORK_ERROR";
      const message = code === "TIMEOUT"
        ? "The request timed out."
        : code === "REQUEST_ABORTED"
          ? "The request was cancelled."
          : "A network error prevented the request from completing.";

      throw new ApiError(message, { code, endpoint, cause: error });
    } finally {
      clearTimeout(timeout);
      if (callerSignal) callerSignal.removeEventListener("abort", abortFromCaller);
    }
  };

  return {
    request,
    get: (endpoint, options) => request(endpoint, { ...options, method: "GET" }),
    post: (endpoint, body, options) => request(endpoint, { ...options, body, method: "POST" }),
    put: (endpoint, body, options) => request(endpoint, { ...options, body, method: "PUT" }),
    patch: (endpoint, body, options) => request(endpoint, { ...options, body, method: "PATCH" }),
    delete: (endpoint, options) => request(endpoint, { ...options, method: "DELETE" }),
  };
}

export const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL,
  timeoutMs: import.meta.env.VITE_API_TIMEOUT_MS || DEFAULT_TIMEOUT_MS,
});
