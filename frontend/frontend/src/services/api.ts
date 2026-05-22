import axios, { type AxiosRequestHeaders } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
})

api.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  if (token === "undefined" || token === "null") {
    localStorage.removeItem("token");
    token = null;
  }
  if (token) {
    if (!config.headers) config.headers = {} as AxiosRequestHeaders;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});