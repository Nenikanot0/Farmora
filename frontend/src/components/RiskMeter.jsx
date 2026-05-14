function barColor(risk) {
  if (risk >= 85) return "bg-red-600";
  if (risk >= 70) return "bg-amber-500";
  if (risk >= 40) return "bg-yellow-400";
  return "bg-emerald-500";
}

function RiskMeter({ risk }) {
  const pct = Math.min(100, Math.max(0, Number(risk) || 0));

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-sm font-medium text-slate-700">
        <span>Risk</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-3 rounded-full transition-all ${barColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default RiskMeter;
