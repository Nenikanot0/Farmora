// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WeatherAnalysis from './pages/WeatherAnalysis';
import CropAnalysis from './pages/CropAnalysis';
import MyReports from './pages/MyReports';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import RiskAlerts from './pages/Admin/RiskAlerts';
import CropAnalytics from './pages/Admin/CropAnalytics';
import DiseaseHotspots from "./pages/DiseaseHotspots";
import MarketAnalysis from './pages/MarketAnalysis';
function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/weather-analysis" element={
            <ProtectedRoute>
              <WeatherAnalysis />
            </ProtectedRoute>
          } />
          
          <Route path="/crop-analysis" element={
            <ProtectedRoute>
              <CropAnalysis />
            </ProtectedRoute>
          } />
          
          <Route path="/market-analysis" element={
            <ProtectedRoute>
              <MarketAnalysis />
            </ProtectedRoute>
          } />

          <Route path="/my-reports" element={
            <ProtectedRoute>
              <MyReports />
            </ProtectedRoute>
          } />
          
          <Route path="/disease-hotspots" element={
            <ProtectedRoute>
              <DiseaseHotspots />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/risk-alerts" element={
            <ProtectedRoute adminOnly={true}>
              <RiskAlerts />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/crop-analytics" element={
            <ProtectedRoute adminOnly={true}>
              <CropAnalytics />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;