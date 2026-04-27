"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { BookingStatusBadge } from "@/components/StatusBadge";
import { BookingRequest } from "@/types";

export default function TenantBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function cancel(id: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    load();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-gray-500 text-sm mt-1">Track your rental requests</p>
          </div>
          <Link href="/tenant/search" className="bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
            + Search
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏡</div>
            <h2 className="font-bold text-xl mb-2">No bookings yet</h2>
            <p className="text-gray-500 text-sm mb-6">Find a property you love and send a request</p>
            <Link href="/tenant/search" className="bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
              Browse properties
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-400 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BookingStatusBadge status={b.status} />
                      <span className="text-xs text-gray-400">
                        {new Date(b.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <Link href={`/tenant/property/${b.property?.id}`}>
                      <h3 className="font-semibold text-base hover:underline">{b.property?.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {b.property?.address}
                    </p>
                  </div>
                  <p className="font-bold text-base whitespace-nowrap">
                    ${b.property?.price?.toLocaleString()}<span className="text-xs font-normal text-gray-500">/mo</span>
                  </p>
                </div>

                {/* Landlord */}
                {b.property?.landlord && (
                  <div className="flex items-center gap-2 py-3 border-t border-gray-100">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{b.property.landlord.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Landlord</p>
                      <p className="text-sm font-medium">{b.property.landlord.name}</p>
                    </div>
                    {b.property.landlord.phone && b.status === "ACCEPTED" && (
                      <a href={`tel:${b.property.landlord.phone}`} className="ml-auto text-xs font-semibold bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800">
                        Call
                      </a>
                    )}
                  </div>
                )}

                {b.message && (
                  <p className="text-xs text-gray-500 italic mt-2 pt-2 border-t border-gray-100">
                    &ldquo;{b.message}&rdquo;
                  </p>
                )}

                {b.status === "ACCEPTED" && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <p className="text-sm font-semibold text-green-800">🎉 Your request was accepted!</p>
                    <p className="text-xs text-green-600 mt-0.5">Contact the landlord to finalise your move-in</p>
                  </div>
                )}

                {b.status === "PENDING" && (
                  <button
                    onClick={() => cancel(b.id)}
                    className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Cancel request
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
