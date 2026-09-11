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
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    // `no-store` keeps one signed-in user's responses out of the browser cache,
    // so a different account signing in on the same device never sees them.
    const res = await fetch(url, { cache: "no-store", ...options });
    const json = (await res.json()) as ApiResponse<T>;
    return json;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
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
