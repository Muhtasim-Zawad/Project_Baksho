# Project Baksho Backend

Project Baksho is a full-stack crowdfunding platform built with a microservices architecture. This document provides instructions for setting up and running the **backend** of the application.

---

## 📖 Overview

The backend consists of several independent microservices, each responsible for a specific part of the system. These microservices are orchestrated via an **API Gateway** and a **Service Registry**. Communication happens over HTTP, with authentication and authorization handled at the gateway level.

---

## ⚙️ Tech Stack

* **Java (Spring Boot)** → API Gateway & Service Registry
* **Python (FastAPI)** → Campaign Service
* **Node.js (Express)** → User Service
* **MongoDB** → Database for User Service
* **SQLite** → Database for Campaign Service
* **Netflix Eureka** → Service Discovery & Registration
* **Docker & Docker Compose** → Containerization & Orchestration

---

## 📂 Project Structure

```
backend/
│
├── api-gateway/          # Spring Boot API Gateway
├── service-registry/     # Spring Boot Eureka Service Registry
├── user_service/         # Node.js Express User Service (MongoDB)
└── campaign-service/     # FastAPI Campaign Service (SQLite)
```

---

## 🚀 Getting Started

### Prerequisites

* Docker & Docker Compose
* JDK 17+
* Maven
* Node.js + npm/pnpm
* Python 3.11+

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd muhtasim-zawad-project_baksho
```

2. Navigate to the backend directory:

```bash
cd backend
```

3. Start all backend services using Docker Compose:

```bash
docker-compose up --build
```

This will build and run containers for all microservices.

---

## 🌐 Services & Endpoints

### API Gateway

* **Tech**: Spring Boot
* **Port**: `8080`
* **Responsibilities**:

  * Reverse proxy for all requests
  * JWT authentication & authorization
  * Injects user headers (`X-User-Id`, `X-User-Name`)

**Base URL**: `http://localhost:8080`

---

### Service Registry

* **Tech**: Spring Boot (Eureka)
* **Port**: `8761`
* **Responsibilities**:

  * Registers microservices
  * Enables dynamic discovery

**Dashboard**: `http://localhost:8761`

---

### User Service

* **Tech**: Node.js (Express), MongoDB
* **Port**: `5001`
* **Responsibilities**:

  * User registration & login
  * JWT token generation
  * Profile management

**Base URL (via Gateway)**: `/api/users`

---

### Campaign Service

* **Tech**: Python (FastAPI), SQLite
* **Port**: `8001`
* **Responsibilities**:

  * CRUD for crowdfunding campaigns
  * Incentive tier management

**Base URL (via Gateway)**: `/campaigns`

---

## 🔑 Authentication

* Authentication is handled by the **API Gateway** using **JWT**.
* Protected endpoints require:

```http
Authorization: Bearer <your_jwt_access_token>
```

* The gateway injects:

  * `X-User-Id`
  * `X-User-Name`

into downstream service requests.

---

## API Documentation for Project Baksho

### General Information

**Base URL**: All requests from the client should be made to the API Gateway at `http://localhost:8080`.

**Authentication**:
- Most endpoints are protected and require a JSON Web Token (JWT) to be passed in the `Authorization` header.
- The format is `Authorization: Bearer <your_jwt_access_token>`.
- Public endpoints, such as login and registration, do not require this header.

**Headers on Protected Routes**:
When a request is made to a protected route, the API Gateway validates the JWT and adds the following headers to the request before forwarding it to the downstream microservice:
-   `X-User-Id`: The unique ID of the authenticated user.
-   `X-User-Name`: The name of the authenticated user.
These headers are used by the microservices for authorization and ownership checks.

---

### 🖥️ User Service

The User Service handles user authentication, profiles, and management. All routes are prefixed with `/api/users`.

#### **Authentication Routes**

These routes are public and are used for user sign-up and sign-in.

**1. Register a New User**
*   **Endpoint**: `POST /api/users/auth/signup`
*   **Description**: Creates a new user account.
*   **Authentication**: `Public`
*   **Request Body**:
    ```json
    {
      "name": "Test User",
      "email": "test@example.com",
      "password": "yourstrongpassword"
    }
    ```
