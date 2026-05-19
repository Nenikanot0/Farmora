// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import { getMyCropReports, getMyWeatherReports } from '../services/api';
import { Sprout, CloudSun, ArrowRight, Map } from 'lucide-react';
import toast from 'react-hot-toast';

// Leaflet Imports for the inner widget map
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [cropReports, setCropReports] = useState([]);
  const [weatherReports, setWeatherReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cropRes, weatherRes] = await Promise.all([
        getMyCropReports(),
        getMyWeatherReports()
      ]);
      setCropReports(cropRes.data.reports || []);
      setWeatherReports(weatherRes.data.reports || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      if (error.code === 'ERR_NETWORK') {
        toast.error('Backend server not running. Please start the server on port 5000');
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={`Failed to load dashboard: ${error}`} onRetry={fetchData} />;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-70px)] bg-slate-100 px-4 py-6 md:px-8">
        <div className="max-w-6xl mx-auto space-y-5">

          <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-6 text-white shadow-xl border border-emerald-700/10 flex items-center justify-between gap-6 relative overflow-hidden">

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome back, {user?.name || 'neha'}! 👋</h1>
              <p className="mt-1.5 text-emerald-100 text-sm md:text-base">Here's your farming activity summary overview.</p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-emerald-100 font-medium">
                <span className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">🌾 {cropReports.length} Crop Audits</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">🌦️ {weatherReports.length} Risk Queries</span>
              </div>
            </div>

            <div className="relative flex flex-col items-center group">
              <div
                onClick={() => navigate('/disease-hotspots')}
                className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white/20 shadow-inner overflow-hidden cursor-pointer relative z-10 transition-transform duration-300 hover:scale-105 hover:border-white/40"
              >
                <div className="w-full h-full pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
                  <MapContainer
                    center={[20.5937, 78.9629]}
                    zoom={3.2}
                    zoomControl={false}
                    attributionControl={false}
                    scrollWheelZoom={false}
                    dragging={false}
                    className="h-full w-full"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  </MapContainer>
                </div>

                <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors duration-300 flex items-center justify-center">
                  <div className="bg-slate-900/60 p-1.5 rounded-full backdrop-blur-xs transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Map size={16} className="text-white" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/disease-hotspots')}
                className="mt-1.5 text-[11px] font-bold tracking-wide uppercase bg-white/10 px-2 py-0.5 rounded-md text-emerald-100 group-hover:text-white group-hover:bg-white/20 transition-all">
                India Map 🇮🇳
              </button>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-3xl shadow-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                    <Sprout size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Crop Reports</h2>
                </div>
                <span className="text-2xl font-black text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded-xl">{cropReports.length}</span>
              </div>
              <p className="text-slate-500 text-sm">Total crop disease analyses performed</p>

              {cropReports.length > 0 ? (
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Records</h3>
                  {cropReports.slice(0, 3).map((report) => (
                    <div key={report._id} className="flex justify-between items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-700">{report.cropType}</span>
                      <span className="text-xs text-slate-400">{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-center text-sm py-4 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">No crop reports found.</div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <CloudSun size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Weather Reports</h2>
                </div>
                <span className="text-2xl font-black text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded-xl">{weatherReports.length}</span>
              </div>
              <p className="text-slate-500 text-sm">Total weather risk analyses performed</p>

              {weatherReports.length > 0 ? (
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Records</h3>
                  {weatherReports.slice(0, 3).map((report) => (
                    <div key={report._id} className="flex justify-between items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-700">{report.crop}</span>
                        <span className="text-xs text-slate-400 block">{report.location}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wide ${report.alertLevel === 'High' || report.alertLevel === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>{report.alertLevel || 'Normal'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-center text-sm py-4 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">No weather reports found.</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-5 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Quick Utilities Workspace</h2>
            <div className="grid sm:grid-cols-3 gap-4">

              <Link to="/weather-analysis" className="group bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:bg-white hover:border-emerald-500">
                <div>
                  <div className="text-2xl mb-1">🌤️</div>
                  <div className="font-bold text-slate-800 text-sm">Weather Analysis Matrix</div>
                  <div className="text-xs text-slate-500 mt-1">Generate dynamic diagnostic data modules assessing climate environmental risks.</div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity">
                  Launch Monitor <ArrowRight size={14} />
                </div>
              </Link>

              <Link to="/crop-analysis" className="group bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:bg-white hover:border-emerald-500">
                <div>
                  <div className="text-2xl mb-1">🌾</div>
                  <div className="font-bold text-slate-800 text-sm">Crop Intelligence Lab</div>
                  <div className="text-xs text-slate-500 mt-1">Initiate deep generative neural network checks to flag plant stress indicators.</div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity">
                  Launch Scanner <ArrowRight size={14} />
                </div>
              </Link>

              <Link to="/market-analysis" className="group bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:bg-white hover:border-emerald-500">
                <div>
                  <div className="text-2xl mb-1">📈</div>
                  <div className="font-bold text-slate-800 text-sm">Market Intelligence</div>
                  <div className="text-xs text-slate-500 mt-1">Track financial trends, compare multi-state modal listings, and view live AI advice.</div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity">
                  Launch Trends <ArrowRight size={14} />
                </div>
              </Link>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;