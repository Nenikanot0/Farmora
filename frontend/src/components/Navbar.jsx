import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass =
    "rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white";
  const linkActive =
    "rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/20";

  return (
    <nav className="sticky top-0 z-50 border-b border-teal-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 shadow-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-white drop-shadow-sm transition hover:text-emerald-200"
        >
          Krishi<span className="font-light text-emerald-300">Mitra</span>
        </Link>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {user ? (
            <>
              {user.role !== "admin" ? (
                <Link to="/dashboard" className={linkClass}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/admin" className={linkClass}>
                    Overview
                  </Link>
                  <Link to="/disease-hotspots" className={linkClass}>
                    Disease map
                  </Link>
                </>
              )}
              <span className="mx-1 hidden h-6 w-px bg-white/20 sm:inline-block" aria-hidden />
              <span className="hidden max-w-[140px] truncate text-sm text-emerald-100/90 sm:inline">
                {user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:bg-emerald-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
