// src/pages/Admin/RiskAlerts.jsx
import React, { useEffect, useState } from 'react';
import { getHighRiskAlerts, getCriticalAlerts } from '../../services/api';
import Layout from '../../components/Layout/Layout';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const RiskAlerts = () => {
  const [highRiskAlerts, setHighRiskAlerts] = useState([]);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('high');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const [highRes, criticalRes] = await Promise.all([
        getHighRiskAlerts(),
        getCriticalAlerts()
      ]);
      setHighRiskAlerts(highRes.data);
      setCriticalAlerts(criticalRes.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const alerts = activeTab === 'high' ? highRiskAlerts : criticalAlerts;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">⚠️ Risk Alerts</h1>

        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('high')}
            className={`px-4 py-2 font-semibold ${activeTab === 'high' ? 'border-b-2 border-yellow-600 text-yellow-600' : 'text-gray-500'}`}
          >
            High Risk Alerts ({highRiskAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`px-4 py-2 font-semibold ${activeTab === 'critical' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
          >
            Critical Alerts ({criticalAlerts.length})
          </button>
        </div>

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="card text-center text-gray-500">No alerts found</div>
          ) : (
            alerts.map((alert) => (
              <div key={alert._id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{alert.crop} at {alert.location}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${alert.alertLevel === 'Critical' ? 'bg-red-100 text-red-700 font-bold' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {alert.alertLevel || 'High Risk'}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-gray-600">Risk: {alert.farmingAnalysis?.riskScore} ({alert.farmingAnalysis?.riskPercentage}%)</p>
                  <p className="text-gray-600">Disease: {alert.farmingAnalysis?.diseaseCategory}</p>
                  <div className="mt-2 text-sm">
                    <p className="font-semibold">Advice:</p>
                    <p className="text-gray-700">{alert.farmingAnalysis?.cropSafetyAdvice}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RiskAlerts;