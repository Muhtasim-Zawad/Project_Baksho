# Project Baksho

> **Baksho** — *Make Dreams Reality* — a modern, full-stack crowdfunding platform.

Project Baksho (Bengali for "box", as in a donation box) is a complete crowdfunding platform that connects project creators with supporters. It is built as a **microservices backend** (API Gateway, service registry, and dedicated services for users, campaigns, notifications, and payments) with a **Next.js frontend**, all containerized with Docker Compose.

---

## 📖 Overview

Baksho enables anyone to launch a fundraising campaign (a school project, a medical emergency, a creative venture, a community initiative), offer reward tiers to backers, collect donations online, and track progress — all with a dedicated admin panel for moderation, user management, and analytics.

The system is split into independent, discoverable services:

| Layer | Stack |
|---|---|
| Frontend | Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui |
| API Gateway | Spring Boot 3 (JWT auth at the edge) |
| Service Discovery | Netflix Eureka |
| Services | Node.js (Express), Python (FastAPI), Java (Spring Boot) |
| Databases | MongoDB, MySQL, SQLite |
| Object Storage | MinIO (S3-compatible) |
| Payments | Stripe |
| Containerization | Docker & Docker Compose |

---

## 🎯 Business Goals

- **Democratize fundraising** — give individuals, small teams, and communities a low-friction way to raise money for projects and causes without traditional institutional backing.
- **Drive creator success** — provide discovery (categories, search, sort), reward/incentive tiers, and progress tracking so campaigns reach their goals.
- **Build trust & transparency** — every campaign shows live fundraising progress, backer counts, and an explicit approval/moderation workflow run by admins.
- **Monetize sustainably** — Stripe-powered payments with room to grow into transaction fees, featured-campaign promotions, and premium analytics.
- **Scale independently** — microservice boundaries (users, campaigns, notifications, payments) let each domain scale, deploy, and evolve on its own.

---

## 👥 Use Cases

### For Campaign Creators
- Create a campaign with a multi-step wizard (basic info → story & media → incentive tiers → review).
- Upload campaign images via pre-signed MinIO/S3 URLs.
- Offer **incentive tiers** (reward levels) to encourage larger pledges.
- Track donations, backer counts, and support through the user dashboard.
- Receive in-app notifications when an admin approves or rejects a campaign.

### For Backers / Donors
- Browse campaigns by category, search, and sort (featured, newest, ending soon, popular, most funded).
- View detailed campaign pages with image galleries, stories, and fundraising progress.
- Donate instantly via Stripe card checkout, optionally using a preset or custom amount.
- See every campaign they supported, plus earned incentives, on their dashboard.

### For Administrators
- Review, approve, or reject pending campaigns (with rejection notes).
- Manage users: search/filter, change roles, ban/unban.
- Monitor platform health through an analytics dashboard.
- Approve/reject actions notify the affected campaign organizer automatically.

---

## ✨ Key Features

- **Authentication & authorization** — signup/login with JWT access & refresh tokens; role-based access for users and admins; gateway-level JWT validation.
- **Campaign management** — full CRUD for campaigns, incentive tiers, approval status, pagination, and ownership checks.
- **Payment processing** — Stripe PaymentIntents for card checkout and a payment ledger in MySQL.
- **Notifications** — per-user in-app notifications with read/unread state, polling refresh, and mark-as-read/delete.
- **User profiles** — profile editing (bio, location, website, social links, avatar), password change, and account deactivation.
- **Admin panel** — campaign moderation, user management (roles, bans), and analytics.
- **Object storage** — direct browser-to-bucket uploads using S3 pre-signed URLs (MinIO-compatible).
- **Responsive UI** — shadcn/ui + Radix components, light/dark themes, and mobile-aware layouts.

---

## 🧱 Architecture

All external traffic enters through the **API Gateway**, which authenticates JWTs and forwards requests to the appropriate microservice, injecting trusted user identity headers downstream.

```
                      ┌─────────────────────────────────────────────────────────┐
                      │                     Frontend (Next.js 15)               │
                      │          http://localhost:3000                           │
                      └──────────────────────────┬──────────────────────────────┘
                                                 │ HTTP (REST)
                                                 ▼
                          ┌──────────────────────────────────────┐
                          │          API Gateway (8080)          │
                          │   Spring Boot · JWT validation       │
                          │   Injects X-User-Id / X-User-Name    │
                          └──────┬──────────────┬─────────┬──────┘
                                 │              │         │
              ┌──────────────────┘      ┌───────┘         └───────────────┐
              ▼                          ▼                               ▼
    ┌──────────────────┐      ┌────────────────────┐           ┌────────────────────┐
    │   User Service   │      │  Campaign Service  │           │ Notification Svc   │
    │  Express · 5001  │      │   FastAPI · 8001   │           │  FastAPI · 8002    │
    │     MongoDB      │      │      SQLite        │           │     SQLite         │
    └──────────────────┘      └────────────────────┘           └────────────────────┘
                                                                       ▲
    ┌──────────────────┐                                              │
    │  Payment Service │  Stripe ──► https://api.stripe.com            │
    │  Express · 1234  │  MySQL                                        │
    └──────────────────┘                                              │
                                 ┌──────────────────────────┐          │
                                 │   Service Registry        │◄─────────┘
                                 │  Eureka · 8761            │
                                 └──────────────────────────┘
```

