"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const role = session?.user?.role;

  const navLinks =
    role === "LANDLORD"
      ? [
          { href: "/landlord/dashboard", label: "Dashboard" },
          { href: "/landlord/properties", label: "My Properties" },
          { href: "/landlord/requests", label: "Requests" },
        ]
      : [
          { href: "/tenant/search", label: "Search" },
          { href: "/tenant/bookings", label: "My Bookings" },
        ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Roja</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2 hover:shadow-md transition-shadow"
          >
            <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
            <span className="text-sm font-medium hidden sm:block max-w-28 truncate">
              {session?.user?.name || "Account"}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{role}</p>
                <p className="text-sm font-medium truncate mt-0.5">{session?.user?.email}</p>
              </div>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
