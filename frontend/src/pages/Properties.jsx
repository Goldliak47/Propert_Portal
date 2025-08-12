import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../auth/AuthContext";
import {
  Plus,
  LogOut,
  Home,
  MapPin,
  Building2,
  Search,
  X,
} from "lucide-react";

export default function Properties() {
  const { logout } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "owned",
    city: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api("/api/properties/");
        if (alive) setProperties(data ?? []);
      } catch (e) {
        console.error(e);
        setError("Failed to load properties.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q)
    );
  }, [properties, query]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const newProp = await api("/api/properties/", {
        method: "POST",
        body: form,
      });
      setProperties((prev) => [newProp, ...prev]);
      setForm({ title: "", type: "owned", city: "", address: "" });
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError("Could not add property.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* topbar */}
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-600 p-2 text-white">
              <Building2 size={18} />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">
              PropMan <span className="text-gray-400">/ Properties</span>
            </h1>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* actions row */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 outline-none ring-indigo-200 transition focus:ring"
              placeholder="Search by title, city, type…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 self-start rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow transition hover:bg-indigo-700 sm:self-auto"
          >
            <Plus size={18} />
            Add Property
          </button>
        </div>

        {/* error */}
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* list */}
        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <EmptyState onAdd={() => setOpen(true)} />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <li
                key={p.id || p._id || p.title}
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    <Home size={14} />
                    {p.type === "rented" ? "Rented" : "Owned"}
                  </span>
                  {p.city && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={14} />
                      {p.city}
                    </span>
                  )}
                </div>
                <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
                  {p.title}
                </h3>
                {p.address && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {p.address}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* modal */}
      {open && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/90 p-6 shadow-2xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add property</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm text-gray-600">Title</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none ring-indigo-200 transition focus:ring"
                  placeholder="Luxury Apartment, Gulberg"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-gray-600">Type</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none ring-indigo-200 transition focus:ring"
                >
                  <option value="owned">Owned</option>
                  <option value="rented">Rented</option>
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm text-gray-600">City</span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none ring-indigo-200 transition focus:ring"
                    placeholder="Lahore"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm text-gray-600">
                    Address
                  </span>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none ring-indigo-200 transition focus:ring"
                    placeholder="123-B, Main Boulevard"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving…
                  </span>
                ) : (
                  <>
                    <Plus size={18} />
                    Save property
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------- small presentational components --------- */

function SkeletonGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="animate-pulse rounded-xl border border-gray-100 bg-white p-4"
        >
          <div className="mb-3 h-5 w-24 rounded bg-gray-200" />
          <div className="h-6 w-2/3 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-3/4 rounded bg-gray-200" />
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
        <Home className="text-indigo-700" size={22} />
      </div>
      <h3 className="text-lg font-semibold">No properties yet</h3>
      <p className="mt-1 text-sm text-gray-600">
        Create your first listing to get started.
      </p>
      <button
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow transition hover:bg-indigo-700"
      >
        <Plus size={18} />
        Add property
      </button>
    </div>
  );
}