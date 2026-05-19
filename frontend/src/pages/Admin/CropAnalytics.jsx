import React, { useEffect, useState } from 'react';
import { getTopRiskyCrops, getCityRiskTrends, getDiseaseCategoryAnalytics } from '../../services/api';
import Layout from '../../components/Layout/Layout';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CropAnalytics = () => {
  const [topRiskyCrops, setTopRiskyCrops] = useState([]);
  const [cityRisks, setCityRisks] = useState([]);
  const [diseaseStats, setDiseaseStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cropsRes, cityRes, diseaseRes] = await Promise.all([
        getTopRiskyCrops(),
        getCityRiskTrends(),
        getDiseaseCategoryAnalytics()
      ]);
      setTopRiskyCrops(cropsRes.data);
      setCityRisks(cityRes.data);
      setDiseaseStats(diseaseRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const COLORS = ['#ef4444', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">📈 Crop Analytics</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Top 5 Risky Crops</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topRiskyCrops}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageRisk" fill="#ef4444" name="Average Risk (%)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {topRiskyCrops.map((crop, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">{crop._id}</span>
                  <span className="text-red-600">{Math.round(crop.averageRisk)}% risk</span>
                  <span className="text-gray-500 text-sm">{crop.totalReports} reports</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">City Risk Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityRisks.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageRisk" fill="#22c55e" name="Average Risk (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Disease Category Distribution</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={diseaseStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={entry => `${entry._id}: ${entry.totalCases}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalCases"
                  >
                    {diseaseStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {diseaseStats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold">{stat._id || 'Unknown'}</span>
                    <span className="text-green-600">{stat.totalCases} cases</span>
                    <span className="text-gray-500">{Math.round(stat.averageRisk)}% avg risk</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CropAnalytics;