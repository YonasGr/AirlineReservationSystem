---

## ✈️ Ethiopian Airlines Flight Booking System

[![React](https://img.shields.io/badge/Frontend-React-61DBFB?logo=react\&logoColor=white)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/Code-TypeScript-3178C6?logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?logo=tailwind-css\&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌍 Overview

A **full-stack flight booking application** inspired by Ethiopian Airlines. Users can:

* 🔎 Search flights
* 🪑 Pick seats
* 📖 Book tickets
* 📂 Manage reservations

Admins can monitor bookings and flight occupancy with a **dedicated dashboard**.

---

## 🏗️ System Architecture

### ⚡ Frontend

* Built with **React + TypeScript**
* **Vite** for lightning-fast builds
* **shadcn/ui + Radix UI** for accessible and modern UI
* **TanStack Query** for API data & caching
* **TailwindCSS** with Ethiopian Airlines brand colors (green, gold, red)

### 🔐 Backend

* **Express.js** REST API
* Modular storage with **MemStorage** (dev) & PostgreSQL (prod)
* Routes for flights, bookings, passengers, seats
* Logging & error-handling middleware

### 🗄️ Database

* **PostgreSQL + Drizzle ORM**
* Entities: `flights`, `passengers`, `bookings`, `seats`
* **Drizzle Kit** for migrations
* Fallback in-memory DB for development

### ⚙️ State Management

* **TanStack Query** → server state
* **React state** → UI state
* **React Hook Form + Zod** → forms & validation
* Context providers for modals & toasts

### 🎨 Component Design

* Reusable UI components (`/components/ui`)
* Feature-based organization (flight cards, seat maps, booking forms)
* Utility classes & custom CSS variables for spacing, colors, and typography

---

## 📦 Dependencies

### 🎨 UI & Styling

* **shadcn/ui + Radix UI** → accessible, polished UI components
* **TailwindCSS** → responsive, utility-first styling
* **Lucide React** → modern icons
* **Framer Motion** → smooth animations

### 🗄️ Data Management

* **Drizzle ORM** → type-safe DB queries
* **Neon** → serverless PostgreSQL for production
* **TanStack Query** → caching & API sync
* **Zod** → runtime validation

### ⚒️ Dev Tools

* **Vite** → blazing-fast dev server
* **TypeScript** → static typing
* **ESBuild** → optimized builds
* **React Hook Form** → performant forms

### 🌐 Routing

* **wouter** → lightweight SPA navigation

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/airline-booking.git

# Install dependencies
cd airline-booking
npm install

# Start development servers
npm run dev   # frontend
npm run server   # backend
```

---

## 📜 License

This project is licensed under the **MIT License**.
