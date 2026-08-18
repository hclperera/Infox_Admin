const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  if (typeof window === "undefined") return { "Content-Type": "application/json" };
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function adminLogin(username, password) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function getStats() {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getUsers(page = 1, perPage = 20, search = "") {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
    search,
  });
  const res = await fetch(`${API_URL}/admin/users?${params}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getUserDetail(userId) {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function deleteUser(userId) {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getSignupTrend() {
  const res = await fetch(`${API_URL}/admin/signup-trend`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getAuditLogs(page = 1, perPage = 20) {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  const res = await fetch(`${API_URL}/admin/audit-logs?${params}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}
