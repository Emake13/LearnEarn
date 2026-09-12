"use client";

/**
 * Typed client-side fetch service.
 *
 * All client components MUST use these helpers instead of raw `fetch()`
 * so every call/response follows the same `{ ok, data?, error? }` shape.
 */

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  total?: number;
  error?: any;
  /** HTTP status, or 0 when the request never reached the server. */
  status?: number;
}

/** A hung request is aborted here rather than spinning until the host kills it. */
const REQUEST_TIMEOUT_MS = 20_000;

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    // `no-store` keeps one signed-in user's responses out of the browser cache,
    // so a different account signing in on the same device never sees them.
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      ...options,
    });
    const json = (await res.json()) as ApiResponse<T>;
    return { ...json, status: res.status };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error(`[api] request timed out: ${url}`);
      return { ok: false, error: "The server took too long to respond.", status: 0 };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      status: 0,
    };
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get<T>(url: string): Promise<ApiResponse<T>> {
    return request<T>(url);
  },

  post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },

  put<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },

  delete<T>(url: string): Promise<ApiResponse<T>> {
    return request<T>(url, { method: "DELETE" });
  },

  /**
   * POSTs multipart/form-data (file uploads).
   * The Content-Type header is deliberately omitted so the browser can add
   * the multipart boundary itself.
   */
  upload<T>(url: string, form: FormData): Promise<ApiResponse<T>> {
    return request<T>(url, { method: "POST", body: form });
  },
};
