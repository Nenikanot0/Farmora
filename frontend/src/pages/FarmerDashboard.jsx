import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CloudSun,
  Sprout,
  History,
  Bell,
  Search,
  Info,
  ClipboardList,
  ChevronRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import WeatherForm from "../components/WeatherForm";
import WeatherCard from "../components/WeatherCard";
import ReportHistory from "../components/ReportHistory";
import LoadingSpinner from "../components/LoadingSpinner";
import AdviceLanguageSelect from "../components/AdviceLanguageSelect";

import {
  getWeatherAnalysis,
  getWeatherHistory,
  getCropReports,
  analyzeCrop,
} from "../services/api";

const SIDEBAR_ITEMS = [
  {
    id: "weather",
    label: "Weather Risk",
    icon: <CloudSun size={18} />,
  },
  {
    id: "crop",
    label: "Crop Health",
    icon: <Sprout size={18} />,
  },
  {
    id: "history",
    label: "Report History",
    icon: <History size={18} />,
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: <Bell size={18} />,
  },
];

function FarmerDashboard() {
  const [tab, setTab] = useState("weather");

  const [report, setReport] = useState(null);

  const [busy, setBusy] = useState({
    weather: false,
    crop: false,
    history: false,
  });

  const [data, setData] = useState({
    weatherReports: [],
    cropReports: [],
  });

  const [cropForm, setCropForm] = useState({
    cropType: "",
    symptoms: "",
    language: "English",
  });

  const [cropFile, setCropFile] = useState(null);

  const [cropResult, setCropResult] = useState(null);

  const loadHistory = useCallback(async () => {
    setBusy((prev) => ({
      ...prev,
      history: true,
    }));

    try {
      const [wRes, cRes] = await Promise.all([
        getWeatherHistory(),
        getCropReports(),
      ]);

      setData({
        weatherReports: wRes.data.reports ?? [],
        cropReports: cRes.data.reports ?? [],
      });
    } catch (e) {
      alert("Could not load history");
    } finally {
      setBusy((prev) => ({
        ...prev,
        history: false,
      }));
    }
  }, []);

  useEffect(() => {
    if (tab === "history" || tab === "alerts") {
      loadHistory();
    }
  }, [tab, loadHistory]);

  const alertReports = useMemo(
    () =>
      data.weatherReports.filter((r) =>
        ["Warning", "Critical"].includes(r.alertLevel)
      ),
    [data.weatherReports]
  );

  return (
    <>
      <Navbar />

      <div className="flex h-screen bg-[#f8fafc] text-slate-700 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Sprout size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Farmora
              </h2>

              <p className="text-xs text-slate-400">
                Smart Farming
              </p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  tab === item.id
                    ? "bg-emerald-600 text-white shadow"
                    : "hover:bg-slate-800"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* TOPBAR */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900 capitalize">
                {tab} Dashboard
              </h1>
            </div>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                placeholder="Quick search..."
                className="border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </header>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <DashboardStat
                title="Current Status"
                value="Healthy"
                icon={<Info size={15} />}
                color="bg-orange-50"
              />

              <DashboardStat
                title="Active Alerts"
                value={alertReports.length}
                icon={<Bell size={15} />}
                color="bg-red-50"
                textColor="text-red-600"
              />

              <DashboardStat
                title="Total Records"
                value={
                  data.weatherReports.length +
                  data.cropReports.length
                }
                icon={<ClipboardList size={15} />}
                color="bg-emerald-50"
              />
            </div>

            {/* MAIN PANEL */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 min-h-[550px]">
              {/* WEATHER */}
              {tab === "weather" && (
                <div className="grid lg:grid-cols-2 gap-10">
                  {/* FORM */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Weather & Risk Analysis
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Analyze crop risks based on live weather.
                      </p>
                    </div>

                    <WeatherForm
                      onSubmit={async (fd) => {
                        setBusy((p) => ({
                          ...p,
                          weather: true,
                        }));

                        try {
                          const { data } =
                            await getWeatherAnalysis(fd);

                          setReport(data.savedReport);
                        } catch (e) {
                          alert("Weather analysis failed");
                        } finally {
                          setBusy((p) => ({
                            ...p,
                            weather: false,
                          }));
                        }
                      }}
                      busy={busy.weather}
                    />
                  </div>

                  {/* RESULT */}
                  <div className="flex min-h-[320px] flex-col">
                    {report ? (
                      <WeatherCard report={report} />
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
                        <CloudSun className="h-14 w-14 text-amber-400" />

                        <p className="mt-4 text-sm font-semibold text-slate-800">
                          No analysis yet
                        </p>

                        <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
                          Submit the weather form to view crop
                          risk analysis and field guidance.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CROP */}
              {tab === "crop" && (
                <div className="grid lg:grid-cols-2 gap-10">
                  {/* LEFT */}
                  <form
                    className="space-y-5"
                    onSubmit={async (e) => {
                      e.preventDefault();

                      if (
                        !cropForm.cropType.trim() ||
                        !cropForm.symptoms.trim()
                      ) {
                        alert(
                          "Enter crop type and symptoms"
                        );
                        return;
                      }

                      setBusy((p) => ({
                        ...p,
                        crop: true,
                      }));

                      try {
                        const body = new FormData();

                        body.append(
                          "cropType",
                          cropForm.cropType
                        );

                        body.append(
                          "symptoms",
                          cropForm.symptoms
                        );

                        body.append(
                          "language",
                          cropForm.language
                        );

                        if (cropFile) {
                          body.append(
                            "cropImage",
                            cropFile
                          );
                        }

                        const { data } =
                          await analyzeCrop(body);

                        setCropResult(data.report);
                      } catch (err) {
                        alert("Crop analysis failed");
                      } finally {
                        setBusy((p) => ({
                          ...p,
                          crop: false,
                        }));
                      }
                    }}
                  >
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Symptom Checker
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Detect diseases and get treatment
                        advice.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 block">
                        Crop Type
                      </label>

                      <input
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                        placeholder="Tomato, Rice..."
                        value={cropForm.cropType}
                        onChange={(e) =>
                          setCropForm({
                            ...cropForm,
                            cropType: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 block">
                        Symptoms
                      </label>

                      <textarea
                        className="w-full h-36 rounded-xl border border-slate-300 px-4 py-3 text-sm resize-none"
                        placeholder="Yellow leaves, spots..."
                        value={cropForm.symptoms}
                        onChange={(e) =>
                          setCropForm({
                            ...cropForm,
                            symptoms: e.target.value,
                          })
                        }
                      />
                    </div>

                    <AdviceLanguageSelect
                      value={cropForm.language}
                      onChange={(e) =>
                        setCropForm({
                          ...cropForm,
                          language: e.target.value,
                        })
                      }
                      selectClassName="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                    />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setCropFile(
                          e.target.files?.[0] ?? null
                        )
                      }
                    />

                    <button
                      type="submit"
                      disabled={busy.crop}
                      className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {busy.crop
                        ? "Analyzing..."
                        : "Analyze Symptoms"}
                    </button>
                  </form>

                  {/* RIGHT */}
                  <div className="flex min-h-[320px] flex-col">
                    {cropResult ? (
                      <div className="h-full rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                              Crop Health Analysis
                            </p>

                            <h3 className="mt-2 text-xl font-bold text-slate-900">
                              {
                                cropResult
                                  .diseasePrediction
                                  ?.diseaseName
                              }
                            </h3>
                          </div>

                          <div className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                            Active
                          </div>
                        </div>

                        <div className="mt-5 rounded-xl border border-emerald-100 bg-white/80 p-4">
                          <p className="text-sm text-slate-700">
                            {
                              cropResult
                                .diseasePrediction
                                ?.expertNote
                            }
                          </p>
                        </div>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                          <div className="rounded-xl bg-white border p-4">
                            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              Causes
                            </h4>

                            <ul className="mt-3 list-disc pl-5 text-sm space-y-1">
                              {(
                                cropResult
                                  .diseasePrediction
                                  ?.causes ?? []
                              ).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-xl bg-white border p-4">
                            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              Treatment
                            </h4>

                            <ul className="mt-3 list-disc pl-5 text-sm space-y-1">
                              {(
                                cropResult
                                  .diseasePrediction
                                  ?.treatment ?? []
                              ).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-5 py-12 text-center">
                        <Sprout className="h-14 w-14 text-emerald-500" />

                        <p className="mt-4 text-sm font-semibold text-slate-800">
                          No crop analysis yet
                        </p>

                        <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
                          Submit crop symptoms to receive
                          disease prediction and treatment
                          guidance.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* HISTORY */}
              {tab === "history" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Report History
                  </h3>

                  {busy.history ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      <HistorySection
                        title="Weather Reports"
                        reports={data.weatherReports}
                        type="weather"
                      />

                      <HistorySection
                        title="Crop Reports"
                        reports={data.cropReports}
                        type="crop"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ALERTS */}
              {tab === "alerts" && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Active Alerts
                  </h3>

                  {busy.history ? (
                    <LoadingSpinner />
                  ) : alertReports.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No active alerts found.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {alertReports.map((r) => (
                        <div
                          key={r._id}
                          className="rounded-xl border border-red-100 bg-red-50 p-4"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {r.location}
                              </h4>

                              <p className="text-sm text-slate-600">
                                {r.crop}
                              </p>
                            </div>

                            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                              {r.alertLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function DashboardStat({
  title,
  value,
  icon,
  color,
  textColor = "text-slate-900",
}) {
  return (
    <div
      className={`${color} border rounded-2xl p-5 shadow-sm`}
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        {icon}
        {title}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`text-2xl font-bold ${textColor}`}>
          {value}
        </span>

        <ChevronRight
          size={18}
          className="text-slate-300"
        />
      </div>
    </div>
  );
}

function HistorySection({ title, reports, type }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">
          {title}
        </h4>

        <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
          {reports.length}
        </span>
      </div>

      <div className="max-h-72 overflow-y-auto">
        <ReportHistory
          weatherReports={
            type === "weather" ? reports : []
          }
          cropReports={type === "crop" ? reports : []}
        />
      </div>
    </div>
  );
}

export default FarmerDashboard;