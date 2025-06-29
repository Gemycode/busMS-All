import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // عدلها إذا كان لديك عنوان آخر للـ backend
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user");
    if (token && token !== "undefined") {
      config.headers["Authorization"] = `Bearer ${token.token}`;
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
    return Promise.reject(error);
  }
);

export default api;
