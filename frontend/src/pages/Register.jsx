// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout/Layout";
import { User, Mail, Lock, ShieldCheck, Sprout, ArrowRight } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(formData);
    if (success) {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-70px)] flex items-center justify-center px-4 overflow-hidden bg-slate-100">
        {/* MAIN CARD - Scale applied to fit viewport */}
        <div className="w-full max-w-4xl scale-95 grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">

          <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-emerald-600 to-green-800 text-white p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-2 rounded-2xl">
                <Sprout size={24} />
              </div>
              <h1 className="text-2xl font-bold">Farmora</h1>
            </div>
            <h2 className="text-2xl font-extrabold leading-tight mb-2">Smart Farming Platform 🌾</h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              AI-powered crop analysis, weather insights, and market predictions.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="bg-white/10 rounded-xl p-2.5">🌦️ Weather Risk Analysis</div>
              <div className="bg-white/10 rounded-xl p-2.5">🌱 Crop Disease Detection</div>
              <div className="bg-white/10 rounded-xl p-2.5">📈 Market Price Prediction</div>
            </div>
          </div>

          <div className="p-4 flex flex-col justify-center">
            <div className="text-center mb-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-2">
                <ShieldCheck className="text-emerald-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
              <p className="text-slate-500 text-sm mt-1">Join Farmora today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* name */}
              <div>
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <div className="flex items-center gap-2 mt-1 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                  <User className="text-slate-400" size={16} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full outline-none text-sm"
                    required
                  />
                </div>
              </div>

              {/* email */}
              <div>
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <div className="flex items-center gap-2 mt-1 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                  <Mail className="text-slate-400" size={16} />
                  <input
                    type="type"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full outline-none text-sm"
                    required
                  />
                </div>
              </div>

              {/* password */}
              <div>
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="flex items-center gap-2 mt-1 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                  <Lock className="text-slate-400" size={16} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="w-full outline-none text-sm"
                    required
                  />
                </div>
              </div>

              {/* role */}
              <div>
                <label className="text-sm font-semibold text-slate-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full mt-1 border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                  <option value="farmer">Farmer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-white transition-all duration-300 ${loading
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-green-700 hover:scale-[1.01] hover:shadow-lg"
                  }`}
              >
                {loading ? "Creating..." : <>Register <ArrowRight size={16} /></>}
              </button>
            </form>

            <p className="text-center mt-3 text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;