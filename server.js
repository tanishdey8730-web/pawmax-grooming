// Groom with PawMax — backend server
// Serves the static HTML pages and exposes a tiny bookings API.

const express = require("express");
const fs      = require("fs");
const path    = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;
const DB   = path.join(__dirname, "bookings.json");

app.use(express.json());

// ---- Static frontend ----
app.use(express.static(__dirname, { extensions: ["html"] }));

// Default route -> the new booking site (index2.html)
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index2.html"));
});

// Mobile-app version still reachable
app.get("/app", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ---- Helpers ----
function readBookings() {
  try {
    if (!fs.existsSync(DB)) return [];
    return JSON.parse(fs.readFileSync(DB, "utf8") || "[]");
  } catch (e) {
    console.error("Failed reading bookings.json:", e);
    return [];
  }
}

function writeBookings(list) {
  fs.writeFileSync(DB, JSON.stringify(list, null, 2));
}

// ---- API ----

// GET /api/bookings -> list all bookings (admin view)
app.get("/api/bookings", (_req, res) => {
  res.json({ ok: true, bookings: readBookings() });
});

// POST /api/bookings -> create a new booking
app.post("/api/bookings", (req, res) => {
  const b = req.body || {};
  const required = ["service", "date", "time", "petName", "ownerName", "phone"];
  const missing  = required.filter(k => !b[k] || String(b[k]).trim() === "");

  if (missing.length) {
    return res.status(400).json({ ok: false, error: "Missing fields", missing });
  }
  if (!/^\d{10}$/.test(String(b.phone))) {
    return res.status(400).json({ ok: false, error: "Phone must be 10 digits" });
  }

  const booking = {
    id:        "BK" + Date.now().toString(36).toUpperCase(),
    service:   b.service,
    date:      b.date,
    time:      b.time,
    petName:   b.petName,
    petType:   b.petType || "dog",
    breed:     b.breed   || "",
    notes:     b.notes   || "",
    ownerName: b.ownerName,
    phone:     b.phone,
    price:     b.price || 0,
    createdAt: new Date().toISOString(),
    status:    "confirmed",
  };

  const list = readBookings();
  list.push(booking);
  writeBookings(list);

  console.log(`✓ New booking ${booking.id} — ${booking.petName} (${booking.service}) on ${booking.date} ${booking.time}`);
  res.json({ ok: true, booking });
});

// DELETE /api/bookings/:id -> cancel
app.delete("/api/bookings/:id", (req, res) => {
  const list  = readBookings();
  const next  = list.filter(b => b.id !== req.params.id);
  if (next.length === list.length) {
    return res.status(404).json({ ok: false, error: "Booking not found" });
  }
  writeBookings(next);
  res.json({ ok: true });
});

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// ---- Start ----
app.listen(PORT, () => {
  console.log(`\n🐾 Groom with PawMax server running`);
  console.log(`   → Booking site:   http://localhost:${PORT}/`);
  console.log(`   → Mobile app:     http://localhost:${PORT}/app`);
  console.log(`   → API bookings:   http://localhost:${PORT}/api/bookings`);
  console.log(`   → Health check:   http://localhost:${PORT}/api/health\n`);
});
