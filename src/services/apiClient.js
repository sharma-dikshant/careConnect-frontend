import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// REQUEST INTERCEPTOR: runs before request sent to server
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("careconnect_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: runs after the response is received
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("API ERROR:", error.response?.data || error.message);
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("careconnect_token");
      localStorage.removeItem("careconnect_user");
      window.location.href = "/login";
    }
    
    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;