import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// AUTH
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// WEATHER
export const getWeatherAnalysis = (data) => API.post("/weather", data);
export const getWeatherHistory = () => API.get("/weather/history");

// CROP
export const getCropReports = () => API.get("/crop/my-reports");
export const analyzeCrop = (formData) =>
  API.post("/crop/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ADMIN
export const getAdminStats = () => API.get("/admin/dashboard");
export const getTopRiskyCrops = () => API.get("/admin/top-risky-crops");
export const getCriticalAlerts = () => API.get("/admin/critical-alerts");
export const getHighRiskAlerts = () => API.get("/admin/high-risk-alerts");
export const getMonthlyRiskTrends = () => API.get("/admin/monthly-risk-trends");

export default API;
