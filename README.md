# ✈️ Ethiopian Airlines Flight Booking System

[![Telegram](https://img.shields.io/badge/Telegram-Bot-blue?logo=telegram)](https://t.me/x_Jonah)
[![React](https://img.shields.io/badge/Frontend-React-61DBFB?logo=react\&logoColor=white)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?logo=tailwind-css\&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌍 Overview

A **full-stack Ethiopian Airlines flight booking app** where users can:

* 🔎 Search flights
* 🪑 Select seats
* 📖 Book tickets
* 📂 Manage reservations

Admins can monitor bookings and flight occupancy through a **dashboard interface**.

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

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/airline-booking.git

# Install dependencies
cd airline-booking
npm install

# Start development servers
npm run dev     # frontend
npm run server  # backend
```

---

## 📜 License

This project is licensed under **MIT License**.
