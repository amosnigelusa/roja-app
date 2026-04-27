"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { BookingStatusBadge } from "@/components/StatusBadge";
import { BookingRequest } from "@/types";

function RequestsList() {
  const searchParams = useSearchParams();
  const propertyFilter = searchParams.get("property");
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const params = propertyFilter ? `?propertyId=${propertyFilter}` : "";
    const res = await fetch(`/api/bookings${params}`);
    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [propertyFilter]);

  async function respond(id: string, status: "ACCEPTED" | "REJECTED") {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const pending = requests.filter((r) => r.status === "PENDING");
  const others = requests.filter((r) => r.status !== "PENDING");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Rental Requests</h1>
          <p className="text-gray-500 text-sm mt-1">
            {propertyFilter ? "Requests for selected property" : "All incoming requests from tenants"}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="font-bold text-xl mb-2">No requests yet</h2>
            <p className="text-gray-500 text-sm">When tenants request your properties, they&apos;ll appear here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {pending.length > 0 && (
              <div>
                <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">
                  Pending ({pending.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {pending.map((r) => <RequestCard key={r.id} request={r} onRespond={respond} />)}
                </div>
              </div>
            )}
            {others.length > 0 && (
              <div>
                <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">
                  History
                </h2>
                <div className="flex flex-col gap-3">
                  {others.map((r) => <RequestCard key={r.id} request={r} onRespond={respond} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RequestCard({ request: r, onRespond }: {
  request: BookingRequest;
  onRespond: (id: string, status: "ACCEPTED" | "REJECTED") => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-lg font-bold">{r.tenant?.name?.[0]}</span>
          </div>
          <div>
            <p className="font-bold">{r.tenant?.name}</p>
            <p className="text-sm text-gray-500">{r.tenant?.email}</p>
            {r.tenant?.phone && <p className="text-sm text-gray-500">{r.tenant.phone}</p>}
          </div>
        </div>
        <BookingStatusBadge status={r.status} />
      </div>

      <div className="bg-gray-50 rounded-xl p-3 mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-1">Property</p>
        <p className="text-sm font-medium">{r.property?.title}</p>
        <p className="text-xs text-gray-500">${r.property?.price?.toLocaleString()}/mo</p>
      </div>

      {r.moveInDate && (
        <p className="text-sm text-gray-600 mb-3">
          <span className="font-medium">Desired move-in:</span>{" "}
          {new Date(r.moveInDate).toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      )}

      {r.message && (
        <div className="border-l-4 border-gray-200 pl-3 mb-4">
          <p className="text-sm text-gray-600 italic">&ldquo;{r.message}&rdquo;</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-gray-400">
          Received {new Date(r.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
        </p>
        {r.status === "PENDING" && (
          <div className="flex gap-2">
            <button
              onClick={() => onRespond(r.id, "REJECTED")}
              className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:border-red-200 hover:text-red-600 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={() => onRespond(r.id, "ACCEPTED")}
              className="px-4 py-2 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RequestsPage() {
  return (
    <Suspense>
      <RequestsList />
    </Suspense>
  );
}
