const BASE_URL = "https://api.gamedev.study";

// 🔹 helper para parsear errores de la API
async function handleError(res: Response) {
  let errorData: any = {};
  try {
    errorData = await res.json();
  } catch {
    errorData = { code: "UNKNOWN", message: await res.text() };
  }

  const error: any = new Error(errorData.message || "Request failed");
  error.response = { data: errorData }; // 👈 imita estructura de Axios
  throw error;
}

export const apiClient = {
  get: async (endpoint: string) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) await handleError(res);
    return res.json();
  },

  post: async (endpoint: string, body?: any) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) await handleError(res);
    return res.json();
  },

  put: async (endpoint: string, body?: any) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) await handleError(res);
    return res.json();
  },

  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include",
      body: formData,
    });

    if (!res.ok) await handleError(res);
    return res.json();
  },

  delete: async (endpoint: string) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) await handleError(res);
    return res.json();
  },

  googleOAuthUrl: () => `${BASE_URL}/auth/google/login`,
  githubOAuthUrl: () => `${BASE_URL}/auth/github/login`,
};
