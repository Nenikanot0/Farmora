function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
}

function ReportHistory({ weatherReports = [], cropReports = [] }) {
  const hasWeather = weatherReports.length > 0;
  const hasCrop = cropReports.length > 0;

  if (!hasWeather && !hasCrop) {
    return (
      <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50/90 px-4 py-10 text-center text-sm text-stone-600">
        No reports yet. Run a weather analysis or crop check to see history here.
      </p>
    );
  }

  const listShell =
    "mt-3 divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)]";

  return (
    <div className="space-y-10">
      {hasWeather ? (
        <section>
          <p className="dash-section-title">Weather</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">Weather risk reports</h3>
          <ul className={listShell}>
            {weatherReports.map((r) => (
              <li key={r._id} className="px-4 py-4 text-sm sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">
                    {r.location} · {r.crop}
                  </span>
                  <span className="text-xs text-stone-500">{formatDate(r.createdAt)}</span>
                </div>
                <p className="mt-1 text-stone-600">
                  Risk {r.farmingAnalysis?.riskPercentage ?? "—"}% ·{" "}
                  {r.farmingAnalysis?.riskScore ?? "—"} · {r.alertLevel ?? "—"}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasCrop ? (
        <section>
          <p className="dash-section-title">Crops</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">Crop disease reports</h3>
          <ul className={listShell}>
            {cropReports.map((r) => (
              <li key={r._id} className="px-4 py-4 text-sm sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">{r.cropType}</span>
                  <span className="text-xs text-stone-500">{formatDate(r.createdAt)}</span>
                </div>
                <p className="mt-1 text-stone-600">
                  {r.diseasePrediction?.diseaseName ?? "Analysis recorded"}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export default ReportHistory;
