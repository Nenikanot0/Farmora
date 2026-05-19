// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

//auth api
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

//crop api
export const getMyCropReports = () => api.get('/crop/my-reports');
export const analyzeCrop = (formData) =>
  api.post('/crop/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

//weather api
export const analyzeWeather = (data) => api.post('/weather', data);
export const getMyWeatherReports = () => api.get('/weather/history');

//admin api
export const getDashboardStats = () => api.get('/admin/dashboard');
export const getTopRiskyCrops = () => api.get('/admin/top-risky-crops');
export const getCityRiskTrends = () => api.get('/admin/city-risk-trends');
export const getMonthlyRiskTrends = () => api.get('/admin/monthly-risk-trends');
export const getHighRiskAlerts = () => api.get('/admin/high-risk-alerts');
export const getDiseaseCategoryAnalytics = () => api.get('/admin/disease-category-analytics');
export const getDiseaseHotspots = () => api.get('/admin/disease-hotspots');
export const getCriticalAlerts = () => api.get('/admin/critical-alerts');

export default api;