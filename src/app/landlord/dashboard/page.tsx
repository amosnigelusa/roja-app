"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { PropertyStatusBadge, BookingStatusBadge } from "@/components/StatusBadge";
import { Property, BookingRequest } from "@/types";

export default function LandlordDashboard() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/properties?landlord=me").then((r) => r.json()),
      fetch("/api/bookings").then((r) => r.json()),
    ]).then(([props, reqs]) => {
      const myProps = Array.isArray(props) ? props.filter((p: Property) => p.landlordId === session?.user?.id || true) : [];
      setProperties(myProps);
      setRequests(Array.isArray(reqs) ? reqs : []);
      setLoading(false);
    });
  }, [session]);

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const availableCount = properties.filter((p) => p.status === "AVAILABLE").length;
  const totalEarnings = properties
    .filter((p) => p.status === "RENTED")
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Good {new Date().getHours() < 12 ? "morning" : "afternoon"},{" "}
              {session?.user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here&apos;s your property overview</p>
          </div>
          <Link
            href="/landlord/properties/new"
            className="bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            + Add property
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total properties", value: properties.length, icon: "🏠" },
            { label: "Available", value: availableCount, icon: "✅" },
            { label: "Pending requests", value: pendingCount, icon: "📬", highlight: pendingCount > 0 },
            { label: "Monthly income", value: `$${totalEarnings.toLocaleString()}`, icon: "💰" },
          ].map(({ label, value, icon, highlight }) => (
            <div
              key={label}
              className={`bg-white border rounded-2xl p-5 ${highlight ? "border-black" : "border-gray-200"}`}
            >
              <span className="text-2xl">{icon}</span>
              <p className={`text-2xl font-bold mt-2 ${highlight ? "text-black" : ""}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent requests */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Recent requests</h2>
              <Link href="/landlord/requests" className="text-xs font-semibold text-gray-500 hover:text-black">
                See all →
              </Link>
            </div>
            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : requests.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">No requests yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {requests.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-sm font-bold">{r.tenant?.name?.[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{r.tenant?.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-36">{r.property?.title}</p>
                      </div>
                    </div>
                    <BookingStatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My properties */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">My properties</h2>
              <Link href="/landlord/properties" className="text-xs font-semibold text-gray-500 hover:text-black">
                Manage →
              </Link>
            </div>
            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400 mb-4">No properties listed yet</p>
                <Link href="/landlord/properties/new" className="text-sm font-semibold hover:underline">
                  + Add your first property
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {properties.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold truncate max-w-48">{p.title}</p>
                      <p className="text-xs text-gray-500">${p.price.toLocaleString()}/mo · {p.bedrooms} bed</p>
                    </div>
                    <PropertyStatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
