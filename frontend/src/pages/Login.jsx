import { useState } from "react";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await loginUser(formData);
      login(data.user, data.token);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      alert(error.response?.data?.message ?? "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-52px)] justify-center bg-gradient-to-b from-stone-100/80 via-teal-50/30 to-stone-50 px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="dash-panel w-full max-w-md border-l-4 border-l-teal-500 p-8"
        >
          <p className="dash-section-title">Account</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Log in</h2>
          <p className="mt-1 text-sm text-stone-600">
            Use the account you registered with KrishiMitra.
          </p>

          <label className="mt-6 block text-sm font-medium text-stone-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="dash-input mt-1.5"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <label className="mt-4 block text-sm font-medium text-stone-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className="dash-input mt-1.5"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 py-3 text-sm font-semibold text-white shadow-md transition hover:from-teal-500 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <p className="mt-6 text-center text-sm text-stone-600">
            New here?{" "}
            <Link to="/register" className="font-semibold text-teal-700 hover:underline">
              Create an account
            </Link>
          </p>
          <p className="mt-2 text-center text-sm">
            <Link to="/" className="text-stone-500 hover:text-slate-900">
              ← Back to home
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
