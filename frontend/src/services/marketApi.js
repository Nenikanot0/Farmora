import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getMarketPrices = (crop) => API.get(`/market/prices/${crop}`);

export const getBestMarket = (crop) => API.get(`/market/best-market/${crop}`);

export const getPriceTrends = (crop) => API.get(`/market/trends/${crop}`);

export const getSellAdvice = (crop) => API.get(`/market/sell-advice/${crop}`);