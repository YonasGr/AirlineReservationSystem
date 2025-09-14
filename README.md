# Overview

This is a full-stack Ethiopian Airlines flight booking application built with React, Express, and PostgreSQL. The application allows users to browse flights, select seats, make bookings, and manage reservations through a modern web interface. It features a complete booking flow from flight search to confirmation, with an admin dashboard for monitoring bookings and flight occupancy.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React and TypeScript, using Vite as the build tool. The UI leverages shadcn/ui components for consistent styling and Radix UI primitives for accessible interactions. The application uses wouter for lightweight client-side routing and TanStack Query for server state management and caching. Styling is handled through Tailwind CSS with custom CSS variables for theming, including Ethiopian Airlines brand colors (green, gold, red).

## Backend Architecture
The server is built with Express.js and follows a RESTful API pattern. The application uses a modular storage interface pattern with an in-memory implementation for development (MemStorage class), allowing for easy swapping to database implementations. The server includes comprehensive route handling for flights, bookings, passengers, and seats, with proper error handling and request logging middleware.

## Data Storage Design
The application uses Drizzle ORM with PostgreSQL as the primary database. The schema includes four main entities: flights, passengers, bookings, and seats. Database migrations are managed through Drizzle Kit, with the schema defined in TypeScript for type safety. The current implementation includes a fallback in-memory storage system for development environments.

## State Management
Client-side state is managed through TanStack Query for server state and React's built-in state management for local UI state. The application uses React Hook Form with Zod validation for form handling and validation. Global UI state like toasts and modals are handled through context providers.

## Component Architecture
The UI follows a component composition pattern with reusable components in the `/components/ui` directory. Business logic components are organized by feature (flight cards, seat maps, booking forms). The application uses a consistent design system with custom CSS variables and utility classes for spacing, colors, and typography.

# External Dependencies

## UI and Styling
- **shadcn/ui & Radix UI**: Complete component library for accessible UI primitives including dialogs, forms, navigation, and data display components
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent styling
- **Lucide React**: Icon library for consistent iconography throughout the application
- **Framer Motion**: Animation library for smooth page transitions and micro-interactions

## Data Management
- **Drizzle ORM**: TypeScript-first ORM for database operations with PostgreSQL
- **Neon Database**: Serverless PostgreSQL database provider for production deployments
- **TanStack React Query**: Server state management, caching, and synchronization
- **Zod**: Schema validation library for runtime type checking and form validation

## Development Tools
- **Vite**: Build tool and development server with HMR support
- **TypeScript**: Static type checking for improved developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **React Hook Form**: Performant form library with minimal re-renders

## Routing and Navigation
- **wouter**: Lightweight client-side routing library for single-page application navigation

## Database Configuration
- **PostgreSQL**: Primary database with connection managed through environment variables
- **Drizzle Kit**: Database migration and schema management tools
- **Connect PG Simple**: Session store for PostgreSQL (prepared for session management)