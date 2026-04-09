# Project Baksho

> A full-stack crowdfunding platform built with a modern microservices architecture.

---

## 📖 Overview

**Project Baksho** is a feature-rich crowdfunding platform that allows users to create campaigns, back projects they believe in, and receive real-time notifications — all with secure, Stripe-powered payments. The platform is built with a decoupled frontend and a suite of independent backend microservices.

---

## ✨ Features

### For Campaign Creators
- **Create Campaigns** – Launch crowdfunding campaigns with a title, description, category, funding goal, duration, images, story, risks, and timeline.
- **Incentive Tiers** – Define backer reward tiers (e.g., "Early Bird", "Gold Supporter") with custom amounts and descriptions.
- **Manage Campaigns** – Edit or delete your own campaigns at any time.
- **Campaign Dashboard** – Track raised funds, number of backers, and campaign status.

### For Backers
- **Browse Campaigns** – Explore campaigns by category or browse featured/urgent projects.
- **Secure Payments** – Back campaigns using Stripe-powered card payments.
- **Payment History** – View a history of all contributions made.

### For Users
- **Authentication** – Register and log in with JWT-based access and refresh tokens.
- **User Profiles** – Manage your name, bio, location, website, avatar, and social media links.
- **Password Management** – Change your password securely.
- **Notifications** – Receive and manage in-app notifications.

### For Admins
- **Admin Dashboard** – View and manage all campaigns across the platform.
- **Analytics** – Monitor platform-wide campaign and financial analytics.

### Platform
- **Image Uploads** – Campaign images stored in MinIO (S3-compatible object storage).
- **Dark/Light Mode** – Full theme support across the UI.
- **Responsive Design** – Mobile-friendly interface built with Tailwind CSS.

---

## 🏗️ Architecture

Project Baksho follows a **microservices architecture**. All client requests are routed through a central **API Gateway**, which handles authentication and load balancing. Services register themselves with a **Eureka Service Registry** for dynamic discovery.

