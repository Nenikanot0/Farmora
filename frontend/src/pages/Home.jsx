// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';

const Home = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-green-700 mb-4">
          Welcome to KrishiMitra
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your AI-powered agricultural assistant for smarter farming decisions
        </p>

        {!user ? (
          <div className="space-x-4">
            <Link to="/login" className="btn-primary inline-block">
              Login
            </Link>
            <Link to="/register" className="btn-secondary inline-block">
              Register
            </Link>
          </div>
        ) : (
          <Link to="/dashboard" className="btn-primary inline-block">
            Go to Dashboard
          </Link>
        )}

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="card">
            <div className="text-4xl mb-3">🌤️</div>
            <h3 className="text-xl font-semibold mb-2">Weather Analysis</h3>
            <p className="text-gray-600">
              Get AI-powered weather advice for your crops based on real-time data
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-3">🌾</div>
            <h3 className="text-xl font-semibold mb-2">Crop Disease Detection</h3>
            <p className="text-gray-600">
              Upload crop images and symptoms for instant disease diagnosis
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2">Smart Reports</h3>
            <p className="text-gray-600">
              Track all your analyses and get actionable insights
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;