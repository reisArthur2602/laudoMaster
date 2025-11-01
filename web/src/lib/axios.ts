import axios from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create(baseURL);

api.interceptors.request.use((cfg) => {
  const token = Cookies.get("auth_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    return Promise.reject(err);
  }
);

export { api };
