"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Property, PropertyType } from "@/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const PROPERTY_TYPES: { value: PropertyType | ""; label: string }[] = [
  { value: "", label: "Any type" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "STUDIO", label: "Studio" },
  { value: "ROOM", label: "Room" },
];

export default function TenantSearchPage() {
  const [city, setCity] = useState("Harare");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [type, setType] = useState<PropertyType | "">("");
  const [properties, setProperties] = useState<(Property & { avgRating?: number | null })[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedProperty = properties.find((p) => p.id === selectedId);

  const search = useCallback(async () => {
    setLoading(true);
    setSelectedId(null);
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (bedrooms) params.set("bedrooms", String(bedrooms));
    if (maxPrice) params.set("maxPrice", String(maxPrice));
    if (type) params.set("type", type);

    const res = await fetch(`/api/properties?${params}`);
    const data = await res.json();
    setProperties(Array.isArray(data) ? data : []);
    setSearched(true);
    setLoading(false);
  }, [city, bedrooms, maxPrice, type]);

  useEffect(() => {
    search();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
    const el = listRef.current?.querySelector(`[data-id="${id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  const mapCenter: [number, number] | undefined =
    properties.length > 0
      ? [properties[0].latitude, properties[0].longitude]
      : undefined;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />

      {/* Search bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 shadow-sm z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-end">
          <div className="flex flex-col gap-1 flex-1 min-w-36">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="City or suburb"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex flex-col gap-1 w-28">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value === "" ? "" : Number(e.target.value))}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} bed{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-36">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max price / mo</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="$ 2 000"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex flex-col gap-1 w-36">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PropertyType | "")}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={search}
            disabled={loading}
            className="bg-black text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Property list */}
        <div
          ref={listRef}
          className="w-full sm:w-96 lg:w-[420px] shrink-0 overflow-y-auto bg-white border-r border-gray-100"
        >
          <div className="p-4">
            {searched && (
              <p className="text-xs text-gray-500 font-medium mb-3">
                {properties.length} {properties.length === 1 ? "property" : "properties"} found
                {city && ` in ${city}`}
              </p>
            )}

            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : properties.length === 0 && searched ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🏚️</div>
                <h3 className="font-semibold text-gray-800">No properties found</h3>
                <p className="text-sm text-gray-500 mt-2">Try a different city or adjust your filters</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {properties.map((p) => (
                  <div key={p.id} data-id={p.id}>
                    <PropertyCard
                      property={p}
                      selected={p.id === selectedId}
                      onClick={() => handleSelect(p.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="hidden sm:flex flex-1 relative">
          {properties.length > 0 ? (
            <MapView
              properties={properties}
              selectedId={selectedId}
              onSelect={handleSelect}
              center={mapCenter}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <p className="text-gray-400 text-sm">Search to see properties on the map</p>
            </div>
          )}

          {/* Selected property popup */}
          {selectedProperty && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 z-20 shadow-2xl">
              <div className="relative">
                <PropertyCard property={selectedProperty} />
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-3 right-3 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-black shadow-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
