# 🔗 Campaign Backend

This is the **backend API** for the Crowdfunding Campaign App, built with **Node.js, Express, and MongoDB**.  
It provides authentication, campaign management, and role-based access for **users, moderators, and admins**.

---

## 🚀 Features

- 🔐 JWT Authentication (Login, Register, Refresh)
- 👤 Role-based access (user, moderator, admin)
- 📢 Campaign CRUD (create, update, delete, view)
- 📆 Campaign deadlines & milestones
- 📂 Media uploads (Multer, AWS S3)
- 🗑️ Bulk user deletion (Admin only)
- 🛡️ Middleware for validation, error handling, and logging

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js**
- **MongoDB + Mongoose**
- **Multer** (File uploads)
- **S3** (File store)
- **JWT** (Authentication & Authorization)
- **bcryptjs** (Password hashing)
- **dotenv** (Environment variables)
- **NodeMailer** (Send reset password mail)
- **morgan** + **Winston** (Request logging)

---

## 📂 Project Structure
│── config/ # DB connection
│── controllers/ # Business logic (auth, campaigns, users)
│── middlewares/ # Auth, limiter, role, validator, multer upload
│── models/ # Mongoose schemas (User, Campaign)
│── routes/ # Express routers (auth, campaigns, users)
│── services/ # File Store (AWS S3)
│── utils/ # Helper functions (logger, send mail, etc.)
│── server.js # Entry point

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repo
```bash
git clone https://github.com/surajroy7430/FundSphere--A-Crowd-Funding-Platform.git
cd FundSphere--A-Crowd-Funding-Platform
cd fundsphere-server
```

### 2️⃣ Install dependencies
```bash
bun install
```

### 3️⃣ Setup environment variables

- Create a .env file in the root directory:
```bash
PORT=
NODE_ENV=
CLIENT_URL=
MONGO_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
SALT_ROUNDES=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=
AWS_BUCKET=
```

### 4️⃣ Run the server
```bash
bun start
```
- Server runs at 👉 http://localhost:4000

---

## 📦 API Integration

### 🔑 Auth Routes

- POST /api/auth/register → Register new user
- POST /api/auth/login → Login and store token in cookie
- POST /api/auth/logout → Logout and clear coockie token
- POST /api/auth/forgot-password → Forgot Password
- POST /api/auth/reset-password → Reset Password

### 👤 User Routes

- GET /api/profile → Get logged-in user profile
- PUT /api/profile → Update Profile
- PATCH /api/profile/deactivate → Deactivate Account

### 📢 Campaign Routes

- POST /api/campaigns → Create campaign (default: draft)
- GET /api/campaigns/published → Get published campaigns (deadline not expired)
- GET /api/campaigns/published/:id → Get campaign details by ID
- GET /api/campaigns/user/published → Get logged-in user’s campaigns
- GET /api/campaigns/user/published/:id → Get user campaign details by ID
- DELETE /api/campaigns/drafts → Delete all draft campaigns (Admin Only)

---

## 🛡️ Middleware

- Auth Middleware → Verifies JWT & attaches req.user
- Role Middleware → Restricts access (admin/mod/user)
- Error Handler → Centralized error responses
- Multer Middleware → Handles media uploads
- Multer Middleware → Handles media uploads
- ApplyMiddleware → Apply all types of middleware (cors, helmet, morgan, cookieParser, error-handler)

---

## 📌 Next Improvements

- Payment gateway integration
- Campaign donations & transaction tracking
- Live notifications for deadlines & milestones


