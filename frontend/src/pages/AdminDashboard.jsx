import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AdminStatsCard from "../components/AdminStatsCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getAdminStats,
  getTopRiskyCrops,
  getCriticalAlerts,
} from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [topCrops, setTopCrops] = useState([]);
  const [critical, setCritical] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, cropsRes, critRes] = await Promise.all([
          getAdminStats(),
          getTopRiskyCrops(),
          getCriticalAlerts(),
        ]);
        setStats(statsRes.data);
        setTopCrops(Array.isArray(cropsRes.data) ? cropsRes.data : []);
        setCritical(Array.isArray(critRes.data) ? critRes.data : []);
      } catch (error) {
        alert(error.response?.data?.message ?? "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const avgRiskPct =
    stats?.avgRisk?.[0]?.averageRisk != null
      ? `${Number(stats.avgRisk[0].averageRisk).toFixed(1)}%`
      : "—";

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin dashboard</h1>
        <p className="mt-1 text-slate-600">
          Overview of farmers, weather risk reports, and critical field alerts.
        </p>

        {loading ? (
          <LoadingSpinner label="Loading analytics…" />
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AdminStatsCard title="Total farmers" value={stats?.totalFarmers ?? "—"} />
              <AdminStatsCard title="Weather reports" value={stats?.totalReports ?? "—"} />
              <AdminStatsCard title="Average risk" value={avgRiskPct} />
              <AdminStatsCard
                title="High risk (score)"
                value={stats?.highRiskAlert ?? "—"}
                subtitle='Count of reports with risk score "High"'
              />
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Top risky crops</h2>
                <p className="mt-1 text-sm text-slate-600">
                  By average model risk percentage across reports.
                </p>
                {topCrops.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">No crop data yet.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-slate-100">
                    {topCrops.map((row) => (
                      <li
                        key={row._id}
                        className="flex items-center justify-between py-3 text-sm"
                      >
                        <span className="font-medium text-slate-900">{row._id}</span>
                        <span className="text-slate-600">
                          {row.averageRisk != null ? `${row.averageRisk.toFixed(1)}%` : "—"} ·{" "}
                          {row.totalReports ?? 0} reports
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Critical alerts</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Latest reports flagged as critical by the advisory engine.
                </p>
                {critical.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">No critical alerts.</p>
                ) : (
                  <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1 text-sm">
                    {critical.map((a) => (
                      <li
                        key={a._id}
                        className="rounded-lg border border-red-100 bg-red-50/80 px-3 py-2"
                      >
                        <span className="font-medium text-slate-900">
                          {a.location} · {a.crop}
                        </span>
                        <span className="mt-1 block text-slate-600">
                          {a.farmingAnalysis?.riskPercentage != null
                            ? `${a.farmingAnalysis.riskPercentage}% risk`
                            : "Risk —"}
                          {" · "}
                          {a.farmingAnalysis?.diseaseCategory ?? "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default AdminDashboard;
