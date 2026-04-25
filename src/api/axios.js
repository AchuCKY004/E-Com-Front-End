import axios from "axios";

const BACKEND_SYSTEM_IP = "192.168.1.6"; 
const BACKEND_PORT = "5000";

// Export this so you can use it in ProductList and EditProduct for images
export const BASE_URL = `http://${BACKEND_SYSTEM_IP}:${BACKEND_PORT}`;

const Api = axios.create({
  // This handles all your GET, POST, PUT, DELETE calls
  baseURL: `${BASE_URL}/api`,
});


Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default Api;