# 🎯 Campaign Frontend

This is the frontend of the **Crowdfunding Campaign App**, built with **React, Vite, TailwindCSS, and ShadCN UI**. 
It allows users to create, browse, and manage fundraising campaigns.

---

## 🚀 Features
- 🔐 Authentication (Login, Register, Forgot/Reset Password)
- 👤 Role-based access (User, Moderator, Admin)
- 🖼️ Campaign creation with details, media upload, and get preview
- 📊 Dashboard for users and admins
- ⚡ API integration with Express + MongoDB backend

---

## 🛠️ Tech Stack
- **React** + **Vite**
- **React Router DOM v6** (Routing)
- **TailwindCSS** + **ShadCN UI** (Styling & Components)
- **Lucide Icons** + **Remix Icons**
- **Axios** (API calls with `useFetch` hook)

---


## ⚙️ Setup & Installation

### 1️⃣ Clone the repo
```bash
git clone https://github.com/surajroy7430/FundSphere--A-Crowd-Funding-Platform.git
cd FundSphere--A-Crowd-Funding-Platform
cd fundsphere
```

### 2️⃣ Install dependencies
```bash
bun install
```

### 3️⃣ Setup environment variables

- Create a .env.local file in the root directory:
```bash
VITE_SERVER_URL=
```

### 4️⃣ Run the development server
```bash
bun run dev
```
- Your app will run at 👉 http://localhost:5173

---

## 📦 API Integration

### Frontend communicates with the backend via:

- GET /api/campaigns/published → Get active published campaigns
- POST /api/campaigns → Create a campaign draft
- PATCH /api/campaigns/:id/publish → Publish draft campaign
- GET /api/campaigns/:id/published → Get campaign details
- GET /api/campaigns/user/published → Get campaigns created by logged-in user

---

## 🛡️ Role & UserType Handling

- PrivateRoute ensures only logged-in users access protected pages
- Supports roles (admin, moderator, user) and userType restrictions
- Unauthorized access → redirects to /login or /dashboard

---

## 📌 Next Improvements

- Payment gateway integration
- Campaign donations tracking
