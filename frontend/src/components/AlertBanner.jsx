function AlertBanner({ level }) {

  if (!level || level === "Safe") return null;

  const isCritical = level === "Critical";

  return (
    <div
      className={`rounded-lg px-4 py-3 text-sm font-medium text-white ${
        isCritical ? "bg-red-600" : "bg-amber-500"
      }`}
      role="status"
    >
      {isCritical
        ? "Critical risk for this crop and location. Act promptly."
        : "Elevated risk. Monitor the field and follow the advice below."}
    </div>
  );
}

export default AlertBanner;
