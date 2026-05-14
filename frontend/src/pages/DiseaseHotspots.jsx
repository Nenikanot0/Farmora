import Navbar from "../components/Navbar";
import DiseaseMap from "../components/DiseaseMap";

function DiseaseHotspots() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-stone-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <header className="dash-panel mb-8 border-l-4 border-l-teal-500 text-center sm:text-left">
          <p className="dash-section-title text-center sm:text-left">Geography</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Disease hotspots map
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-stone-600 sm:mx-0 sm:text-left">
            High-risk weather reports grouped by location. Requires an{" "}
            <strong className="text-slate-800">admin</strong> session (admin API).
          </p>
        </header>
        <DiseaseMap />
      </div>
    </div>
  );
}

export default DiseaseHotspots;
