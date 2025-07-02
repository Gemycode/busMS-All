import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // عدلها إذا كان لديك عنوان آخر للـ backend
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    if (error.response?.status === 403) {
      alert("ليس لديك صلاحية للوصول إلى هذا الجزء من النظام.");
    }
    return Promise.reject(error);
  }
);

export default api;
