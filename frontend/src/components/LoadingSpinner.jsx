function LoadingSpinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-slate-600">
      <span
        className="h-9 w-9 shrink-0 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
        aria-hidden
      />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
