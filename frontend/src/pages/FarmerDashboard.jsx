import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MdHistory,
  MdNotificationsActive,
  MdSpa,
  MdWbSunny,
} from "react-icons/md";
import Navbar from "../components/Navbar";
import AdviceLanguageSelect from "../components/AdviceLanguageSelect";
import WeatherForm from "../components/WeatherForm";
import WeatherCard from "../components/WeatherCard";
import ReportHistory from "../components/ReportHistory";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getWeatherAnalysis,
  getWeatherHistory,
  getCropReports,
  analyzeCrop,
} from "../services/api";

const TABS = [
  { id: "weather", label: "Weather risk", Icon: MdWbSunny },
  { id: "crop", label: "Crop health", Icon: MdSpa },
  { id: "history", label: "History", Icon: MdHistory },
  { id: "alerts", label: "Alerts", Icon: MdNotificationsActive },
];

const panelClass =
  "rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6 lg:p-7";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20";

function FarmerDashboard() {
  const [tab, setTab] = useState("weather");
  const [report, setReport] = useState(null);
  const [weatherBusy, setWeatherBusy] = useState(false);
  const [cropBusy, setCropBusy] = useState(false);
  const [historyBusy, setHistoryBusy] = useState(false);
  const [weatherReports, setWeatherReports] = useState([]);
  const [cropReports, setCropReports] = useState([]);
  const [cropForm, setCropForm] = useState({
    cropType: "",
    symptoms: "",
    language: "English",
  });
  const [cropFile, setCropFile] = useState(null);
  const [cropResult, setCropResult] = useState(null);

  const loadHistory = useCallback(async () => {
    setHistoryBusy(true);
    try {
      const [weatherRes, cropRes] = await Promise.all([
        getWeatherHistory(),
        getCropReports(),
      ]);
      setWeatherReports(weatherRes.data.reports ?? []);
      setCropReports(cropRes.data.reports ?? []);
    } catch (error) {
      alert(error.response?.data?.message ?? "Could not load history");
    } finally {
      setHistoryBusy(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "history" || tab === "alerts") {
      loadHistory();
    }
  }, [tab, loadHistory]);

  const alertReports = useMemo(
    () =>
      weatherReports.filter(
        (r) => r.alertLevel === "Warning" || r.alertLevel === "Critical"
      ),
    [weatherReports]
  );

  const handleWeatherSubmit = async (formData) => {
    setWeatherBusy(true);
    setReport(null);
    try {
      const { data } = await getWeatherAnalysis(formData);
      setReport(data.savedReport);
    } catch (error) {
      alert(error.response?.data?.message ?? "Weather analysis failed");
    } finally {
      setWeatherBusy(false);
    }
  };

  const handleCropSubmit = async (e) => {
    e.preventDefault();
    if (!cropForm.cropType.trim() || !cropForm.symptoms.trim()) {
      alert("Enter crop type and symptoms.");
      return;
    }
    setCropBusy(true);
    setCropResult(null);
    try {
      const body = new FormData();
      body.append("cropType", cropForm.cropType.trim());
      body.append("symptoms", cropForm.symptoms.trim());
      body.append("language", cropForm.language || "English");
      if (cropFile) {
        body.append("cropImage", cropFile);
      }
      const { data } = await analyzeCrop(body);
      setCropResult(data.report);
    } catch (error) {
      alert(error.response?.data?.message ?? "Crop analysis failed");
    } finally {
      setCropBusy(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-slate-50 to-slate-100">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
          <header
            className={`${panelClass} mb-6 sm:mb-8`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Farmer dashboard
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Check weather-driven risk, read advice in your preferred language, and
                  record crop symptoms for guidance—all aligned for daily field use.
                </p>
              </div>
            </div>
          </header>

          <nav
            className="mb-6 grid grid-cols-2 gap-2 sm:mb-8 sm:grid-cols-4 sm:gap-3"
            aria-label="Dashboard sections"
          >
            {TABS.map((t) => {
              const Icon = t.Icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition sm:min-h-0 sm:justify-start sm:px-4 ${
                    active
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/20"
                      : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/50"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-emerald-600"}`}
                    aria-hidden
                  />
                  <span className="leading-tight">{t.label}</span>
                </button>
              );
            })}
          </nav>

          <div className={`${panelClass} min-h-[420px]`}>
            {tab === "weather" ? (
              <section className="grid gap-6 lg:grid-cols-2 lg:gap-8 lg:items-stretch">
                <div className="flex min-h-0 flex-col lg:min-h-[360px]">
                  <h2 className="text-lg font-semibold text-slate-900">Weather & crop check</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose any official Indian language for the advisory text below.
                  </p>
                  <div className="mt-5 flex-1">
                    <WeatherForm onSubmit={handleWeatherSubmit} busy={weatherBusy} />
                  </div>
                </div>

                <div className="flex min-h-[280px] flex-col lg:min-h-0">
                  {report ? (
                    <WeatherCard report={report} className="h-full lg:sticky lg:top-4" />
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/90 px-5 py-12 text-center">
                      <MdWbSunny
                        className="h-14 w-14 text-amber-400"
                        aria-hidden
                      />
                      <p className="mt-4 text-sm font-semibold text-slate-800">
                        No analysis yet
                      </p>
                      <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
                        Submit the form on the left. Your risk score, alerts, and irrigation
                        tips will show here.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            ) : null}

            {tab === "crop" ? (
              <section className="mx-auto max-w-5xl">
                <h2 className="text-lg font-semibold text-slate-900">Symptom check</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Describe symptoms clearly. You may attach one photo for your records.
                </p>
                <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
                  <form className="space-y-4" onSubmit={handleCropSubmit}>
                    <div>
                      <label htmlFor="crop-type" className={labelClass}>
                        Crop type
                      </label>
                      <input
                        id="crop-type"
                        className={inputClass}
                        placeholder="e.g. tomato, chickpea, rice"
                        value={cropForm.cropType}
                        onChange={(e) =>
                          setCropForm({ ...cropForm, cropType: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="crop-symptoms" className={labelClass}>
                        Symptoms
                      </label>
                      <textarea
                        id="crop-symptoms"
                        className={`${inputClass} min-h-[140px] resize-y`}
                        placeholder="Spots, wilting, holes in leaves, pests you see, when it started…"
                        value={cropForm.symptoms}
                        onChange={(e) =>
                          setCropForm({ ...cropForm, symptoms: e.target.value })
                        }
                      />
                    </div>
                    <AdviceLanguageSelect
                      id="crop-language"
                      name="language"
                      value={cropForm.language}
                      onChange={(e) =>
                        setCropForm({ ...cropForm, language: e.target.value })
                      }
                      label="Language for disease advice"
                      labelClassName={labelClass}
                      selectClassName={inputClass}
                    />
                    <div>
                      <label htmlFor="crop-file" className={labelClass}>
                        Photo (optional)
                      </label>
                      <input
                        id="crop-file"
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-emerald-800 hover:file:bg-emerald-100"
                        onChange={(e) => setCropFile(e.target.files?.[0] ?? null)}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={cropBusy}
                      className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cropBusy ? "Analyzing…" : "Analyze symptoms"}
                    </button>
                  </form>

                  <div className="min-w-0">
                    {cropResult ? (
                      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6">
                        <h3 className="text-base font-semibold text-slate-900">
                          {cropResult.diseasePrediction?.diseaseName ?? "Assessment"}
                        </h3>
                        {cropResult.diseasePrediction?.expertNote ? (
                          <p className="mt-3 text-sm leading-relaxed text-slate-700">
                            {cropResult.diseasePrediction.expertNote}
                          </p>
                        ) : null}
                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Likely causes
                            </h4>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
                              {(cropResult.diseasePrediction?.causes ?? []).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Treatment
                            </h4>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
                              {(cropResult.diseasePrediction?.treatment ?? []).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="sm:col-span-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Prevention
                            </h4>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
                              {(cropResult.diseasePrediction?.prevention ?? []).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/90 px-5 py-10 text-center lg:min-h-[320px]">
                        <MdSpa className="h-12 w-12 text-emerald-500" aria-hidden />
                        <p className="mt-3 text-sm font-semibold text-slate-800">
                          Results will appear here
                        </p>
                        <p className="mt-1 max-w-xs text-xs text-slate-500">
                          After analysis, disease notes and care steps show beside the form on
                          large screens, and below on mobile.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ) : null}

            {tab === "history" ? (
              <section className="mx-auto max-w-4xl">
                <h2 className="text-lg font-semibold text-slate-900">Your reports</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Past weather runs and crop checks, newest first.
                </p>
                <div className="mt-6">
                  {historyBusy ? (
                    <LoadingSpinner label="Loading your reports…" />
                  ) : (
                    <ReportHistory
                      weatherReports={weatherReports}
                      cropReports={cropReports}
                    />
                  )}
                </div>
              </section>
            ) : null}

            {tab === "alerts" ? (
              <section className="mx-auto max-w-4xl">
                <h2 className="text-lg font-semibold text-slate-900">Weather alerts</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Warning and critical flags from your saved weather analyses.
                </p>
                <div className="mt-6">
                  {historyBusy ? (
                    <LoadingSpinner label="Loading alerts…" />
                  ) : alertReports.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
                      No warning or critical weather alerts in your history yet.
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      {alertReports.map((r) => (
                        <li key={r._id} className="px-4 py-4 sm:px-5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-medium text-slate-900">
                              {r.location} · {r.crop}{" "}
                              <span className="text-slate-500">({r.stage})</span>
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                r.alertLevel === "Critical"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {r.alertLevel}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            Risk {r.farmingAnalysis?.riskPercentage ?? "—"}% ·{" "}
                            {r.farmingAnalysis?.diseaseCategory ?? "—"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}

export default FarmerDashboard;
