import RiskMeter from "./RiskMeter";
import AlertBanner from "./AlertBanner";

function WeatherCard({ report, className = "" }) {
  if (!report) return null;

  const risks = report.farmingAnalysis?.risks ?? [];

  return (
    <div
        className={`rounded-2xl border border-stone-200/90 bg-gradient-to-b from-white via-teal-50/20 to-stone-50/30 p-6 shadow-[0_4px_24px_rgba(15,23,42,0.08)] ring-1 ring-stone-100/80 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {report.location}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            <span className="font-medium text-teal-900/90">{report.crop}</span>
            <span className="mx-1.5 text-stone-300">·</span>
            <span className="capitalize text-stone-600">{report.stage}</span>
          </p>
        </div>
        {report.alertLevel ? (
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              report.alertLevel === "Critical"
                ? "bg-red-100 text-red-800"
                : report.alertLevel === "Warning"
                  ? "bg-amber-100 text-amber-900"
                  : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {report.alertLevel}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <AlertBanner level={report.alertLevel} />
      </div>

      <div className="mt-4 grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
        <p className="rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-stone-200/60">
          <span className="font-medium text-slate-900">Temperature</span>
          <span className="mt-0.5 block text-stone-600">
            {report.weatherData?.temperature}°C
          </span>
        </p>
        <p className="rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-stone-200/60">
          <span className="font-medium text-slate-900">Humidity</span>
          <span className="mt-0.5 block text-stone-600">
            {report.weatherData?.humidity}%
          </span>
        </p>
        <p className="rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-stone-200/60 sm:col-span-2">
          <span className="font-medium text-slate-900">Sky / conditions</span>
          <span className="mt-0.5 block text-stone-600">{report.weatherData?.weather}</span>
        </p>
      </div>

      <div className="mt-5">
        <RiskMeter risk={report.farmingAnalysis?.riskPercentage} />
      </div>

      <p className="mt-5 text-sm leading-relaxed">
        <span className="font-semibold text-slate-900">Disease category</span>
        <span className="mt-1 block text-slate-700">
          {report.farmingAnalysis?.diseaseCategory}
        </span>
      </p>

      {risks.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-teal-800/80">Risks</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-stone-700">
            {risks.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 space-y-3 border-t border-stone-200/80 pt-5 text-sm leading-relaxed text-stone-700">
        <p>
          <span className="font-semibold text-slate-900">Irrigation</span>
          <span className="mt-1 block">{report.farmingAnalysis?.irrigationAdvice}</span>
        </p>
        <p>
          <span className="font-semibold text-slate-900">Pesticide / protection</span>
          <span className="mt-1 block">{report.farmingAnalysis?.pesticideAdvice}</span>
        </p>
        <p>
          <span className="font-semibold text-slate-900">Crop safety</span>
          <span className="mt-1 block">{report.farmingAnalysis?.cropSafetyAdvice}</span>
        </p>
      </div>
    </div>
  );
}

export default WeatherCard;