*   **Success Response** (`201 Created`):
    ```json
    {
      "accessToken": "ey...",
      "refreshToken": "ey...",
      "user": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "Test User",
        "email": "test@example.com",
        "role": "user"
      },
      "message": "Registered successfully"
    }
    ```
*   **Error Response** (`400 Bad Request`): If the email already exists.
    ```json
    { "message": "User already exists!" }
    ```

**2. Log In a User**
*   **Endpoint**: `POST /api/users/auth/login`
*   **Description**: Authenticates a user and returns access/refresh tokens.
*   **Authentication**: `Public`
*   **Request Body**:
    ```json
    {
      "email": "test@example.com",
      "password": "yourstrongpassword"
    }
    ```
*   **Success Response** (`200 OK`):
    ```json
    {
      "accessToken": "ey...",
      "refreshToken": "ey...",
      "user": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "Test User",
        "email": "test@example.com",
        "role": "user"
      },
      "message": "Login Success!!"
    }
    ```
*   **Error Response** (`401 Unauthorized`): If credentials are invalid.
    ```json
    { "message": "Invalid email or password" }
    ```

---

#### **User Profile Routes**

These routes require authentication to manage user profiles.

**1. Get Current User's Profile**
*   **Endpoint**: `GET /api/users/get-profile`
*   **Description**: Retrieves the profile of the currently logged-in user.
*   **Authentication**: `Required (Bearer Token)`
*   **Success Response** (`200 OK`):
    ```json
    {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "Test User",
      "email": "test@example.com",
      "role": "user",
      "avatar": "",
      "bio": "",
      "location": "",
      "website": "",
      "socialMedia": { "twitter": "", "facebook": "", "instagram": "", "linkedin": "" },
      "preferences": [],
      "lastLogin": "2025-08-24T17:23:00.000Z",
      "isBanned": false
    }
    ```

**2. Update User Profile**
*   **Endpoint**: `PUT /api/users/update-profile`
*   **Description**: Updates the profile of the currently logged-in user.
*   **Authentication**: `Required (Bearer Token)`
*   **Request Body** (include only fields to be updated):
    ```json
    {
      "name": "Updated Name",
      "bio": "This is my new bio.",
      "location": "Dhaka, Bangladesh",
      "website": "https://example.com",
      "socialMedia": { "linkedin": "https://linkedin.com/in/testuser" }
    }
    ```
*   **Success Response** (`200 OK`):
    ```json
    {
      "message": "Profile updated successfully",
      "result": { ... }
    }
    ```

**3. Change User Password**
*   **Endpoint**: `PUT /api/users/change-password`
*   **Description**: Allows a logged-in user to change their password.
*   **Authentication**: `Required (Bearer Token)`
*   **Request Body**:
    ```json
    {
      "oldPassword": "currentstrongpassword",
      "newPassword": "newverystrongpassword"
    }
    ```
*   **Success Response** (`200 OK`):
    ```json
    { "message": "Password updated successfully!" }
    ```*   **Error Response** (`401 Unauthorized`): If the old password is incorrect.

**4. Deactivate User Profile**
*   **Endpoint**: `DELETE /api/users/deactivate-profile`
*   **Description**: Permanently deletes the logged-in user's account.
*   **Authentication**: `Required (Bearer Token)`
*   **Success Response** (`200 OK`):
    ```json
    { "message": "Account Deleted Successfully!!" }
    ```

---

### 🚀 Campaign Service

The Campaign Service handles all logic related to crowdfunding campaigns. All routes are prefixed with `/campaigns`.

#### **Campaign Management Routes**

All routes in this service require authentication. The API Gateway will pass the user's ID and name in headers.

