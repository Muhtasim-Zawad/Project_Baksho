import axios from "axios";

const url = 'http://localhost:1234';

export const axiosPrivate = axios.create({
  baseURL: url,
});

axiosPrivate.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);