const API_URL = "https://cyberaware-backend-lvfr.onrender.com/api";
// Get the saved JWT token
export function getToken() {
    return localStorage.getItem("token");
}
// Save JWT token after login
export function setToken(token: string) {
     localStorage.setItem("token", token)
}
// Remove JWT token during logout
export function clearToken() {
    localStorage.removeItem("token")
}
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;

  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}