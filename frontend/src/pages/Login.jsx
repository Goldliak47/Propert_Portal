import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/40 to-indigo-600/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-400/40 to-teal-600/40 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6">
        {/* left blurb */}
        <div className="hidden flex-1 md:block">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Welcome back to <span className="text-indigo-700">PropMan</span>
          </h1>
          <p className="mt-4 max-w-md text-gray-600">
            Manage your properties, track rentals, and stay organized with a
            beautiful, fast dashboard.
          </p>
        </div>

        {/* card */}
        <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/30 bg-white/70 p-6 shadow-2xl backdrop-blur-lg md:mx-0">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2 text-white">
              <LogIn size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Login</h2>
              <p className="text-sm text-gray-500">Access your dashboard</p>
            </div>
          </div>

          {error && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm text-gray-600">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none ring-indigo-200 transition focus:ring"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-gray-600">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 outline-none ring-indigo-200 transition focus:ring"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:bg-gray-100"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in…
                </span>
              ) : (
                <>
                  <LogIn size={18} className="transition group-hover:-translate-x-0.5" />
                  Sign in
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="font-medium text-indigo-700 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}