import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/70 via-stone-50 to-emerald-50/40">
      <header className="border-b border-stone-200/80 bg-white/85 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Krishi<span className="font-light text-teal-600">Mitra</span>
          </span>
          <div className="flex gap-2 text-sm font-medium sm:gap-3">
            {user ? (
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 px-4 py-2.5 text-white shadow-md transition hover:from-teal-500 hover:to-emerald-600"
              >
                Go to app
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-teal-900 transition hover:bg-teal-50"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 px-4 py-2.5 text-white shadow-md transition hover:from-teal-500 hover:to-emerald-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800/90">
          Smart farming assistant
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Weather risk and crop health in one place
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-stone-600">
          KrishiMitra connects your farm to live weather, AI-guided risk scores, and symptom-based
          disease hints—so you can irrigate, protect, and plan with clearer signals.
        </p>
        {!user ? (
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:from-teal-500 hover:to-emerald-600"
            >
              Create farmer account
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-stone-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-800 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50"
            >
              I already have an account
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default Home;
