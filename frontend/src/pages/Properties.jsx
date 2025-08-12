import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../auth/AuthContext";

export default function Properties() {
  const { logout } = useAuth();
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({ title: "", type: "owned", city: "", address: "" });

  useEffect(() => {
    api("/api/properties/")
      .then(setProperties)
      .catch(console.error);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const newProp = await api("/api/properties/", {
      method: "POST",
      body: form,
    });
    setProperties([newProp, ...properties]);
    setForm({ title: "", type: "owned", city: "", address: "" });
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="owned">Owned</option>
          <option value="rented">Rented</option>
        </select>
        <input
          type="text"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Add Property
        </button>
      </form>

      <ul className="space-y-2">
        {properties.map((p) => (
          <li key={p.id} className="border p-3 rounded bg-gray-50">
            <strong>{p.title}</strong> — {p.type} — {p.city}
          </li>
        ))}
      </ul>
    </div>
  );
}