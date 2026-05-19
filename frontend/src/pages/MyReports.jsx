// src/pages/MyReports.jsx
import React, { useEffect, useState } from 'react';
import { getMyCropReports, getMyWeatherReports } from '../services/api';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { FileText, CloudSun, Sprout, AlertTriangle, Calendar, MapPin, Sparkles } from 'lucide-react';

const MyReports = () => {
  const [activeTab, setActiveTab] = useState('weather');
  const [weatherReports, setWeatherReports] = useState([]);
  const [cropReports, setCropReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [weatherRes, cropRes] = await Promise.all([
        getMyWeatherReports(),
        getMyCropReports()
      ]);
      setWeatherReports(weatherRes.data.reports || []);
      setCropReports(cropRes.data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertStyles = (level) => {
    switch (level) {
      case 'Critical':
      case 'High':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'Warning':
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-70px)] bg-slate-100 px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6">

          <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-6 text-white shadow-xl border border-emerald-700/10 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
                📋 Historical Report Vault
              </h1>
              <p className="mt-1.5 text-emerald-100 text-sm md:text-base">
                Review and track your saved AI diagnostics and climate history analytics.
              </p>
            </div>
            <div className="hidden sm:block opacity-20 p-2">
              <FileText size={56} />
            </div>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-md border border-slate-200/60 flex gap-2">
            <button
              onClick={() => setActiveTab('weather')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === 'weather'
                ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
            >
              <CloudSun size={18} />
              Weather Reports ({weatherReports.length})
            </button>
            <button
              onClick={() => setActiveTab('crop')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === 'crop'
                ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
            >
              <Sprout size={18} />
              Crop Reports ({cropReports.length})
            </button>
          </div>

          <div className="space-y-4">

            {activeTab === 'weather' && (
              weatherReports.length === 0 ? (
                <div className="text-center text-sm py-12 text-slate-400 bg-white rounded-3xl shadow-xl border border-dashed border-slate-200">
                  No weather risk profiles logged. Go to the Weather Matrix to generate data blocks.
                </div>
              ) : (
                weatherReports.map((report) => (
                  <div key={report._id} className="bg-white rounded-3xl shadow-xl p-5 border border-slate-200 transition-all duration-300 hover:scale-[1.005] hover:shadow-2xl">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="text-xl">🌾</span> {report.crop}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-semibold">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {report.location}</span>
                          <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(report.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border ${getAlertStyles(report.alertLevel)}`}>
                        {report.alertLevel || 'Normal'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/40">
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Threat Metrics</span>
                        <span className="text-sm font-extrabold text-slate-700">
                          Risk Index: <span className="text-emerald-600">{report.farmingAnalysis?.riskScore || 0}</span> ({report.farmingAnalysis?.riskPercentage || 0}%)
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/40">
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Stress Classification</span>
                        <span className="text-sm font-extrabold text-slate-700 block truncate">
                          {report.farmingAnalysis?.diseaseCategory || 'No Risks Identified'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}

            {activeTab === 'crop' && (
              cropReports.length === 0 ? (
                <div className="text-center text-sm py-12 text-slate-400 bg-white rounded-3xl shadow-xl border border-dashed border-slate-200">
                  No crop disease analyses captured. Boot the Crop Scanner component to upload samples.
                </div>
              ) : (
                cropReports.map((report) => (
                  <div key={report._id} className="bg-white rounded-3xl shadow-xl p-5 border border-slate-200 transition-all duration-300 hover:scale-[1.005] hover:shadow-2xl">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Sprout size={16} /></span>
                          {report.cropType} Diagnostic
                        </h3>
                        <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold mt-1">
                          <Calendar size={14} /> {new Date(report.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Observed Symptoms</span>
                        <p className="text-sm text-slate-600 italic leading-relaxed">"{report.symptoms || 'No manual notes specified.'}"</p>
                      </div>

                      {report.diseasePrediction && (
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-3 flex gap-2.5 items-start">
                          <div className="text-red-500 mt-0.5"><AlertTriangle size={16} /></div>
                          <div>
                            <span className="block text-xs font-bold uppercase tracking-wider text-red-500/70">Neural Network Inference</span>
                            <p className="text-sm font-extrabold text-red-700">{report.diseasePrediction.diseaseName}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyReports;