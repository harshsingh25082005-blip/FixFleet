# FixFleet

A React + CSS + JavaScript frontend for the FixFleet home-service booking project.

## Run the frontend

Requirements: Node.js 18+ and npm.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Current state

- Responsive customer dashboard and provider-mode dashboard shell.
- Service categories, provider directory, provider profile, booking form, booking history, status actions, payment summary and notification panel.
- Demo data is included so the UI can be explored before the C++ API is ready.
- `src/api.js` is the only frontend-to-backend boundary. It calls the proposed REST API when available. If the API is unavailable, the UI stays usable in demo mode.

**Important:** The existing FixFleet C++ application is currently a console program (`main.cpp` and domain headers). A browser cannot call those C++ classes directly. The frontend is prepared for an HTTP/JSON layer, but it is not yet connected to live C++ data.

## Proposed C++ REST API contract

Configure the API base URL with `VITE_API_BASE_URL` (default `http://localhost:18080/api`). The frontend expects:

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | Health check, returns JSON |
| GET | `/services` | List service categories |
| GET | `/providers` | List service providers |
| GET | `/bookings?customerId=301` | List bookings |
| POST | `/bookings` | Create a booking |
| PUT | `/bookings/:id/accept` | Provider accepts request |
| PUT | `/bookings/:id/reject` | Provider rejects request |
| PUT | `/bookings/:id/cancel` | Customer cancels booking |
| PUT | `/bookings/:id/complete` | Provider completes job |

### Example booking request

```json
{
  "customerId": 301,
  "customerName": "Harsh Singh",
  "providerId": 205,
  "service": "Electrical Repair",
  "date": "2026-11-18",
  "time": "10:00 AM",
  "location": "Geeta Residency, Gandhinagar",
  "amount": 500
}
```

### Example booking response

```json
{
  "id": 1004,
  "status": "Pending",
  "service": "Electrical Repair",
  "providerId": 205,
  "providerName": "Amit Kumar",
  "amount": 500
}
```

The response shape can be adjusted to match the actual C++ structs/classes. Add CORS support in the C++ server for the Vite origin (`http://localhost:5173`). Do not expose payment credentials or trust client-submitted amounts; the C++ server should validate provider, slot availability and price.

## Suggested backend integration layout

Keep the existing domain headers and business rules. Add an HTTP adapter such as `server.cpp` using Crow (or another lightweight C++ HTTP framework). The adapter should translate JSON into the existing `Customer`, `ServiceProvider`, `Booking`, `TimeSlot`, `Payment`, `Refund` and `Notification` operations. The current frontend routes are an integration contract, not a claim that these endpoints already exist.
