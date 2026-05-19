// src/pages/CropAnalysis.jsx
import React, { useState } from 'react';
import { analyzeCrop } from '../services/api';
import Layout from '../components/Layout/Layout';
import toast from 'react-hot-toast';
import { languages } from '../utils/constants';
const CropAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    cropType: '',
    symptoms: '',
    language: 'English'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cropType) {
      toast.error('Please enter crop type');
      return;
    }
    if (!formData.symptoms) {
      toast.error('Please describe the symptoms');
      return;
    }

    setLoading(true);
    const submitData = new FormData();
    submitData.append('cropType', formData.cropType);
    submitData.append('symptoms', formData.symptoms);
    submitData.append('language', formData.language);
    if (selectedImage) {
      submitData.append('cropImage', selectedImage);
    }

    try {
      const { data } = await analyzeCrop(submitData);
      setResult(data.report);
      toast.success('Analysis completed!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          🌾 Crop Disease Analysis
        </h1>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Crop Type *
              </label>
              <input
                type="text"
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Tomato, Wheat, Rice, Potato"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Symptoms Description *
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Describe symptoms (yellow spots, wilting, stunted growth...)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Crop Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {preview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-32 w-32 rounded-xl object-cover border"
                  />
                </div>
              )}
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 font-semibold text-white transition-all duration-300 ${loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-green-700 hover:scale-[1.02] hover:shadow-lg"
                }`}
            >
              {loading ? "Analyzing Disease..." : "🌱 Analyze Crop Disease"}
            </button>
          </form>
        </div>

        {/* RESULT CARD */}
        {result?.diseasePrediction && (
          <div className="bg-slate-900 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-2xl font-bold text-emerald-400 mb-6">
              🔬 Analysis Results
            </h2>

            <div className="space-y-5">
              {/* Disease */}
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                <p className="text-slate-300 text-sm">Predicted Disease</p>
                <p className="text-2xl font-bold text-red-400">
                  {result.diseasePrediction.diseaseName}
                </p>
              </div>

              {/* Causes */}
              {result.diseasePrediction.causes?.length > 0 && (
                <div className="bg-slate-800 p-4 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2 text-yellow-400">
                    📋 Causes
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {result.diseasePrediction.causes.map((cause, i) => (
                      <li key={i}>{cause}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Treatment */}
              {result.diseasePrediction.treatment?.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2 text-emerald-400">
                    💊 Treatment
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-200">
                    {result.diseasePrediction.treatment.map((treatment, i) => (
                      <li key={i}>{treatment}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prevention */}
              {result.diseasePrediction.prevention?.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2 text-blue-400">
                    🛡️ Prevention
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-200">
                    {result.diseasePrediction.prevention.map((prevention, i) => (
                      <li key={i}>{prevention}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Expert Note */}
              {result.diseasePrediction.expertNote && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2 text-amber-400">
                    📝 Expert Note
                  </h3>
                  <p className="text-slate-200">
                    {result.diseasePrediction.expertNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CropAnalysis;