### Service Discovery
Every backend service registers itself with the **Eureka** service registry (`8761`) on startup and deregisters on shutdown. The API Gateway uses discovery (`lb://` routes) to reach downstream instances, enabling dynamic scaling.

### Authentication Flow
1. Client calls `POST /api/users/auth/login` (public route) and receives JWT access/refresh tokens.
2. All subsequent requests include `Authorization: Bearer <access_token>`.
3. The gateway validates the JWT and attaches `X-User-Id` and `X-User-Name` headers before forwarding.
4. Downstream services (e.g., Campaign Service) trust these headers for ownership/authorization checks.

### Storage
- **MongoDB** — user accounts and profiles (User Service).
- **SQLite** — campaign records + incentive tiers (Campaign Service); notifications (Notification Service).
- **MySQL** — payment ledger (Payment Service).
- **MinIO** — campaign images (S3-compatible; bucket `campaign-images` made public).

---

## 📚 Services Reference

| Service | Tech | Port | Database | Responsibilities | Key Endpoints |
|---|---|---|---|---|---|
| **api-gateway** | Spring Boot 3 | `8080` | — | Reverse proxy, JWT auth, header injection, CORS | Routes `/api/users/**`, `/campaigns/**`, `/notifications/**`, `/payments/**`, `/create-payment-intent` |
| **service-registry** | Spring Boot + Eureka | `8761` | — | Service registration & discovery | Dashboard `/`, health `/actuator/health` |
| **user_service** | Node.js / Express | `5001` | MongoDB | Registration, login, JWT issuance, profiles, admin ops (roles, ban) | `POST /api/users/auth/signup`, `POST /api/users/auth/login`, `GET /api/users/get-profile`, `PUT /api/users/update-profile`, `PUT /api/users/change-password`, `GET /api/users/get-all`, `PUT /api/users/ban-user`, `PUT /api/users/set-role` |
| **campaign-service** | Python / FastAPI | `8001` | SQLite | Campaign CRUD, incentive tiers, approval status, ownership enforcement | `POST /campaigns/`, `GET /campaigns/`, `GET /campaigns/approved`, `GET /campaigns/{id}`, `PUT /campaigns/{id}`, `DELETE /campaigns/{id}` |
| **notification-service** | Python / FastAPI | `8002` | SQLite | Per-user in-app notifications (CRUD) | `POST /notifications/`, `GET /notifications/{user_id}`, `PUT /notifications/{id}`, `DELETE /notifications/{id}` |
| **payment-service** | Node.js / Express | `1234` | MySQL | Stripe PaymentIntents, payment ledger | `POST /create-payment-intent`, `POST /payments`, `GET /payments`, `GET /payments/user/:userId`, `GET /payments/campaign/:campaignId` |

### Containerization

Each microservice is fully containerized — every service has its **own Dockerfile** and runs in its **own isolated container**, orchestrated by Docker Compose:

| Container | Build source | Base image |
|---|---|---|
| `service-registry` | `./service-registry/Dockerfile` | openjdk 17 |
| `api-gateway` | `./api-gateway/Dockerfile` | openjdk 17 |
| `user-service` | `./user_service/Dockerfile` | node 18 |
| `campaign-service` | `./campaign-service/Dockerfile` | python 3.11-slim |
| `notification-service` | `./notification-service/Dockerfile` | python 3.11-slim |
| `payment-service` | `./payment-service/Dockerfile` | node 18-alpine |

All containers share the `baksho-net` Docker bridge network and reach each other by service name (e.g. `http://user-service:5001`), enabling each service to be built, scaled, and deployed independently.

### Supporting Infrastructure (docker-compose)

| Container | Port | Purpose |
|---|---|---|
| MongoDB | `27017` | User database |
| MySQL | `3306` | Payment database |
| MinIO | `9000` / `9001` | Object storage (API / console) |
| mongo-express | `8081` | MongoDB admin UI |
| sqlite-web (campaign) | `8082` | Campaign DB UI |
| sqlite-web (notifications) | `8083` | Notifications DB UI |
| phpMyAdmin | `8084` | MySQL admin UI |

---

## 🗂 Repository Structure

