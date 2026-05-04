# Roja — Rental Property Platform

A rental property marketplace connecting landlords and tenants in South Africa.

**Live app:** [https://roja-app-two.vercel.app](https://roja-app-two.vercel.app)

## Features

- Browse and search rental properties by city, bedrooms, price, and type
- Tenant accounts: save favourites, submit booking requests, leave reviews
- Landlord accounts: list properties, manage booking requests, track income
- Interactive map view powered by Leaflet
- Authentication via NextAuth v5 (email/password)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Turso (libSQL cloud SQLite) via Prisma 7 + `@prisma/adapter-libsql`
- **Auth:** NextAuth v5
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Tenant | `alice@example.com` | `password123` |
| Landlord | `james@roja.co.za` | `password123` |
| Tenant | `amonigel@gmail.com` | `Password123` |
| Landlord | `amonigel.landlord@gmail.com` | `Password123` |

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The local dev server uses a SQLite file (`dev.db`) instead of Turso. Run the seed script to populate it:

```bash
npm run db:push
npm run db:seed
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Turso database URL (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | Turso JWT auth token |
| `NEXTAUTH_SECRET` | Secret for NextAuth session signing |
