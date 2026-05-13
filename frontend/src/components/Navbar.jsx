import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-700 bg-emerald-700 px-4 py-3 text-white shadow">
      <Link to="/" className="text-lg font-bold tracking-tight hover:opacity-90">
        KrishiMitra
      </Link>

      <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
        {user ? (
          <>
            {user.role !== "admin" ? (
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            ) : (
              <Link to="/admin" className="hover:underline">
                Admin
              </Link>
            )}
            <span className="hidden text-emerald-100 sm:inline">{user.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-white px-3 py-1.5 font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
