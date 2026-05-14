# 🐾 Groom with PawMax

Premium pet grooming slot booking website — Node + React (CDN) single-file frontend with a tiny Express backend.

## What's inside

| File | Purpose |
|---|---|
| `index2.html` | The main desktop booking website (`/`) |
| `index.html`  | The mobile-app style version (`/app`) |
| `server.js`   | Express backend that serves the pages + bookings API |
| `package.json`| Dependencies & scripts |
| `bookings.json` | Auto-created by the server to store confirmed bookings |

## Run locally

```bash
# 1. Install (one-time)
npm install

# 2. Start the server
npm start
```

Then open **http://localhost:3000** in your browser.

| Route | What it serves |
|---|---|
| `http://localhost:3000/`              | Main booking website (`index2.html`) |
| `http://localhost:3000/app`           | Mobile-app version (`index.html`) |
| `http://localhost:3000/api/health`    | Server health check |
| `http://localhost:3000/api/bookings`  | List of all bookings (JSON) |

## API

### `POST /api/bookings`
Create a new booking. The frontend automatically calls this when a customer clicks **Confirm Booking**.

**Body:**
```json
{
  "service": "Full Groom",
  "date":    "2026-05-15",
  "time":    "11:00",
  "petName": "Bruno",
  "petType": "dog",
  "breed":   "Labrador",
  "notes":   "Anxious",
  "ownerName": "Riya K.",
  "phone":   "9830000001",
  "price":   1399
}
```

**Returns:**
```json
{ "ok": true, "booking": { "id": "BKABC123", "...": "..." } }
```

### `GET /api/bookings`
Returns all stored bookings — useful as an admin dashboard endpoint.

### `DELETE /api/bookings/:id`
Cancel a booking by id.

## Deploy

This is a standard Node.js app — runs on any host that supports Node:

- **Render / Railway / Fly.io** — push the repo, set the start command to `npm start`, expose port `3000`.
- **Vercel / Netlify** — for serverless deploys you'd convert `server.js` into API routes; or just deploy `index2.html` as a static site (the booking POST will silently fail but the UI still works).
- **VPS** — `node server.js` behind nginx + PM2.

Set the `PORT` env variable to override the default `3000`.
