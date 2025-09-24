# ✈️ Ethiopian Airlines Flight Booking System

[![CI/CD Pipeline](https://github.com/YonasGr/AirlineReservationSystem/actions/workflows/ci.yml/badge.svg)](https://github.com/YonasGr/AirlineReservationSystem/actions/workflows/ci.yml)
[![Deploy to Production](https://github.com/YonasGr/AirlineReservationSystem/actions/workflows/deploy.yml/badge.svg)](https://github.com/YonasGr/AirlineReservationSystem/actions/workflows/deploy.yml)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-blue?logo=telegram)](https://t.me/x_Jonah)
[![React](https://img.shields.io/badge/Frontend-React-61DBFB?logo=react\&logoColor=white)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?logo=tailwind-css\&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌍 Overview

A **full-stack Ethiopian Airlines flight booking web application** built with modern technologies where users can:

* 🔎 Search flights
* 🪑 Select seats  
* 📖 Book tickets
* 📧 **Email tickets** (newly implemented!)
* 📂 Manage reservations

Admins can monitor bookings and flight occupancy through a **dashboard interface**.

---

## ✨ New Features

### 📧 Email Ticket Functionality
- **Professional email templates** with Ethiopian Airlines branding
- **Flexible recipient options** - send to passenger email or custom address
- **HTML & text formats** for maximum compatibility
- **Complete booking details** including flight info, seat selection, and pricing
- **Development mode logging** for easy testing and debugging

---

## 🏗️ System Architecture

### ⚡ Frontend

* **React + TypeScript** with **Vite** for fast builds
* **shadcn/ui + Radix UI** → accessible & modern components
* **TanStack Query** → server state & caching
* **TailwindCSS** → responsive design with Ethiopian Airlines brand colors (green, gold, red)

### 🔐 Backend

* **Express.js** REST API
* Modular storage system (in-memory for dev, PostgreSQL for prod)
* Routes for flights, bookings, passengers, and seats
* Logging & error-handling middleware

### 🗄️ Database

* **PostgreSQL + Drizzle ORM**
* Entities: `flights`, `passengers`, `bookings`, `seats`
* **Drizzle Kit** → database migrations
* Fallback in-memory DB for development

### ⚙️ State Management

* **TanStack Query** → API state
* **React state** → UI state
* **React Hook Form + Zod** → forms & validation
* Context providers → toasts & modals

### 🎨 Components

* Reusable UI components (`/components/ui`)
* Feature-based organization: flight cards, seat maps, booking forms
* Utility classes & custom CSS variables for spacing, colors, typography

---

## 📦 Dependencies

### 🎨 UI & Styling

* **shadcn/ui + Radix UI** → polished accessible UI
* **TailwindCSS** → utility-first CSS
* **Lucide React** → icons
* **Framer Motion** → animations

### 🗄️ Data Management

* **Drizzle ORM** → type-safe DB queries
* **Neon** → serverless PostgreSQL (prod)
* **TanStack Query** → caching & API sync
* **Zod** → validation

### ⚒️ Dev Tools

* **Vite** → dev server
* **TypeScript** → static typing
* **ESBuild** → optimized production builds
* **React Hook Form** → performant forms

### 🌐 Routing

* **wouter** → lightweight SPA routing

---

## 🔄 CI/CD Pipeline

### ✅ Continuous Integration
- **Multi-Node.js versions** testing (18.x, 20.x)
- **TypeScript compilation** checks
- **Build verification** for both frontend and backend
- **Security auditing** with npm audit
- **Code quality** checks (ESLint, Prettier when configured)

### 🚀 Continuous Deployment  
- **Automated builds** on main branch pushes
- **Docker containerization** with health checks
- **Production-ready** deployment pipeline
- **Manual deployment** trigger support

### 🧪 Testing Strategy
- **TypeScript validation** ensures type safety
- **Build process verification** catches integration issues  
- **Health checks** validate running application
- **Modular test structure** ready for unit/integration tests

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/YonasGr/AirlineReservationSystem.git

# Install dependencies
cd AirlineReservationSystem
npm install

# Start development servers
docker build -t airline-system .
docker run -it --rm -p 3000:5000 airline-system

# Then go to any default browser and serch for
http://localhost:3000/
```

---

## 📜 License

This project is licensed under **MIT License**.