```
Project_Baksho/
│
├── backend/
│   ├── api-gateway/           # Spring Boot 3 gateway (JWT, routing)
│   ├── service-registry/      # Spring Boot Eureka server
│   ├── user_service/          # Node.js Express user service (MongoDB)
│   ├── campaign-service/      # FastAPI campaign service (SQLite)
│   ├── notification-service/  # FastAPI notification service (SQLite)
│   ├── payment-service/       # Node.js Express payment service (Stripe + MySQL)
│   └── docker-compose.yml     # Full backend orchestration
│
├── frontend/                  # Next.js 15 application (App Router)
│   ├── app/                   # Routes: home, campaigns, categories, user, admin, profile, about
│   ├── components/            # UI components (shadcn/ui, home, payment, notifications, profile)
│   ├── contexts/              # Auth, Campaign, Notification React contexts
│   ├── hooks/                 # axiosPublic / axiosPrivate instances
│   └── lib/                   # Utilities
│
├── Design/
│   ├── wireframes/            # Figma wireframes
│   └── exports/               # Design exports (home, campaigns, about, landing)
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ and a package manager (`pnpm` / `npm`)
- JDK 17+ (only if running backend services outside Docker)
- Python 3.11+ (only if running FastAPI services outside Docker)

### 1. Start the backend

```bash
cd backend
docker-compose up --build
```

This builds and starts the service registry, API gateway, all four business services, and the supporting databases/admin UIs. The full stack is ready when the gateway health check passes:

```bash
curl http://localhost:8080/actuator/health
```

Service Registry dashboard: <http://localhost:8761>

### 2. Start the frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Open <http://localhost:3000>. The app expects the backend API at `http://localhost:8080` and the payment service at `http://localhost:1234`.

### 3. Stop everything

```bash
cd backend && docker-compose down
```

---

## ⚙️ Configuration

### Frontend environment variables

The only backend-facing API route is the S3/MinIO pre-signed uploader (`app/api/s3-upload/route.ts`):

| Variable | Description |
|---|---|
| `S3_REGION` | S3/MinIO region (e.g. `us-east-1`) |
| `S3_ENDPOINT` | MinIO endpoint (e.g. `http://localhost:9000`) |
| `S3_ACCESS_KEY` | Access key (compose default: `admin`) |
| `S3_SECRET_KEY` | Secret key (compose default: `12345678`) |
| `S3_BUCKET_NAME` | Bucket (compose creates `campaign-images`) |

> The default backend also needs `JWT_SECRET` (shared between gateway and user service, set in `docker-compose.yml`) and `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY`.

> ⚠️ **Security note:** the payment-service `.env` file and the frontend contain **test** Stripe keys and DB credentials committed to the repository. Rotate these and move all secrets to environment variables/secret managers before any production use.

---

## 🧪 Development Notes & Known Limitations

The codebase is a working reference implementation and has several areas that should be hardened before production:

- **Refresh-token flow is incomplete** — access and refresh tokens share the same payload/lifetime, and the refresh endpoint verifies against `JWT_REFRESH_SECRET`, which is not configured anywhere.
- **`X-User-Name` is always `"Unknown"`** — the JWT payload only embeds `id`, so the gateway has no `name` claim to forward to downstream services.
- **Campaign approval is self-serviceable** — `PUT /campaigns/{id}` allows the campaign organizer (matching `X-User-Id`) to flip `approved`/`reviewed`; there is no dedicated admin role check server-side.
- **Notification routes are public** — the gateway forwards all `/notifications/**` traffic without JWT validation.
- **Payment status is client-supplied** — `POST /payments` records a `status` value passed by the client, and there is no Stripe webhook to reconcile payment state server-side.
- **Payment amount rounding** — `price * 100` is converted with `parseInt`, which can round floating-point amounts down by a cent.
- **Frontend URLs are hardcoded** — the app assumes `localhost:8080` and `localhost:1234`; there is no env-based base URL configuration.
- **Homepage & analytics data is mock** — hero stats, featured campaigns, and the admin analytics dashboard use static/hardcoded data rather than live APIs.
- **Notification polling interval** — the frontend polls every 5 seconds (the comment claims 30s).
- **Compose env mismatch** — the notification-service container is passed `APP_PORT=8000` while it actually serves on `8002`.

---

## 🔮 Future Improvements

- Add **Stripe webhooks** to verify payment success/failure server-side and keep the payment ledger authoritative.
- Implement a proper **refresh-token rotation** flow and include user `name` in the JWT payload.
- Add **email/push notifications** in addition to the in-app store.
- Enforce **server-side admin authorization** for campaign approve/reject actions.
- Add **campaign comments** (currently a placeholder in the UI) and campaign updates/FAQs.
- Build **real-time analytics** backed by campaign and payment data.
- Add **search indexing** and **geographic/regional** filtering.
- Introduce **transaction fees**, **featured campaign** monetization, and a **wallet/refund** flow.

---

## 👥 Contributors

- **Muhtasim Zawad**
- **Riyad Hosen**
- **MD. Abidur Rahman Asif**

---

## 📄 License

This project is a student/educational full-stack showcase and is not currently distributed under a specific open-source license.
