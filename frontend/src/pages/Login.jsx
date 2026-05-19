// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout/Layout";
import { Mail, Lock, Sprout, ArrowRight, ShieldCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-70px)] flex items-center justify-center px-4 overflow-hidden bg-slate-100">
        <div className="w-full max-w-md scale-95 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-5 text-center text-white relative">
            <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Sprout size={28} />
            </div>

            <h1 className="text-2xl font-bold">Farmora</h1>

            <p className="text-emerald-100 text-sm mt-1 flex items-center justify-center gap-2">
              <ShieldCheck size={16} />
              Smart Farming Platform
            </p>
          </div>
          <div className="p-5">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">
              Welcome Back 👋
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 bg-slate-50">
                  <Mail size={16} className="text-slate-400 mr-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent outline-none text-sm"
                    required
                  />
                </div>
              </div>

              {/* password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 bg-slate-50">
                  <Lock size={16} className="text-slate-400 mr-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent outline-none text-sm"
                    required
                  />
                </div>
              </div>

              {/* button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-white transition-all duration-300 ${loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-green-700 hover:scale-[1.01] hover:shadow-lg"
                  }`}
              >
                {loading ? "Logging in..." : "Login"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p className="text-center mt-4 text-sm text-slate-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;