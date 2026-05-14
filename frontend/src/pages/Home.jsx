import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-50">
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-emerald-800">Farmora</span>
          <div className="flex gap-3 text-sm font-medium">
            {user ? (
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-700"
              >
                Go to app
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-emerald-800 hover:bg-emerald-50"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Smart farming assistant
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
          Weather risk and crop health in one place
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          Farmora connects your farm to live weather, AI-guided risk scores, and symptom-based
          disease hints—so you can irrigate, protect, and plan with clearer signals.
        </p>
        {!user ? (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-emerald-700"
            >
              Create farmer account
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50"
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
