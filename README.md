# SubTrack — Subscription Tracker

A fullstack web application to track recurring subscriptions (Netflix, Spotify, gym, …).
Users register, log in, manage their subscriptions, and see a dashboard with total
monthly/yearly costs and cost-per-category charts.

> Portfolio project — built to demonstrate clean architecture and professional
> fullstack .NET development.

## Tech Stack

| Layer      | Technology                                                        |
| ---------- | ----------------------------------------------------------------- |
| Backend    | ASP.NET Core Web API (.NET 8), C#                                 |
| ORM        | Entity Framework Core + Npgsql                                    |
| Database   | PostgreSQL (Docker Compose)                                       |
| Auth       | JWT access + refresh tokens, BCrypt password hashing              |
| Validation | FluentValidation                                                  |
| API docs   | Swagger / OpenAPI (development)                                   |
| Frontend   | React 18 + Vite + Tailwind CSS                                    |
| Charts     | Recharts                                                          |
| HTTP       | axios (JWT interceptor + token refresh)                           |

## Project Structure

```
SubTrack/
├── backend/            # ASP.NET Core Web API (layered: Controllers/Services/Repositories/…)
├── frontend/           # React + Vite app
├── docker-compose.yml  # PostgreSQL (and later the API)
└── global.json         # Pins the .NET 8 SDK
```

## Screenshots

_Coming soon._

<!-- ![Dashboard](docs/dashboard.png) -->
<!-- ![Subscriptions](docs/subscriptions.png) -->

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 18+](https://nodejs.org/)

### 1. Start the database

```bash
docker compose up -d
```

### 2. Configure the backend secret

The JWT signing key is **not** committed. Provide it via user-secrets (dev) — the app
refuses to start without a key of at least 32 characters:

```bash
cd backend/SubTrack.Api
dotnet user-secrets init          # once, if not already initialised
dotnet user-secrets set "Jwt:Key" "$(openssl rand -base64 48)"
```

In production, supply it as the `Jwt__Key` environment variable instead. The database
connection string can likewise be overridden with `ConnectionStrings__DefaultConnection`.

### 3. Run the backend

```bash
cd backend/SubTrack.Api
dotnet run
```

The API runs at `http://localhost:5052` (Swagger UI at `http://localhost:5052/swagger`).
An HTTPS profile is also available at `https://localhost:7158`.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Roadmap / v2

- 📧 Email reminders before renewals
- 💱 Multi-currency support (currency conversion)
- 👥 Shared / family subscriptions
- 📤 CSV export

## License

MIT
