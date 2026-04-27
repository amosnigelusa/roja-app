"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { PropertyStatusBadge } from "@/components/StatusBadge";
import { Property } from "@/types";

export default function LandlordPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/properties/mine");
    const data = await res.json();
    setProperties(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleStatus(id: string, current: string) {
    const next = current === "AVAILABLE" ? "RENTED" : "AVAILABLE";
    await fetch(`/api/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    load();
  }

  async function deleteProperty(id: string) {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your rental listings</p>
          </div>
          <Link href="/landlord/properties/new" className="bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
            + Add property
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="font-bold text-xl mb-2">No properties yet</h2>
            <p className="text-gray-500 text-sm mb-6">List your first property to start finding tenants</p>
            <Link href="/landlord/properties/new" className="bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
              Add a property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {properties.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-400 transition-colors">
                <div className="h-40 bg-gray-100 relative">
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
                  )}
                  <div className="absolute top-3 left-3">
                    <PropertyStatusBadge status={p.status} />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold truncate">{p.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{p.suburb}, {p.city}</p>
                  <div className="flex gap-3 text-xs text-gray-500 mt-2">
                    <span>{p.bedrooms} bed</span>
                    <span>·</span>
                    <span>{p.bathrooms} bath</span>
                    <span>·</span>
                    <span className="font-semibold text-black">${p.price.toLocaleString()}/mo</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/landlord/requests?property=${p.id}`}
                      className="flex-1 text-center text-xs font-semibold py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Requests
                    </Link>
                    <button
                      onClick={() => toggleStatus(p.id, p.status)}
                      className="flex-1 text-xs font-semibold py-2 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      {p.status === "AVAILABLE" ? "Mark rented" : "Mark available"}
                    </button>
                    <button
                      onClick={() => deleteProperty(p.id)}
                      className="px-3 text-xs font-semibold py-2 text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
