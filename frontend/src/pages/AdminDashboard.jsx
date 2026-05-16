import { useEffect, useState, useMemo } from "react";
import { Search, LayoutDashboard, Users, FileText, Activity, Settings, ExternalLink } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell 
} from "recharts";
import { getAdminStats, getTopRiskyCrops, getCriticalAlerts, getWeatherHistory } from "../services/api";

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

export default function AdminDashboard() {
  const [data, setData] = useState({ stats: null, topCrops: [], critical: [], history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stats, crops, crit, weather] = await Promise.all([
          getAdminStats(), getTopRiskyCrops(), getCriticalAlerts(), getWeatherHistory()
        ]);
        setData({
          stats: stats.data,
          topCrops: crops.data || [],
          critical: crit.data || [],
          history: weather.data.reports || []
        });
      } catch (e) { console.error("Load failed", e); }
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-slate-700">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-amber-500 p-1.5 rounded-lg text-white"><Activity size={20} /></div>
          <span className="font-bold text-lg tracking-tight text-white">Farmora</span>
        </div>
        
        <nav className="space-y-1 flex-1">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Admin Dashboard" active />
          <NavItem icon={<Users size={18}/>} label="Farmers List" />
          <NavItem icon={<FileText size={18}/>} label="Reports Feed" />
          <NavItem icon={<Activity size={18}/>} label="Disease Analytics" />
          <NavItem icon={<Settings size={18}/>} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-slate-700 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-500" />
          <div className="text-xs">
            <p className="text-white font-medium">Admin User</p>
            <p className="opacity-50">Settings</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-slate-800">Dashboard Overview</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input className="bg-white border rounded-md pl-10 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 ring-blue-500/20" placeholder="Search" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pt-2 space-y-6">
          {/* STAT CARDS */}
          <div className="grid grid-cols-4 gap-6">
            <StatCard title="TOTAL FARMERS" value={data.stats?.totalFarmers} icon="🧑‍🌾" color="bg-orange-50" />
            <StatCard title="TOTAL REPORTS" value={data.stats?.totalReports} icon="📋" color="bg-orange-50" />
            <StatCard title="SYSTEM-WIDE AVG RISK" isRisk value={data.stats?.avgRisk?.[0]?.averageRisk} icon="⚠️" color="bg-orange-50" />
            <StatCard title="HIGH-RISK ALERTS" value={data.stats?.highRiskAlert} icon="🚨" color="bg-red-100" textColor="text-red-600" />
          </div>

          {/* MIDDLE ROW: Trends & Top Crops */}
          <div className="grid grid-cols-3 gap-6 h-80">
            <div className="col-span-2 bg-white rounded-xl border p-5 shadow-sm">
              <h3 className="text-sm font-bold mb-4">SYSTEM-WIDE RISK TRENDS (Past 6 Months)</h3>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={dummyTrendData}> {/* Replace with filtered data.history */}
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip />
                  <Area type="monotone" dataKey="risk" stroke="#059669" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <h3 className="text-sm font-bold mb-4">TOP 5 RISKY CROPS (Avg %)</h3>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart layout="vertical" data={data.topCrops.slice(0, 5)}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="_id" type="category" fontSize={10} width={60} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="averageRisk" fill="#1e3a8a" radius={[0, 4, 4, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BOTTOM ROW: Categories & Alerts */}
          <div className="grid grid-cols-2 gap-6 h-72">
            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <h3 className="text-sm font-bold mb-4">REPORTS BY DISEASE CATEGORY</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie data={dummyPieData} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {dummyPieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border p-5 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold mb-4">RECENT HIGH-RISK ALERTS</h3>
              <div className="space-y-3 overflow-y-auto pr-2">
                {data.critical.map((alert, i) => (
                  <div key={i} className="flex items-center justify-between text-xs border-b pb-2 last:border-0">
                    <span className="font-medium text-slate-500">
                      {alert.crop} | {alert.location} | <span className="text-red-500 font-bold italic">Critical</span>
                    </span>
                    <button className="text-blue-600 flex items-center gap-1 hover:underline">
                      View details <ExternalLink size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${active ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function StatCard({ title, value, icon, isRisk, color, textColor = "text-slate-900" }) {
  return (
    <div className={`${color} border border-orange-200/50 rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden`}>
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-wider">
        <span>{icon}</span> {title}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <span className={`text-3xl font-bold ${textColor}`}>{value || 0}{isRisk ? '%' : ''}</span>
        {isRisk && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Medium Risk Level</span>}
      </div>
    </div>
  );
}

// --- DUMMY DATA FOR VISUALS ---
const dummyTrendData = [
  { month: 'Jan 2026', risk: 5 }, { month: 'Feb 2026', risk: 30 }, { month: 'Mar 2026', risk: 15 },
  { month: 'Apr 2026', risk: 50 }, { month: 'May 2026', risk: 30 }, { month: 'Jun 2026', risk: 35 },
];
const dummyPieData = [
  { name: 'Fungal', value: 50 }, { name: 'Nutrient Deficiency', value: 15 }, 
  { name: 'Water Stress', value: 10 }, { name: 'Pest Outbreak', value: 25 },
];