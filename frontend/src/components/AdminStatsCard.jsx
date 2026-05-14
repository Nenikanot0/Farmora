const accents = {
  emerald:
    "border-t-4 border-t-emerald-500 bg-gradient-to-br from-white via-emerald-50/30 to-white",
  teal: "border-t-4 border-t-teal-500 bg-gradient-to-br from-white via-teal-50/30 to-white",
  amber:
    "border-t-4 border-t-amber-500 bg-gradient-to-br from-white via-amber-50/30 to-white",
  rose: "border-t-4 border-t-rose-500 bg-gradient-to-br from-white via-rose-50/30 to-white",
};

const bar = {
  emerald: "from-emerald-500 to-teal-400",
  teal: "from-teal-500 to-cyan-400",
  amber: "from-amber-500 to-orange-400",
  rose: "from-rose-500 to-pink-400",
};

function AdminStatsCard({ title, value, subtitle, accent = "emerald" }) {
  const panel = accents[accent] ?? accents.emerald;
  const barClass = bar[accent] ?? bar.emerald;

  return (
    <div
      className={`rounded-2xl border border-stone-200/90 p-6 shadow-[0_4px_22px_rgba(15,23,42,0.07)] ${panel}`}
    >
      <div className={`mb-4 h-1 w-12 rounded-full bg-gradient-to-r ${barClass}`} />
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
        {title}
      </h2>
      <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
        {value}
      </p>
      {subtitle ? <p className="mt-2 text-xs leading-relaxed text-stone-600">{subtitle}</p> : null}
    </div>
  );
}

export default AdminStatsCard;
