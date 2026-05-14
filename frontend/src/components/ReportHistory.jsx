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
      <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
        No reports yet. Run a weather analysis or crop check to see history here.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {hasWeather ? (
        <section>
          <h3 className="text-lg font-semibold text-slate-900">Weather risk reports</h3>
          <ul className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {weatherReports.map((r) => (
              <li key={r._id} className="px-4 py-4 text-sm sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">
                    {r.location} · {r.crop}
                  </span>
                  <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span>
                </div>
                <p className="mt-1 text-slate-600">
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
          <h3 className="text-lg font-semibold text-slate-900">Crop disease reports</h3>
          <ul className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {cropReports.map((r) => (
              <li key={r._id} className="px-4 py-4 text-sm sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">{r.cropType}</span>
                  <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span>
                </div>
                <p className="mt-1 text-slate-600">
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
