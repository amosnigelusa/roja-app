"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { PropertyStatusBadge } from "@/components/StatusBadge";
import { Property } from "@/types";

const AMENITY_ICONS: Record<string, string> = {
  "WiFi": "📶", "Parking": "🚗", "Pool": "🏊", "Gym": "💪",
  "Security": "🔒", "Garden": "🌿", "Laundry": "🫧", "Pet-friendly": "🐾",
  "Furnished": "🛋️", "Balcony": "🏙️", "Air conditioning": "❄️",
  "Borehole": "💧", "Solar": "☀️",
};

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<Property & { avgRating?: number | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingDone, setBookingDone] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((r) => r.json())
      .then(setProperty)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleBooking() {
    setBooking(true);
    setBookingError("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: id, message, moveInDate: moveIn || undefined }),
    });
    if (!res.ok) {
      const data = await res.json();
      setBookingError(data.error || "Failed to send request");
    } else {
      setBookingDone(true);
      setShowBooking(false);
    }
    setBooking(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse mb-6" />
          <div className="h-8 bg-gray-100 rounded-lg animate-pulse mb-3 w-2/3" />
          <div className="h-5 bg-gray-100 rounded-lg animate-pulse w-1/3" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-2xl font-bold mb-2">Property not found</p>
          <Link href="/tenant/search" className="text-sm text-gray-500 hover:text-black">
            ← Back to search
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const amenities = property.amenities || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {/* Back link */}
        <Link href="/tenant/search" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6 transition-colors">
          ← Back to search
        </Link>

        {/* Image gallery */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-6 aspect-[16/9]">
          {images.length > 0 ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[imageIndex]} alt={property.title} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImageIndex(i)}
                        className={`w-2 h-2 rounded-full ${i === imageIndex ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl">🏠</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <PropertyStatusBadge status={property.status} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: details */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {property.type} · {property.suburb}, {property.city}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{property.title}</h1>
              </div>
              {property.avgRating && (
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl px-3 py-2">
                  <span className="text-yellow-400">★</span>
                  <span className="font-bold text-sm">{property.avgRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({property.reviews?.length})</span>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 py-5 border-y border-gray-100 my-5">
              <div className="text-center">
                <p className="text-xl font-bold">{property.bedrooms}</p>
                <p className="text-xs text-gray-500 mt-0.5">Bedroom{property.bedrooms !== 1 ? "s" : ""}</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{property.bathrooms}</p>
                <p className="text-xs text-gray-500 mt-0.5">Bathroom{property.bathrooms !== 1 ? "s" : ""}</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">${property.price.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-0.5">Per month</p>
              </div>
            </div>

            {/* Address */}
            <div className="mb-5">
              <h2 className="font-semibold mb-1">Location</h2>
              <p className="text-gray-600 text-sm">{property.address}, {property.suburb}, {property.city}</p>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h2 className="font-semibold mb-2">About this property</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="mb-5">
                <h2 className="font-semibold mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <span key={a} className="flex items-center gap-1.5 bg-gray-100 rounded-xl px-3 py-2 text-sm">
                      <span>{AMENITY_ICONS[a] || "✓"}</span>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {property.reviews && property.reviews.length > 0 && (
              <div>
                <h2 className="font-semibold mb-4">Reviews</h2>
                <div className="flex flex-col gap-4">
                  {property.reviews.map((r) => (
                    <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{r.tenant?.name?.[0]}</span>
                          </div>
                          <span className="text-sm font-medium">{r.tenant?.name}</span>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < r.rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: landlord + booking card */}
          <div className="lg:w-80">
            <div className="sticky top-24 border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-2xl font-bold mb-1">
                ${property.price.toLocaleString()}
                <span className="text-sm font-normal text-gray-500"> / month</span>
              </p>

              {/* Landlord */}
              {property.landlord && (
                <div className="flex items-center gap-3 my-5 pb-5 border-b border-gray-100">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">{property.landlord.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Hosted by</p>
                    <p className="font-semibold">{property.landlord.name}</p>
                    {property.landlord.phone && (
                      <p className="text-xs text-gray-500">{property.landlord.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {bookingDone ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="font-semibold text-green-800">Request sent!</p>
                  <p className="text-xs text-green-600 mt-1">The landlord will respond shortly</p>
                  <Link href="/tenant/bookings" className="mt-3 block text-xs font-semibold text-green-700 hover:underline">
                    View my bookings →
                  </Link>
                </div>
              ) : property.status === "AVAILABLE" ? (
                <>
                  {!showBooking ? (
                    <button
                      onClick={() => setShowBooking(true)}
                      className="w-full bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Request to rent
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Move-in date</label>
                        <input
                          type="date"
                          value={moveIn}
                          onChange={(e) => setMoveIn(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Message to landlord</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          placeholder="Hi, I'm interested in renting your property..."
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                        />
                      </div>
                      {bookingError && (
                        <p className="text-xs text-red-600">{bookingError}</p>
                      )}
                      <button
                        onClick={handleBooking}
                        disabled={booking}
                        className="w-full bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {booking ? "Sending..." : "Send request"}
                      </button>
                      <button
                        onClick={() => setShowBooking(false)}
                        className="w-full text-sm text-gray-500 hover:text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">This property is currently not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
