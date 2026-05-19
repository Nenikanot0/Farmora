// src/pages/WeatherAnalysis.jsx
import React, { useState } from 'react';
import { analyzeWeather } from '../services/api';
import Layout from '../components/Layout/Layout';
import toast from 'react-hot-toast';
import { languages } from '../utils/constants'
const WeatherAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    village: '',
    city: '',
    district: '',
    crop: '',
    stage: 'vegetative',
    language: 'English'
  });

  const stages = ['seedling', 'vegetative', 'flowering', 'harvest'];
  // const languages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.village && !formData.city && !formData.district) {
      toast.error('Please provide at least one location field');
      return;
    }
    if (!formData.crop) {
      toast.error('Please enter crop type');
      return;
    }

    setLoading(true);
    try {
      const { data } = await analyzeWeather(formData);
      setResult(data.savedReport);
      toast.success('Analysis completed!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskScore) => {
    if (riskScore === 'High') return 'text-red-600 bg-red-50';
    if (riskScore === 'Moderate') return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getAlertColor = (level) => {
    if (level === 'Critical') return 'bg-red-100 border-red-500 text-red-700';
    if (level === 'Warning') return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    return 'bg-green-100 border-green-500 text-green-700';
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-extrabold mb-8 text-slate-800 flex items-center gap-3">
          🌤️ Weather Risk Analysis
        </h1>

        {/* FORM CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Village Name</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g., Mhaswad"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">City Name</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g., Pune"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">District Name</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g., Satara"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Crop Type *</label>
                <input
                  type="text"
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g., Wheat, Rice, Tomato"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Growth Stage</label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {stages.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
                >
                  {languages.map((l) => (
                    /* FIXED: Accessing .value for the key/HTML attribute, and .label for the visual dropdown text */
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-8 rounded-2xl py-4 font-bold text-lg text-white transition-all duration-300 ${loading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-green-700 hover:scale-[1.01] hover:shadow-xl"
                }`}
            >
              {loading ? "Analyzing Weather Data..." : "🌦️ Get Weather Risk Analysis"}
            </button>
          </form>
        </div>

        {/* RESULT SECTION */}
        {result && (
          <div className="space-y-8">

            {/* ALERT */}
            <div className={`rounded-2xl shadow-md border-l-8 p-5 ${getAlertColor(result.alertLevel)}`}>
              <h3 className="text-2xl font-bold">
                🚨 Alert Level: {result.alertLevel}
              </h3>
            </div>

            {/* WEATHER DETAILS */}
            <div className="bg-slate-900 text-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">📍 Location & Weather Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <InfoBox title="Location" value={result.location} />
                <InfoBox title="Temperature" value={`${result.weatherData.temperature}°C`} />
                <InfoBox title="Humidity" value={`${result.weatherData.humidity}%`} />
                <InfoBox title="Wind Speed" value={`${result.weatherData.windSpeed} m/s`} />
                <div className="md:col-span-2">
                  <InfoBox title="Weather Condition" value={result.weatherData.weather} />
                </div>
              </div>
            </div>

            {/* FARMING ANALYSIS */}
            <div className="bg-slate-900 text-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">🌾 Farming Analysis</h2>

              <div className="space-y-6">

                <div className={`inline-block px-5 py-2 rounded-full text-lg font-bold ${getRiskColor(result.farmingAnalysis.riskScore)}`}>
                  Risk Score: {result.farmingAnalysis.riskScore} ({result.farmingAnalysis.riskPercentage}%)
                </div>

                <div className="bg-white/10 rounded-2xl p-5">
                  <p className="text-slate-300">Disease Category</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {result.farmingAnalysis.diseaseCategory}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-5">
                  <h3 className="text-lg font-semibold mb-3">⚠️ Identified Risks</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-200">
                    {result.farmingAnalysis.risks?.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-500/20 border border-emerald-400 rounded-2xl p-5">
                  <h3 className="font-bold text-emerald-300 text-lg mb-2">💧 Irrigation Advice</h3>
                  <p>{result.farmingAnalysis.irrigationAdvice}</p>
                </div>

                <div className="bg-yellow-500/20 border border-yellow-400 rounded-2xl p-5">
                  <h3 className="font-bold text-yellow-300 text-lg mb-2">🌿 Pesticide Advice</h3>
                  <p>{result.farmingAnalysis.pesticideAdvice}</p>
                </div>

                <div className="bg-blue-500/20 border border-blue-400 rounded-2xl p-5">
                  <h3 className="font-bold text-blue-300 text-lg mb-2">🛡️ Crop Safety Advice</h3>
                  <p>{result.farmingAnalysis.cropSafetyAdvice}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
function InfoBox({ title, value }) {
  return (
    <div className="bg-white/10 rounded-2xl p-4">
      <p className="text-slate-300 text-sm">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
export default WeatherAnalysis;