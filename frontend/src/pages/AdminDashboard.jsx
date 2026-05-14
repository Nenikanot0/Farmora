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

      <main className="min-h-screen bg-gradient-to-b from-slate-100/90 via-teal-50/30 to-stone-100">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-10">
          <header className="dash-panel mb-8 border-l-4 border-l-teal-500">
            <p className="dash-section-title">Operations</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Admin overview
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
              Farmers onboarded, weather risk reports, and critical alerts—formatted for quick
              scanning.
            </p>
          </header>

          {loading ? (
            <div className="dash-panel flex min-h-[280px] items-center justify-center">
              <LoadingSpinner label="Loading analytics…" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AdminStatsCard
                  accent="emerald"
                  title="Total farmers"
                  value={stats?.totalFarmers ?? "—"}
                />
                <AdminStatsCard
                  accent="teal"
                  title="Weather reports"
                  value={stats?.totalReports ?? "—"}
                />
                <AdminStatsCard accent="amber" title="Average risk" value={avgRiskPct} />
                <AdminStatsCard
                  accent="rose"
                  title="High risk (score)"
                  value={stats?.highRiskAlert ?? "—"}
                  subtitle='Reports where model risk score is "High"'
                />
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
                <section className="dash-panel border-l-4 border-l-emerald-500/80">
                  <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                    <div>
                      <p className="dash-section-title">Crops</p>
                      <h2 className="mt-1 text-lg font-bold text-slate-900">Top risky crops</h2>
                      <p className="mt-1 text-sm text-stone-600">
                        Average model risk % and report volume.
                      </p>
                    </div>
                  </div>
                  {topCrops.length === 0 ? (
                    <p className="mt-6 rounded-xl border border-dashed border-stone-200 bg-stone-50/80 px-4 py-8 text-center text-sm text-stone-600">
                      No crop aggregation data yet.
                    </p>
                  ) : (
                    <ul className="mt-4 divide-y divide-stone-100">
                      {topCrops.map((row) => (
                        <li
                          key={row._id}
                          className="flex flex-wrap items-center justify-between gap-2 py-3.5 text-sm first:pt-0"
                        >
                          <span className="font-semibold capitalize text-slate-900">
                            {row._id}
                          </span>
                          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                            {row.averageRisk != null ? `${row.averageRisk.toFixed(1)}%` : "—"} ·{" "}
                            {row.totalReports ?? 0} reports
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="dash-panel border-l-4 border-l-rose-500/80">
                  <div className="border-b border-stone-100 pb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-rose-800/90">
                      Alerts
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">Critical field reports</h2>
                    <p className="mt-1 text-sm text-stone-600">
                      Latest entries flagged critical by the advisory engine.
                    </p>
                  </div>
                  {critical.length === 0 ? (
                    <p className="mt-6 rounded-xl border border-dashed border-stone-200 bg-stone-50/80 px-4 py-8 text-center text-sm text-stone-600">
                      No critical alerts right now.
                    </p>
                  ) : (
                    <ul className="mt-4 max-h-[22rem] space-y-3 overflow-y-auto pr-1 text-sm">
                      {critical.map((a) => (
                        <li
                          key={a._id}
                          className="rounded-xl border border-rose-100 bg-gradient-to-r from-rose-50/90 to-white px-4 py-3 shadow-sm"
                        >
                          <span className="font-semibold text-slate-900">
                            {a.location} · {a.crop}
                          </span>
                          <span className="mt-1.5 block text-stone-600">
                            {a.farmingAnalysis?.riskPercentage != null
                              ? `${a.farmingAnalysis.riskPercentage}% risk`
                              : "Risk —"}
                            <span className="text-stone-400"> · </span>
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
        </div>
      </main>
    </>
  );
}

export default AdminDashboard;
