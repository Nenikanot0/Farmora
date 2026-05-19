// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { getDashboardStats, getMonthlyRiskTrends } from '../../services/api';
import Layout from '../../components/Layout/Layout';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, trendsRes] = await Promise.all([
        getDashboardStats(),
        getMonthlyRiskTrends()
      ]);
      setStats(statsRes.data);
      setMonthlyTrends(trendsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const chartData = monthlyTrends.map(item => ({
    month: `${item._id.month}/${item._id.year}`,
    avgRisk: item.avgRisk,
    highRiskCount: item.highRiskReports
  }));

  const pieData = stats?.avgRisk?.[0]?.averageRisk ? [
    { name: 'Average Risk', value: stats.avgRisk[0].averageRisk },
    { name: 'Safe (100 - avg)', value: 100 - stats.avgRisk[0].averageRisk }
  ] : [];

  const COLORS = ['#ef4444', '#22c55e'];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">📊 Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-3xl mb-2">👨‍🌾</div>
            <div className="text-2xl font-bold text-green-600">{stats?.totalFarmers || 0}</div>
            <div className="text-gray-600">Total Farmers</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-2xl font-bold text-green-600">{stats?.totalReports || 0}</div>
            <div className="text-gray-600">Total Reports</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-green-600">{Math.round(stats?.avgRisk?.[0]?.averageRisk || 0)}%</div>
            <div className="text-gray-600">Average Risk</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-red-600">{stats?.highRiskAlert || 0}</div>
            <div className="text-gray-600">High Risk Alerts</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Monthly Risk Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgRisk" stroke="#22c55e" name="Avg Risk (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Overall Risk Distribution</h2>
            {stats?.avgRisk?.[0]?.averageRisk && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Monthly Risk Reports</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="highRiskCount" fill="#ef4444" name="High Risk Reports" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;