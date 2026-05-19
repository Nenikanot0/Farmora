// src/pages/Admin/DiseaseHotspots.jsx
import React, { useEffect, useState } from 'react';
import { getDiseaseHotspots } from '../services/api';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import DiseaseMap from "./DiseaseMap";
import { Flame, Map, MapPin, AlertCircle } from 'lucide-react';

const DiseaseHotspots = () => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotspots();
  }, []);

  const fetchHotspots = async () => {
    try {
      const res = await getDiseaseHotspots();
      setHotspots(res.data);
    } catch (error) {
      console.error('Error fetching hotspots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-70px)] bg-slate-100 px-4 py-6 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6">

          <div className="bg-gradient-to-r from-red-600 to-amber-700 rounded-3xl p-6 text-white shadow-xl border border-red-700/10 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
                <Flame size={28} className="animate-pulse" /> Outbreak Intelligence Dashboard
              </h1>
              <p className="mt-1.5 text-red-100 text-sm md:text-base">
                Real-time regional telemetry mapping critical crop infections and localized threat metrics.
              </p>
            </div>
            <div className="hidden sm:block opacity-20 p-2">
              <Map size={56} />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-4 border border-slate-200 overflow-hidden relative z-10">
            <div className="mb-3 px-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                🌐 Geospatial Proximity Matrix
              </h2>
              <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-md font-bold">
                Live Spatial Node Mapping
              </span>
            </div>

            <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-inner relative z-10 isolation-auto">
              <DiseaseMap />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 px-1">Detailed Risk Registry</h2>

            {hotspots.length === 0 ? (
              <div className="text-center text-sm py-12 text-slate-400 bg-white rounded-3xl shadow-xl border border-dashed border-slate-200">
                No systemic threat matrices logged. Region reports clear environmental metrics.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {hotspots.map((hotspot, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl shadow-md p-5 border border-slate-200/80 border-l-4 border-l-red-500 flex flex-col justify-between transition-all duration-300 hover:scale-[1.005] hover:shadow-xl"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-1.5">
                          <MapPin size={16} className="text-slate-400" /> {hotspot._id.location}
                        </h3>
                        <p className="text-sm text-slate-500 font-semibold">
                          Disease Profile: <span className="text-red-600">{hotspot._id.disease}</span>
                        </p>
                      </div>
                      <div className="bg-red-50 text-red-600 border border-red-100 rounded-2xl px-3 py-1.5 text-center min-w-[70px]">
                        <span className="block text-xl font-black leading-none">{hotspot.cases}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">cases</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-bold">
                      <div className="bg-amber-50 border border-amber-200/60 text-amber-700 px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <AlertCircle size={13} /> Avg Risk Index: {Math.round(hotspot.averageRisk)}%
                      </div>
                      {hotspot.coordinates && (
                        <div className="bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1.5 rounded-xl">
                          📍 {hotspot.coordinates.lat?.toFixed(4)}, {hotspot.coordinates.lng?.toFixed(4)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default DiseaseHotspots;