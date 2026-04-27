import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Roja</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Log in
          </Link>
          <Link href="/register" className="bg-black text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-gray-800 transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-gray-700">Properties available now</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-black max-w-3xl leading-[1.05]">
          Find your next<br />home — fast.
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl leading-relaxed">
          Roja matches tenants with landlords in seconds. Search by location, bedrooms, and budget. Book a viewing with one tap.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link href="/register?role=TENANT" className="bg-black text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition-colors text-base">
            Find a home
          </Link>
          <Link href="/register?role=LANDLORD" className="border-2 border-black text-black font-semibold px-8 py-4 rounded-full hover:bg-black hover:text-white transition-colors text-base">
            List your property
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">How Roja works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Search your area", desc: "Enter a city, set your bedroom count and budget. Roja shows every available property on a live map." },
              { step: "02", title: "Pick your favourite", desc: "Browse property cards, check photos, amenities, and landlord ratings — then select the one you love." },
              { step: "03", title: "Book instantly", desc: "Send a rental request with a single tap. The landlord accepts and you're one step from moving in." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-4">
                <span className="text-4xl font-bold text-gray-700">{step}</span>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "50+", label: "Properties" },
            { value: "2", label: "User types" },
            { value: "< 1 min", label: "To book" },
            { value: "Free", label: "To join" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold text-black">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-bold text-sm">Roja</span>
        </div>
        <p className="text-xs text-gray-400">© 2024 Roja. Your next home is a tap away.</p>
      </footer>
    </main>
  );
}
