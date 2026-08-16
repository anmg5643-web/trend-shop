const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_ORIGIN = BASE_URL.replace(/\/api\/?$/, "");

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "حدث خطأ غير متوقع");
  }
  return data;
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// يحوّل مسار صورة نسبي (/uploads/xxx.jpg) القادم من الباك إند إلى رابط كامل
export function getFileUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${SERVER_ORIGIN}${imagePath}`;
}

// ---------- المنتجات (عام) ----------
export const getProducts = (category, search) => {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (search && search.trim()) params.set("search", search.trim());
  const qs = params.toString();
  return request(`/products${qs ? `?${qs}` : ""}`);
};

export const getProduct = (id) => request(`/products/${id}`);

// ---------- الطلبات (عام) ----------
export const createOrder = (payload) =>
  request("/orders", { method: "POST", body: JSON.stringify(payload) });

// ---------- المصادقة ----------
export const adminLogin = (username, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

// ---------- لوحة تحكم الأدمن ----------
export const getAdminProducts = (token) =>
  request("/products/admin/all", { headers: authHeaders(token) });

export const createProduct = (token, payload) =>
  request("/products", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

export const updateProduct = (token, id, payload) =>
  request(`/products/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

export const deleteProduct = (token, id) =>
  request(`/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

// يرفع ملف صورة ويرجع { imageUrl }
export async function uploadImage(token, file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/products/upload`, {
    method: "POST",
    headers: authHeaders(token), // لا نضع Content-Type يدوياً مع FormData
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "تعذر رفع الصورة");
  }
  return data;
}

export const getOrders = (token) =>
  request("/orders", { headers: authHeaders(token) });

export const updateOrderStatus = (token, id, status) =>
  request(`/orders/${id}/status`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
