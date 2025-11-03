import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((cfg) => {
  const token = Cookies.get("laudoMaster_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (response) => response,

  (err) => {
    const message = err.response?.data?.message;
    toast.error(message || "Ocorreu um erro inesperado.");

    return Promise.reject(err);
  }
);

export { api };