```
┌─────────────────────────────────────────────────────┐
│                     Frontend (Next.js)               │
│              http://localhost:3000                   │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│               API Gateway (Spring Boot)              │
│         http://localhost:8080                        │
│  • JWT authentication & authorization               │
│  • Reverse proxy to all microservices               │
└──────┬─────────┬──────────┬──────────┬──────────────┘
       │         │          │          │
 ┌─────▼──┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────────┐
 │  User  │ │Campaign│ │Payment │ │Notification│
 │Service │ │Service │ │Service │ │  Service   │
 │:5001   │ │:8001   │ │:1234   │ │  :8002     │
 │MongoDB │ │SQLite  │ │MySQL   │ │  SQLite    │
 └────────┘ └────────┘ └────────┘ └────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| shadcn/ui + Radix UI | Accessible UI component library |
| Stripe.js + React Stripe | Payment UI |
| React Hook Form + Zod | Form handling & validation |
| Axios | HTTP client |
| Recharts | Analytics charts |
| AWS SDK (S3) | Image upload to MinIO |

### Backend
| Service | Technology | Database | Port |
|---|---|---|---|
| API Gateway | Spring Boot (Java) | — | 8080 |
| Service Registry | Spring Boot + Netflix Eureka | — | 8761 |
| User Service | Node.js + Express | MongoDB | 5001 |
| Campaign Service | Python + FastAPI | SQLite | 8001 |
| Notification Service | Python + FastAPI | SQLite | 8002 |
| Payment Service | Node.js + Express + Stripe | MySQL | 1234 |

### Infrastructure & DevOps
| Tool | Purpose |
|---|---|
| Docker & Docker Compose | Containerization & orchestration |
| MinIO | S3-compatible object storage for campaign images |
| Mongo Express | MongoDB admin UI |
| SQLite Web | SQLite browser for campaign & notification DBs |
| phpMyAdmin | MySQL admin UI for payment DB |

---

## 📂 Project Structure

```
Project_Baksho/
├── frontend/                  # Next.js application
│   ├── app/                   # App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── campaigns/         # Campaign listing & detail pages
│   │   ├── admin/             # Admin dashboard & analytics
│   │   ├── profile/           # User profile page
│   │   ├── edit-profile/      # Profile editing page
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   └── about/             # About page
│   ├── components/            # Reusable React components
│   │   ├── home/              # Hero, Categories, FeaturedCampaigns, Stats
│   │   ├── layout/            # Header, Footer, Navigation
│   │   ├── notifications/     # Notification components
│   │   ├── payment/           # Stripe payment form components
│   │   └── profile/           # Profile view/edit components
│   ├── contexts/              # React context providers
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utility functions
│
├── backend/                   # All backend microservices
│   ├── api-gateway/           # Spring Boot API Gateway
│   ├── service-registry/      # Spring Boot Eureka Registry
│   ├── user_service/          # Node.js User Service
│   ├── campaign-service/      # Python FastAPI Campaign Service
│   ├── notification-service/  # Python FastAPI Notification Service
│   ├── payment-service/       # Node.js Payment Service
│   └── docker-compose.yml     # Docker orchestration
│
└── Design/                    # UI/UX design files
    └── wireframes/            # Figma wireframes
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) 18+ and npm/pnpm
- [JDK 17+](https://adoptium.net/) and Maven (for local development without Docker)
- [Python 3.11+](https://www.python.org/) (for local development without Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/Muhtasim-Zawad/Project_Baksho.git
cd Project_Baksho
```

### 2. Start the Backend

All backend services are fully containerized. From the `backend/` directory:

```bash
cd backend
docker-compose up --build
```

This starts all microservices, databases, and admin tools automatically.

### 3. Start the Frontend

```bash
cd frontend
npm install       # or: pnpm install
npm run dev       # or: pnpm dev
```

The frontend will be available at **http://localhost:3000**.

---

## 🌐 Service URLs

| Service | URL | Description |
|---|---|---|
| Frontend | http://localhost:3000 | Main web application |
| API Gateway | http://localhost:8080 | Single entry point for all API calls |
| Service Registry | http://localhost:8761 | Eureka dashboard |
| User Service | http://localhost:5001 | Direct access (dev only) |
| Campaign Service | http://localhost:8001/docs | FastAPI Swagger UI |
| Notification Service | http://localhost:8002 | Notification API |
| Payment Service | http://localhost:1234 | Payment API |
| MinIO Console | http://localhost:9001 | Object storage UI (admin/12345678) |
| Mongo Express | http://localhost:8081 | MongoDB browser (admin/12345678) |
| Campaign DB Browser | http://localhost:8082 | SQLite browser for campaigns |
| Notification DB Browser | http://localhost:8083 | SQLite browser for notifications |
| phpMyAdmin | http://localhost:8084 | MySQL browser for payments |

---

## 🔑 Authentication

Authentication is managed by the **API Gateway** using **JSON Web Tokens (JWT)**.

- **Public endpoints**: `/api/users/auth/signup`, `/api/users/auth/login`
- **Protected endpoints**: All other endpoints require a valid `Bearer` token.

**Request header format:**
```http
Authorization: Bearer <your_jwt_access_token>
```

When a request passes through the gateway, the user's identity is forwarded to downstream services via:
- `X-User-Id` — The authenticated user's unique ID
- `X-User-Name` — The authenticated user's display name

---

## 📡 API Reference

### User Service (`/api/users`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users/auth/signup` | Public | Register a new user |
| POST | `/api/users/auth/login` | Public | Log in and receive tokens |
| GET | `/api/users/get-profile` | Required | Get current user's profile |
| PUT | `/api/users/update-profile` | Required | Update profile details |
| PUT | `/api/users/change-password` | Required | Change password |
| DELETE | `/api/users/deactivate-profile` | Required | Delete account |

### Campaign Service (`/campaigns`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/campaigns/` | Required | Create a new campaign |
| GET | `/campaigns/` | Required | List all campaigns (supports `?skip=&limit=`) |
| GET | `/campaigns/{id}` | Required | Get a specific campaign |
| PUT | `/campaigns/{id}` | Required + Owner | Update a campaign |
| DELETE | `/campaigns/{id}` | Required + Owner | Delete a campaign |

### Payment Service

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/create-payment-intent` | — | Create a Stripe payment intent |
| POST | `/payments` | — | Record a completed payment |
| GET | `/payments` | — | List all payments |
| GET | `/payments/user/{userId}` | — | Get payments by user |
| GET | `/payments/campaign/{campaignId}` | — | Get payments by campaign |

### Notification Service (`/notifications`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/notifications/` | — | Create a notification |
| GET | `/notifications/{user_id}` | — | Get notifications for a user |
| PUT | `/notifications/{notification_id}` | — | Update a notification (e.g., mark as read) |
| DELETE | `/notifications/{notification_id}` | — | Delete a notification |

---

## 🐳 Docker Commands

```bash
# Start all services (build images first)
docker-compose up --build

# Start in detached/background mode
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (clears all data)
docker-compose down -v

# View logs for a specific service
docker-compose logs -f campaign-service
```

---

## 🔍 Service Health Checks

```bash
# API Gateway
curl http://localhost:8080/actuator/health

# User Service
curl http://localhost:5001/health

# Campaign Service (Swagger UI)
open http://localhost:8001/docs

# Service Registry Dashboard
open http://localhost:8761
```

---

## 🛠 Development Notes

- **API Gateway** is the only entry point for the frontend — never call microservices directly in production.
- **Service Registry** must be healthy before the API Gateway and other services start (enforced by `depends_on` health checks in Docker Compose).
- **Campaign images** are stored in MinIO. The `campaign-images` bucket is created automatically on startup with public read access.
- **User Service** connects to MongoDB; **Campaign & Notification Services** use SQLite; **Payment Service** uses MySQL.
- The Stripe integration uses a test key by default. Replace `STRIPE_SECRET_KEY` in `docker-compose.yml` and the corresponding frontend env variable for production.

---

## 📌 Roadmap

- [ ] Email notifications via SMTP
- [ ] Push notifications
- [ ] SSLCommerz payment gateway (Bangladesh)
- [ ] Campaign search and filtering
- [ ] Social sharing for campaigns
- [ ] Campaign comment and update threads
- [ ] Admin user management (ban/unban)
