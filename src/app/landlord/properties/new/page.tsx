"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const AMENITY_OPTIONS = [
  "WiFi", "Parking", "Pool", "Gym", "Security", "Garden",
  "Laundry", "Pet-friendly", "Furnished", "Balcony", "Air conditioning", "Borehole", "Solar",
];

const PROPERTY_TYPES = ["APARTMENT", "HOUSE", "TOWNHOUSE", "STUDIO", "ROOM"];

// Coordinates for Harare suburbs — used to place map pins when a property is listed
const CITY_COORDS: Record<string, [number, number]> = {
  "Harare":             [-17.8252, 31.0335],
  "Borrowdale":         [-17.7421, 31.0812],
  "Borrowdale Brooke":  [-17.7310, 31.0920],
  "Greystone Park":     [-17.7512, 31.0678],
  "Vainona":            [-17.7623, 31.0756],
  "Glen Lorne":         [-17.7345, 31.1023],
  "Mount Pleasant":     [-17.7651, 31.0590],
  "Avondale":           [-17.7883, 31.0269],
  "Avondale West":      [-17.7923, 31.0189],
  "Marlborough":        [-17.7934, 31.0134],
  "Monavale":           [-17.7956, 31.0156],
  "Mandara":            [-17.7812, 31.1234],
  "Highlands":          [-17.8089, 31.0678],
  "Newlands":           [-17.8345, 31.0312],
  "Belgravia":          [-17.8201, 31.0456],
  "Avenues":            [-17.8278, 31.0478],
  "Strathaven":         [-17.8456, 31.0567],
  "Greendale":          [-17.8012, 31.1023],
  "Eastlea":            [-17.8234, 31.0934],
  "Greencroft":         [-17.8134, 31.0078],
  "Westgate":           [-17.8067, 30.9934],
  "Tynwald":            [-17.8167, 31.0023],
  "Madokero":           [-17.8034, 30.9867],
  "Belvedere":          [-17.8312, 31.0212],
  "Waterfalls":         [-17.8745, 31.0456],
  "Arlington":          [-17.8645, 31.0089],
  "Msasa Park":         [-17.8567, 31.1134],
  "Aspindale Park":     [-17.8634, 31.0134],
  "Budiriro":           [-17.8834, 31.0156],
  "Mbare":              [-17.8612, 31.0234],
};

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [suburb, setSuburb] = useState("Borrowdale");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  function toggleAmenity(a: string) {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;

    const coords = CITY_COORDS[suburb] || [-17.8252, 31.0335];
    // Slight random offset so pins don't all stack
    const lat = coords[0] + (Math.random() - 0.5) * 0.05;
    const lng = coords[1] + (Math.random() - 0.5) * 0.05;

    const images = imageUrls.filter(Boolean);

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: get("title"),
        description: get("description"),
        address: get("address"),
        suburb,
        city: "Harare",
        latitude: lat,
        longitude: lng,
        bedrooms: get("bedrooms"),
        bathrooms: get("bathrooms"),
        price: get("price"),
        type: get("type"),
        images,
        amenities: selectedAmenities,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create property");
      setLoading(false);
      return;
    }

    router.push("/landlord/properties");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10">
        <Link href="/landlord/properties" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6">
          ← Back to properties
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-8">List a new property</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Basic info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-bold text-lg">Basic information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Property title</label>
                <input name="title" required placeholder="e.g. Modern 2-bed apartment in Borrowdale" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Property type</label>
                <select name="type" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white">
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Monthly rent (R)</label>
                <input name="price" type="number" required min={1} placeholder="12000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Bedrooms</label>
                <input name="bedrooms" type="number" required min={1} max={20} placeholder="2" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Bathrooms</label>
                <input name="bathrooms" type="number" required min={1} max={20} placeholder="1" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea name="description" required rows={4} placeholder="Describe your property — key features, nearby amenities, etc." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-bold text-lg">Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Street address</label>
                <input name="address" required placeholder="123 Main Street" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Suburb</label>
                <select
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  {Object.keys(CITY_COORDS).filter(k => k !== "Harare").sort().map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">City</label>
                <input readOnly value="Harare" className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-default" />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    selectedAmenities.includes(a)
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">Photos <span className="text-sm font-normal text-gray-400">(optional — paste image URLs)</span></h2>
            <div className="flex flex-col gap-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={url}
                    onChange={(e) => {
                      const next = [...imageUrls];
                      next[i] = e.target.value;
                      setImageUrls(next);
                    }}
                    placeholder={`Image URL ${i + 1}`}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {imageUrls.length > 1 && (
                    <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))} className="text-red-400 text-lg px-2">×</button>
                  )}
                </div>
              ))}
              {imageUrls.length < 6 && (
                <button type="button" onClick={() => setImageUrls([...imageUrls, ""])} className="text-sm text-gray-500 hover:text-black text-left mt-1">
                  + Add another photo
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 text-base"
          >
            {loading ? "Listing property..." : "List property"}
          </button>
        </form>
      </div>
    </div>
  );
}
