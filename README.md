# FixFleet C++ REST API

This API adapter uses the project's existing `Customer`, `ServiceProvider`, `Booking`,
`Payment` and `Notification` domain classes. It exposes the HTTP contract used by the
React frontend.

## Requirements
- CMake 3.20+
- C++17 compiler (Visual Studio 2022 or recent MinGW)
- Internet connection on the first CMake configure, to fetch cpp-httplib and nlohmann/json

## Build on Windows (PowerShell, from this backend folder)
```powershell
cmake -S . -B build
cmake --build build --config Release
```
Then run:
```powershell
.\build\Release\fixfleet_api.exe
```
For single-configuration generators, the executable may be in `build\fixfleet_api.exe`.

API listens on `http://localhost:18080`. React uses this same base URL by default.

## Routes
- `GET /api/health`
- `GET /api/services`
- `GET /api/providers`
- `GET /api/bookings?customerId=301`
- `POST /api/bookings`
- `PUT /api/bookings/:id/accept`
- `PUT /api/bookings/:id/reject`
- `PUT /api/bookings/:id/cancel`
- `PUT /api/bookings/:id/complete`

## Important current limitations
- This is an in-memory demo API. Bookings reset when the server stops.
- The existing project classes are console-oriented and have limited getters, so the
  adapter keeps the extra fields needed by the UI in API records while using the
  existing `Booking` object for booking status transitions.
- No real payment gateway, authentication, database, SMS, or email delivery is configured.
- CORS currently permits the Vite development origin `http://localhost:5173`.