**1. Create a New Campaign**
*   **Endpoint**: `POST /campaigns/`
*   **Description**: Creates a new crowdfunding campaign. The organizer info is automatically set from the authenticated user.
*   **Authentication**: `Required (Bearer Token)`
*   **Request Body**:
    ```json
    {
      "title": "My Awesome New Project",
      "description": "A short description of the project.",
      "category": "Technology",
      "goal": 50000,
      "duration": 30,
      "location": "New York, USA",
      "story": "A longer, more detailed story about the project...",
      "risks": "Potential challenges and how we will overcome them.",
      "timeline": "Our project timeline.",
      "image_urls": "url1.jpg,url2.jpg",
      "incentive_tiers": [
        {
          "amount": 25,
          "title": "Early Backer",
          "description": "Get a special thank you note."
        }
      ]
    }
    ```
*   **Success Response** (`200 OK`): Returns the newly created campaign object.
    ```json
    {
      "id": 1,
      "title": "My Awesome New Project",
      "organizer_id": "60d0fe4f5311236168a109ca",
      "organizer_name": "Test User",
      "raised": 0,
      "backers": 0,
      "featured": false,
      "urgent": false,
      "incentive_tiers": [ { "id": 1, "amount": 25, ... } ],
      ...
    }
    ```

**2. Retrieve All Campaigns**
*   **Endpoint**: `GET /campaigns/`
*   **Description**: Fetches a list of all campaigns, with optional pagination.
*   **Authentication**: `Required (Bearer Token)`
*   **Query Parameters**:
    *   `skip` (integer, optional): Number of campaigns to skip. Default is `0`.
    *   `limit` (integer, optional): Number of campaigns to return. Default is `100`.
*   **Success Response** (`200 OK`): An array of campaign objects.
    ```json
    [
      { "id": 1, "title": "Campaign One", ... },
      { "id": 2, "title": "Campaign Two", ... }
    ]
    ```

**3. Retrieve a Single Campaign**
*   **Endpoint**: `GET /campaigns/{campaign_id}`
*   **Description**: Fetches details for a specific campaign by its ID.
*   **Authentication**: `Required (Bearer Token)`
*   **Success Response** (`200 OK`): The requested campaign object.
*   **Error Response** (`404 Not Found`): If no campaign with the given ID exists.

**4. Update an Existing Campaign**
*   **Endpoint**: `PUT /campaigns/{campaign_id}`
*   **Description**: Updates an existing campaign. Only the campaign organizer can perform this action.
*   **Authentication**: `Required (Bearer Token)` and `Ownership`
*   **Request Body** (include only fields to be updated):
    ```json
    {
      "title": "Updated Campaign Title",
      "description": "An updated description."
    }
    ```
*   **Success Response** (`200 OK`): The updated campaign object.
*   **Error Response**:
    *   `403 Forbidden`: If the user is not the organizer of the campaign.
    *   `404 Not Found`: If the campaign does not exist.

**5. Delete a Campaign**
*   **Endpoint**: `DELETE /campaigns/{campaign_id}`
*   **Description**: Deletes an existing campaign. Only the campaign organizer can perform this action.
*   **Authentication**: `Required (Bearer Token)` and `Ownership`
*   **Success Response**: `204 No Content`
*   **Error Response**:
    *   `403 Forbidden`: If the user is not the organizer of the campaign.
    *   `404 Not Found`: If the campaign does not exist.
---

## 🐳 Docker Setup

### Build & Run Services

```bash
docker-compose up --build
```

### Stop Services

```bash
docker-compose down
```

---

## 🔍 Service Health

* API Gateway → `http://localhost:8080/actuator/health`
* Service Registry → `http://localhost:8761`
* User Service → `http://localhost:5001/health`
* Campaign Service → `http://localhost:8001/docs` (FastAPI Swagger UI)

---

## 🛠 Development Notes

* **User Service**: Connected to MongoDB instance (defined in `docker-compose.yml`).
* **Campaign Service**: Uses SQLite for persistence; stored inside the container.
* **API Gateway**: All external requests must pass through here.
* **Service Registry**: Ensure it's running before API Gateway & microservices.

---

## 📌 Future Improvements

* Add Payment Service (Stripe/SSLCommerz)
* Implement Notification Service (Emails/Push)
