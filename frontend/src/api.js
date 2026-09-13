const API = "";

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

export const api = {
  templates: () => request("/api/templates"),
  template: (id) => request(`/api/templates/${id}`),
  recommend: (body) => request("/api/ai/recommend", { method: "POST", body: JSON.stringify(body) }),
  generate: (body) => request("/api/ai/generate", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  saveWish: (body) => request("/api/wishes", { method: "POST", body: JSON.stringify(body) }),
  updateWish: (id, body) => request(`/api/wishes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  getWish: (id) => request(`/api/wishes/${id}`),
  getByShare: (code) => request(`/api/share/${code}`),
  myWishes: (userId) => request(`/api/wishes?userId=${userId}`),
  upload: async (files) => {
    const form = new FormData();
    [...files].forEach((f) => form.append("files", f));
    const res = await fetch("/api/uploads", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data;
  },
  publish: async (html, filename, wishId) => {
    const form = new FormData();
    form.append("file", new Blob([html], { type: "text/html" }), filename || "wish.html");
    if (wishId) form.append("wishId", String(wishId));
    const res = await fetch("/api/publish", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Publish failed");
    return data;
  },
};

export function authStore() {
  const raw = localStorage.getItem("wishlite-user");
  return raw ? JSON.parse(raw) : null;
}

export function setAuth(user) {
  if (user) localStorage.setItem("wishlite-user", JSON.stringify(user));
  else localStorage.removeItem("wishlite-user");
}
