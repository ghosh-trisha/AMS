import axios from 'axios';
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use(
  config => {
    // Add any request modifications here (e.g., auth tokens)
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    // Handle errors globally
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          toast.error("Unauthorized access. Please log in.");
          break;
        case 404:
          toast.error("Requested resource not found.");
          break;
        case 400:
          toast.error(error.response.message);
          break;
        case 500:
          toast.error("Internal server error. Please try again later.");
          break;
        default:
          toast.error("An unexpected error occurred.");
          break;
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export default api;
