# BuildIT — What changed (original → current)

Starting point: the July 2024 repo (React + Vite frontend, Express + PostgreSQL backend, 3 stocked categories). Everything below is now on `main`.

## Backend (`server/`) — fixes
- Secrets (DB password, JWT/session keys) moved out of code into environment variables (`server/.env.example` documents them).
- Passwords are now hashed (bcrypt) instead of stored as plaintext.
- Fixed login/register crash bugs, cart scoping per user, and the broken product-sort query.
- Checkout is now implemented end-to-end (was an unfinished stub): saves the order and clears the cart.
- Added `GET /health`, empty cart returns `[]` instead of an error, search input validated.
- Minor fixes: error handling, input validation, removed debug logging of credentials.
- Auth library upgraded for current Node versions; Express pinned to v4.

## Backend — new: seeded catalog
- `server/schema.sql` — full schema (accounts, products, cart, orders) plus `details`/`watts` columns for the builder.
- `server/seed_products.csv` + `server/seed.js` (`npm run seed`) — **52 products across all 14 categories and 24 brands**, each with a description and wattage. Idempotent; `--force` to reseed.

## Frontend (`Build-it/`) — new: Build-Your-Own-PC page
- New `/build` route: 7 guided steps (Processor → Graphics Card → Motherboard → Memory → Storage → Power Supply → Case), each with live store stock.
- Live running total, CPU↔motherboard socket check, PSU wattage-vs-load check, one-click "add all to cart".
- Linked from the nav, hero, products page, and empty cart.

## Frontend — restyle + dead-end fixes
- Full reskin: industrial brick-house theme in red/black/white, real brick-architecture photography, scroll reveals, 3D card tilt, animated hero canvas, marquee ticker, count-up stats, magnetic buttons.
- All headings rewritten as plain labels (categories match the database exactly); light workshop humor kept to taglines only.
- Fixed: missing `axios` dependency, broken absolute-path logo imports, cart quantity store bug, checkout request shape, guest checkout now redirects to login.
- Minor fixes: debounced search, loading/empty states everywhere, currency formatting, responsive layout.

## Repo hygiene
- Removed the committed `node_modules/` from tracking (1,200+ files) and added `.gitignore` (`node_modules/`, `dist/`, `.env`).
- Deleted 11 unused legacy stylesheets; added `Build-it/.env.example` (`VITE_API_URL`).

## Run it
```bash
# backend (needs PostgreSQL running)
cd server
copy .env.example .env   # then fill in PGPASSWORD + secrets
psql -h localhost -U postgres -d postgres -f schema.sql
npm install
npm run seed
node index.js            # :5000

# frontend
cd Build-it
npm install
npm run dev -- --port 5175
```
