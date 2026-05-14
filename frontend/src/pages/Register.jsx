import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [busy, setBusy] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await registerUser(formData);
      login(data.user, data.token);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      alert(error.response?.data?.message ?? "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-52px)] justify-center bg-gradient-to-b from-stone-100/80 via-emerald-50/30 to-stone-50 px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="dash-panel w-full max-w-md border-l-4 border-l-emerald-600 p-8"
        >
          <p className="dash-section-title">Join</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Register</h2>
          <p className="mt-1 text-sm text-stone-600">
            Create a farmer account to use weather risk and crop health tools.
          </p>

          <label className="mt-6 block text-sm font-medium text-stone-700" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            required
            className="dash-input mt-1.5"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <label className="mt-4 block text-sm font-medium text-stone-700" htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            className="dash-input mt-1.5"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <label className="mt-4 block text-sm font-medium text-stone-700" htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
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
            {busy ? "Creating account…" : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-stone-600">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-teal-700 hover:underline">
              Log in
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

export default Register;
