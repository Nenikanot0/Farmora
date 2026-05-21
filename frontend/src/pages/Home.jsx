// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';
import { Sprout, CloudSun, TrendingUp, ChevronRight, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="min-h-[calc(100vh-70px)] bg-slate-100 px-4 py-12 md:px-8 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-emerald-700 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sprout size={14} className="animate-bounce" /> Next-Gen AgTech Workspace
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-800 leading-tight">
              Welcome to <span className="bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">Farmora</span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Your AI-powered agricultural assistant platform translating real-time climate matrices and neural crop imagery into smarter farming decisions.
            </p>

            <div className="pt-4 flex justify-center items-center gap-3">
              {!user ? (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-700 hover:scale-[1.02] hover:shadow-lg text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all duration-300"
                  >
                    <LogIn size={16} /> Secure Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:scale-[1.02] font-bold text-sm px-6 py-3 rounded-2xl shadow-sm transition-all duration-300"
                  >
                    <UserPlus size={16} /> Create Account
                  </Link>
                </>
              ) : (
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-700 hover:scale-[1.02] hover:shadow-lg text-white font-bold text-sm px-7 py-3.5 rounded-2xl transition-all duration-300"
                >
                  <LayoutDashboard size={18} /> Enter Dashboard Workspace <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-4">
            
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200/80 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
              <div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
                  <CloudSun size={24} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-2">Weather Analysis Matrix</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Generate descriptive predictive modules assessing regional climate risk parameters to securely safeguard yields.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-xs font-bold text-emerald-600">
                Microclimate Tracker Active
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200/80 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
              <div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
                  <Sprout size={24} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-2">Crop Intelligence Lab</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Upload localized production leaf samples to run automated generative vision scripts flag pathogenetic stress indicators.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-xs font-bold text-emerald-600">
                Neural Diagnostician Ready
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200/80 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
              <div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 border border-amber-100">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-2">Market Intelligence</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Track terminal exchange indices, cross-reference state price listings, and parse real-time AI hold/sell advice.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-xs font-bold text-emerald-600">
                Financial Index Sync Complete
              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Home;