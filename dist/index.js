// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  flights = /* @__PURE__ */ new Map();
  passengers = /* @__PURE__ */ new Map();
  bookings = /* @__PURE__ */ new Map();
  seats = /* @__PURE__ */ new Map();
  constructor() {
    this.initializeDefaultData();
  }
  initializeDefaultData() {
    const defaultFlights = [
      {
        id: "101",
        flightNumber: "ET-101",
        departure: "Addis Ababa (ADD)",
        destination: "Dire Dawa (DIR)",
        departureTime: "08:00",
        arrivalTime: "10:00",
        duration: "2h 0m",
        price: "89.00",
        economySeats: 10,
        businessSeats: 5,
        totalSeats: 15
      },
      {
        id: "102",
        flightNumber: "ET-102",
        departure: "Addis Ababa (ADD)",
        destination: "Gondar (GDQ)",
        departureTime: "09:00",
        arrivalTime: "11:00",
        duration: "2h 0m",
        price: "95.00",
        economySeats: 10,
        businessSeats: 5,
        totalSeats: 15
      },
      {
        id: "103",
        flightNumber: "ET-103",
        departure: "Addis Ababa (ADD)",
        destination: "Bahir Dar (BJR)",
        departureTime: "10:00",
        arrivalTime: "12:00",
        duration: "2h 0m",
        price: "92.00",
        economySeats: 10,
        businessSeats: 5,
        totalSeats: 15
      },
      {
        id: "104",
        flightNumber: "ET-104",
        departure: "Addis Ababa (ADD)",
        destination: "Mekele (MQX)",
        departureTime: "13:00",
        arrivalTime: "15:00",
        duration: "2h 0m",
        price: "88.00",
        economySeats: 10,
        businessSeats: 5,
        totalSeats: 15
      },
      {
        id: "105",
        flightNumber: "ET-105",
        departure: "Dire Dawa (DIR)",
        destination: "Addis Ababa (ADD)",
        departureTime: "14:00",
        arrivalTime: "16:00",
        duration: "2h 0m",
        price: "89.00",
        economySeats: 10,
        businessSeats: 5,
        totalSeats: 15
      }
    ];
    defaultFlights.forEach((flight) => {
      this.flights.set(flight.id, flight);
      this.initializeFlightSeats(flight.id, flight.businessSeats, flight.economySeats);
    });
  }
  initializeFlightSeats(flightId, businessSeats, economySeats) {
    for (let row = 1; row <= Math.ceil(businessSeats / 3); row++) {
      const seats2 = ["A", "B", "C"];
      for (let i = 0; i < Math.min(3, businessSeats - (row - 1) * 3); i++) {
        const seatNumber = `${row}${seats2[i]}`;
        const seat = {
          id: `${flightId}_${seatNumber}`,
          flightId,
          seatNumber,
          seatClass: "Business",
          isOccupied: Math.random() < 0.3,
          // 30% chance of being occupied
          price: "25.00"
        };
        this.seats.set(seat.id, seat);
      }
    }
    const startRow = Math.ceil(businessSeats / 3) + 1;
    for (let row = startRow; row < startRow + Math.ceil(economySeats / 6); row++) {
      const seats2 = ["A", "B", "C", "D", "E", "F"];
      const seatsInRow = Math.min(6, economySeats - (row - startRow) * 6);
      for (let i = 0; i < seatsInRow; i++) {
        const seatNumber = `${row}${seats2[i]}`;
        const seat = {
          id: `${flightId}_${seatNumber}`,
          flightId,
          seatNumber,
          seatClass: "Economy",
          isOccupied: Math.random() < 0.4,
          // 40% chance of being occupied
          price: "15.00"
        };
        this.seats.set(seat.id, seat);
      }
    }
  }
  generateBookingReference() {
    return "ET" + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  // Flight methods
  async getFlights() {
    return Array.from(this.flights.values());
  }
  async getFlight(id) {
    return this.flights.get(id);
  }
  async createFlight(insertFlight) {
    const id = randomUUID();
    const flight = {
      ...insertFlight,
      id,
      economySeats: insertFlight.economySeats || 10,
      businessSeats: insertFlight.businessSeats || 5,
      totalSeats: insertFlight.totalSeats || 15
    };
    this.flights.set(id, flight);
    this.initializeFlightSeats(id, flight.businessSeats, flight.economySeats);
    return flight;
  }
  // Passenger methods
  async getPassenger(id) {
    return this.passengers.get(id);
  }
  async createPassenger(insertPassenger) {
    const id = randomUUID();
    const passenger = { ...insertPassenger, id };
    this.passengers.set(id, passenger);
    return passenger;
  }
  // Booking methods
  async getBookings() {
    return Array.from(this.bookings.values());
  }
  async getBooking(id) {
    return this.bookings.get(id);
  }
  async getBookingByReference(reference) {
    return Array.from(this.bookings.values()).find(
      (booking) => booking.bookingReference === reference
    );
  }
  async createBooking(insertBooking) {
    const id = randomUUID();
    const bookingReference = this.generateBookingReference();
    const booking = {
      ...insertBooking,
      id,
      bookingReference,
      bookingDate: /* @__PURE__ */ new Date(),
      status: insertBooking.status || "confirmed",
      specialRequests: insertBooking.specialRequests || []
    };
    this.bookings.set(id, booking);
    await this.updateSeatOccupancy(booking.flightId, booking.seatNumber, true);
    return booking;
  }
  async updateBookingStatus(id, status) {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      this.bookings.set(id, booking);
    }
    return booking;
  }
  // Seat methods
  async getFlightSeats(flightId) {
    return Array.from(this.seats.values()).filter((seat) => seat.flightId === flightId);
  }
  async getSeat(flightId, seatNumber) {
    return this.seats.get(`${flightId}_${seatNumber}`);
  }
  async createSeat(insertSeat) {
    const id = `${insertSeat.flightId}_${insertSeat.seatNumber}`;
    const seat = {
      ...insertSeat,
      id,
      price: insertSeat.price || "0",
      isOccupied: insertSeat.isOccupied || false
    };
    this.seats.set(id, seat);
    return seat;
  }
  async updateSeatOccupancy(flightId, seatNumber, isOccupied) {
    const seatId = `${flightId}_${seatNumber}`;
    const seat = this.seats.get(seatId);
    if (seat) {
      seat.isOccupied = isOccupied;
      this.seats.set(seatId, seat);
    }
    return seat;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var flights = pgTable("flights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flightNumber: text("flight_number").notNull().unique(),
  departure: text("departure").notNull(),
  destination: text("destination").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  duration: text("duration").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  economySeats: integer("economy_seats").notNull().default(10),
  businessSeats: integer("business_seats").notNull().default(5),
  totalSeats: integer("total_seats").notNull().default(15)
});
var passengers = pgTable("passengers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  nationality: text("nationality").notNull(),
  passportId: text("passport_id").notNull()
});
var bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingReference: text("booking_reference").notNull().unique(),
  flightId: varchar("flight_id").notNull(),
  passengerId: varchar("passenger_id").notNull(),
  seatNumber: text("seat_number").notNull(),
  seatClass: text("seat_class").notNull(),
  // 'Economy' or 'Business'
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  specialRequests: text("special_requests").array(),
  bookingDate: timestamp("booking_date").defaultNow(),
  status: text("status").notNull().default("confirmed")
  // 'confirmed', 'checked-in', 'cancelled'
});
var seats = pgTable("seats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flightId: varchar("flight_id").notNull(),
  seatNumber: text("seat_number").notNull(),
  seatClass: text("seat_class").notNull(),
  isOccupied: boolean("is_occupied").default(false),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0")
});
var insertFlightSchema = createInsertSchema(flights).omit({
  id: true
});
var insertPassengerSchema = createInsertSchema(passengers).omit({
  id: true
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingReference: true,
  bookingDate: true
});
var insertSeatSchema = createInsertSchema(seats).omit({
  id: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/flights", async (req, res) => {
    try {
      const flights2 = await storage.getFlights();
      res.json(flights2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flights" });
    }
  });
  app2.get("/api/flights/:id", async (req, res) => {
    try {
      const flight = await storage.getFlight(req.params.id);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      res.json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flight" });
    }
  });
  app2.get("/api/flights/:id/seats", async (req, res) => {
    try {
      const seats2 = await storage.getFlightSeats(req.params.id);
      res.json(seats2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seats" });
    }
  });
  app2.get("/api/bookings", async (req, res) => {
    try {
      const bookings2 = await storage.getBookings();
      res.json(bookings2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  app2.get("/api/bookings/reference/:reference", async (req, res) => {
    try {
      const booking = await storage.getBookingByReference(req.params.reference);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });
  const createBookingSchema = z.object({
    passenger: insertPassengerSchema,
    booking: insertBookingSchema.omit({ passengerId: true }).extend({
      specialRequests: z.array(z.string()).optional()
    })
  });
  app2.post("/api/bookings", async (req, res) => {
    try {
      const { passenger: passengerData, booking: bookingData } = createBookingSchema.parse(req.body);
      const seat = await storage.getSeat(
        bookingData.flightId,
        bookingData.seatNumber
      );
      if (!seat) {
        return res.status(400).json({ message: "Seat not found" });
      }
      if (seat.isOccupied) {
        return res.status(400).json({ message: "Seat is already occupied" });
      }
      const passenger = await storage.createPassenger(passengerData);
      const booking = await storage.createBooking({
        ...bookingData,
        passengerId: passenger.id.toString(),
        specialRequests: bookingData.specialRequests || []
      });
      res.status(201).json({ booking, passenger });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const flights2 = await storage.getFlights();
      const bookings2 = await storage.getBookings();
      const totalFlights = flights2.length;
      const activeBookings = bookings2.filter(
        (b) => b.status === "confirmed" || b.status === "checked-in"
      ).length;
      const totalRevenue = bookings2.reduce(
        (sum, booking) => sum + parseFloat(booking.totalPrice),
        0
      );
      let totalSeats = 0;
      let occupiedSeats = 0;
      for (const flight of flights2) {
        const seats2 = await storage.getFlightSeats(flight.id);
        totalSeats += seats2.length;
        occupiedSeats += seats2.filter((seat) => seat.isOccupied).length;
      }
      const occupancyRate = totalSeats > 0 ? Math.round(occupiedSeats / totalSeats * 100) : 0;
      res.json({
        totalFlights,
        activeBookings,
        occupancyRate,
        totalRevenue: totalRevenue.toFixed(2)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  app2.get("/api/dashboard/availability", async (req, res) => {
    try {
      const flights2 = await storage.getFlights();
      const availability = [];
      for (const flight of flights2) {
        const seats2 = await storage.getFlightSeats(flight.id);
        const availableSeats = seats2.filter((seat) => !seat.isOccupied).length;
        const totalSeats = seats2.length;
        availability.push({
          flightNumber: flight.flightNumber,
          destination: flight.destination,
          availableSeats,
          totalSeats,
          occupancyRate: totalSeats > 0 ? Math.round((totalSeats - availableSeats) / totalSeats * 100) : 0
        });
      }
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch availability data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
