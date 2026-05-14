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

const panelClass = "dash-panel";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600";

const inputClass = "dash-input";

const primaryBtn =
  "w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-md transition hover:from-teal-500 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

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

      <main className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-stone-50 to-teal-50/50">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-10">
          <header className={`${panelClass} mb-6 border-l-4 border-l-emerald-600 sm:mb-8`}>
            <p className="dash-section-title">Your workspace</p>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Farmer dashboard
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
                  Check weather-driven risk, read advice in your preferred language, and record
                  crop symptoms for guidance—all laid out for daily field use.
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
                      ? "border-transparent bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-lg ring-2 ring-teal-500/30"
                      : "border-stone-200/90 bg-white/90 text-stone-700 shadow-sm hover:border-teal-200 hover:bg-teal-50/40"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-teal-600"}`}
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
                <div className="flex min-h-0 flex-col rounded-xl bg-gradient-to-b from-teal-50/40 to-white/80 p-4 ring-1 ring-stone-200/70 lg:min-h-[360px] lg:p-5">
                  <h2 className="text-lg font-bold text-slate-900">Weather & crop check</h2>
                  <p className="mt-1 text-sm text-stone-600">
                    Choose any official Indian language for the advisory text on the right.
                  </p>
                  <div className="mt-5 flex-1">
                    <WeatherForm onSubmit={handleWeatherSubmit} busy={weatherBusy} />
                  </div>
                </div>

                <div className="flex min-h-[280px] flex-col lg:min-h-0">
                  {report ? (
                    <WeatherCard report={report} className="h-full lg:sticky lg:top-4" />
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300/90 bg-gradient-to-b from-stone-50 to-white px-5 py-12 text-center">
                      <MdWbSunny
                        className="h-14 w-14 text-amber-500 drop-shadow-sm"
                        aria-hidden
                      />
                      <p className="mt-4 text-sm font-semibold text-slate-800">
                        No analysis yet
                      </p>
                      <p className="mt-2 max-w-sm text-xs leading-relaxed text-stone-500">
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
                <p className="dash-section-title">Crop care</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Symptom check</h2>
                <p className="mt-1 text-sm text-stone-600">
                  Describe symptoms clearly. You may attach one photo for your records.
                </p>
                <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
                  <form
                    className="space-y-4 rounded-xl bg-gradient-to-b from-stone-50/80 to-white p-4 ring-1 ring-stone-200/70 sm:p-5"
                    onSubmit={handleCropSubmit}
                  >
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
                        className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-teal-900 hover:file:bg-teal-100"
                        onChange={(e) => setCropFile(e.target.files?.[0] ?? null)}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={cropBusy}
                      className={primaryBtn}
                    >
                      {cropBusy ? "Analyzing…" : "Analyze symptoms"}
                    </button>
                  </form>

                  <div className="min-w-0">
                    {cropResult ? (
                      <div className="rounded-2xl border border-stone-200/90 bg-gradient-to-b from-white via-teal-50/25 to-stone-50/40 p-5 shadow-inner sm:p-6">
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
                            <h4 className="text-xs font-bold uppercase tracking-wide text-teal-800/80">
                              Likely causes
                            </h4>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700">
                              {(cropResult.diseasePrediction?.causes ?? []).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wide text-teal-800/80">
                              Treatment
                            </h4>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700">
                              {(cropResult.diseasePrediction?.treatment ?? []).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="sm:col-span-2">
                            <h4 className="text-xs font-bold uppercase tracking-wide text-teal-800/80">
                              Prevention
                            </h4>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700">
                              {(cropResult.diseasePrediction?.prevention ?? []).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300/90 bg-gradient-to-b from-stone-50 to-white px-5 py-10 text-center lg:min-h-[320px]">
                        <MdSpa className="h-12 w-12 text-teal-600" aria-hidden />
                        <p className="mt-3 text-sm font-semibold text-slate-800">
                          Results will appear here
                        </p>
                        <p className="mt-1 max-w-xs text-xs text-stone-500">
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
                <p className="dash-section-title">Archive</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Your reports</h2>
                <p className="mt-1 text-sm text-stone-600">
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
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-rose-800/90">
                  Safety
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Weather alerts</h2>
                <p className="mt-1 text-sm text-stone-600">
                  Warning and critical flags from your saved weather analyses.
                </p>
                <div className="mt-6">
                  {historyBusy ? (
                    <LoadingSpinner label="Loading alerts…" />
                  ) : alertReports.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50/90 px-4 py-10 text-center text-sm text-stone-600">
                      No warning or critical weather alerts in your history yet.
                    </p>
                  ) : (
                    <ul className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
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
                          <p className="mt-2 text-sm text-stone-600">
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
