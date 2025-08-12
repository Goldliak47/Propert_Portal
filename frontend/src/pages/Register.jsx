import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { UserPlus, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");
    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      setOk("Account created! Redirecting…");
    } catch (err) {
      setError("Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-400/40 to-indigo-600/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-400/40 to-cyan-600/40 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6">
        <div className="hidden flex-1 md:block">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Create your <span className="text-indigo-700">PropMan</span> account
          </h1>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              Secure, token‑based access
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              Manage owned and rented properties
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              Fast, clean UI with real‑time updates
            </li>
          </ul>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/30 bg-white/70 p-6 shadow-2xl backdrop-blur-lg md:mx-0">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2 text-white">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Register</h2>
              <p className="text-sm text-gray-500">Start managing properties</p>
            </div>
          </div>

          {error && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {ok && (
            <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {ok}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm text-gray-600">Full name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none ring-indigo-200 transition focus:ring"
                placeholder="Hammad"
                required
              />
            </label>

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
              <span className="mb-1 block text-sm text-gray-600">Password</span>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 outline-none ring-indigo-200 transition focus:ring"
                  placeholder="At least 6 characters"
                  minLength={6}
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
                  Creating…
                </span>
              ) : (
                <>
                  <UserPlus size={18} className="transition group-hover:-translate-x-0.5" />
                  Create account
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-700 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}