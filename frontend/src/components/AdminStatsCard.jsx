function AdminStatsCard({ title, value, subtitle }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      {subtitle ? (
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default AdminStatsCard;
