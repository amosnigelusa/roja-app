import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Roja – Find Your Next Home",
  description: "Roja connects tenants with landlords. Search available properties by location, bedrooms, and price.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="h-full bg-white text-black antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
