// src/pages/MarketAnalysis.jsx
import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import {getMarketPrices,getBestMarket,getPriceTrends,getSellAdvice} from "../services/marketApi";
import toast from "react-hot-toast";
import { TrendingUp, Award, Brain, BarChart3, Search, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const MarketAnalysis = () => {
  const [crop, setCrop] = useState("");
  const [loading, setLoading] = useState(false);

  const [prices, setPrices] = useState([]);
  const [bestMarket, setBestMarket] = useState(null);
  const [trends, setTrends] = useState([]);
  const [advice, setAdvice] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!crop) return toast.error("Enter crop name");

    setLoading(true);
    try {
      const [pricesRes, bestRes, trendsRes, adviceRes] = await Promise.all([
        getMarketPrices(crop),
        getBestMarket(crop),
        getPriceTrends(crop),
        getSellAdvice(crop),
      ]);

      setPrices(pricesRes.data || []);
      setBestMarket(bestRes.data);

      const formattedTrends = (trendsRes.data || []).map((item) => ({
        date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        price: item.modalPrice,
      }));

      setTrends(formattedTrends);
      setAdvice(adviceRes.data?.aiAdvice);

      toast.success("Market analysis complete!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Analysis metrics generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-70px)] bg-slate-100 px-4 py-6 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6">

          <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-6 text-white shadow-xl border border-emerald-700/10 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
                📈 Crop Market Intelligence
              </h1>
              <p className="mt-1.5 text-emerald-100 text-sm md:text-base">
                Query agricultural terminal indexes to maximize financial yields with real-time analytics.
              </p>
            </div>
            <div className="hidden sm:block opacity-20 p-2">
              <TrendingUp size={56} />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-5 border border-slate-200">
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative flex items-center">
                <Search size={18} className="absolute left-4 text-slate-400" />
                <input
                  type="text"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="Search market metrics (e.g., Tomato, Wheat, Rice)..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`sm:w-48 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 ${loading
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-green-700 hover:scale-[1.01] hover:shadow-lg"
                  }`}
              >
                {loading ? "Analyzing..." : "Analyze Market"}
              </button>
            </form>
          </div>

          {bestMarket ? (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-slate-900 text-white rounded-3xl shadow-xl p-5 flex flex-col justify-between border border-slate-800">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                      <Award size={20} />
                    </div>
                    <h2 className="text-lg font-bold">Optimal Sales Terminal Location</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <InfoBox title="Terminal Market" value={bestMarket.market} />
                    <InfoBox title="Regional State" value={bestMarket.state} />
                    <InfoBox title="District Jurisdiction" value={bestMarket.district} />
                    <InfoBox title="Modal Baseline Price" value={`₹${bestMarket.modalPrice}`} highlight />
                    <InfoBox title="Floor Min Price" value={`₹${bestMarket.minPrice}`} />
                    <InfoBox title="Ceiling Max Price" value={`₹${bestMarket.maxPrice}`} />
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-5 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Brain size={20} />
                    </div>
                    <h2 className="text-base font-bold text-slate-800">Neural Predictive Strategy</h2>
                  </div>

                  <div className="flex-1 bg-gradient-to-br from-emerald-50/50 to-teal-50/20 border border-emerald-100/70 rounded-2xl p-4 flex flex-col justify-center">
                    <p className="text-sm text-slate-600 italic leading-relaxed font-medium">
                      {advice ? `"${advice}"` : "Insufficient descriptive parameters to output advice."}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                    <AlertCircle size={12} /> Generative Advice Model
                  </div>
                </div>

              </div>

              <div className="bg-white rounded-3xl shadow-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <BarChart3 size={20} />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">Historical Price Trend Curve</h2>
                </div>

                <div className="h-[280px] w-full pr-4">
                  {trends.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trends} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }} />
                        <Line
                          type="monotone"
                          dataKey="price"
                          name="Modal Market Price"
                          stroke="#059669"
                          strokeWidth={3}
                          activeDot={{ r: 6 }}
                          dot={{ r: 3, strokeWidth: 1 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                      No historical metrics registered to format active graphs.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-5 border border-slate-200">
                <h2 className="text-base font-bold text-slate-800 mb-4 px-1">Alternative Tracked Market Indices</h2>
                <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-inner">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                      <thead className="text-xs uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="py-3 px-4 font-bold">Market Name</th>
                          <th className="py-3 px-4 font-bold">State Location</th>
                          <th className="py-3 px-4 font-bold">District Node</th>
                          <th className="py-3 px-4 font-bold text-right">Modal Index Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                        {prices.map((item, idx) => (
                          <tr key={item._id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-bold text-slate-800">{item.market}</td>
                            <td className="py-3 px-4">{item.state}</td>
                            <td className="py-3 px-4">{item.district}</td>
                            <td className="py-3 px-4 text-right font-bold text-emerald-600">₹{item.modalPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center text-sm py-16 text-slate-400 bg-white rounded-3xl shadow-xl border border-dashed border-slate-200">
              Input an active production commodity metric asset title above to run predictive telemetry graphs.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const InfoBox = ({ title, value, highlight }) => (
  <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between">
    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">{title}</span>
    <span className={`text-base font-extrabold truncate mt-0.5 ${highlight ? "text-emerald-400 text-lg" : "text-slate-200"}`}>
      {value || "—"}
    </span>
  </div>
);

export default MarketAnalysis;