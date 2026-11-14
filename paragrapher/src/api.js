const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api/v1").replace(/\/$/, "");
let csrfToken = "";

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function decode(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(payload?.error?.message || "در ارتباط با سرور مشکلی پیش آمد.", response.status, payload);
  }
  return payload?.data ?? payload;
}

async function refreshCsrf() {
  const response = await fetch(`${API_BASE}/auth/csrf`, { credentials: "include" });
  const data = await decode(response);
  csrfToken = data.csrf_token;
  return csrfToken;
}

async function request(path, options = {}, retried = false) {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});
  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body !== "string") {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }
  if (!new Set(["GET", "HEAD", "OPTIONS"]).has(method)) {
    if (!csrfToken) await refreshCsrf();
    headers.set("X-CSRF-Token", csrfToken);
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    method,
    headers,
    body,
    credentials: "include",
  });
  if (response.status === 403 && !retried) {
    const error = await response.clone().json().catch(() => ({}));
    if (error?.error?.code === "csrf_failed") {
      await refreshCsrf();
      return request(path, options, true);
    }
  }
  return decode(response);
}

export const api = {
  get: (path) => request(path),
  post: (path, data = {}) => request(path, { method: "POST", body: data }),
  put: (path, data = {}) => request(path, { method: "PUT", body: data }),
  patch: (path, data = {}) => request(path, { method: "PATCH", body: data }),
  delete: (path) => request(path, { method: "DELETE" }),
  upload: (path, file) => {
    const form = new FormData();
    form.append("file", file);
    return request(path, { method: "POST", body: form });
  },
  async login(data) {
    const result = await request("/auth/login", { method: "POST", body: data });
    csrfToken = result.csrf_token;
    return result.user;
  },
  async register(data) {
    const result = await request("/auth/register", { method: "POST", body: data });
    csrfToken = result.csrf_token;
    return result.user;
  },
  async logout() {
    await request("/auth/logout", { method: "POST", body: {} });
    csrfToken = "";
  },
  async session() {
    await refreshCsrf();
    return request("/auth/me");
  },
  assetUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `${new URL(API_BASE).origin}${path.startsWith("/") ? path : `/${path}`}`;
  },
};

export { API_BASE };
