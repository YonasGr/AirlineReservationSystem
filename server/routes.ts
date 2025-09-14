import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPassengerSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all flights
  app.get("/api/flights", async (req, res) => {
    try {
      const flights = await storage.getFlights();
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flights" });
    }
  });

  // Get single flight
  app.get("/api/flights/:id", async (req, res) => {
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

  // Get flight seats
  app.get("/api/flights/:id/seats", async (req, res) => {
    try {
      const seats = await storage.getFlightSeats(req.params.id);
      res.json(seats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seats" });
    }
  });

  // Get all bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get booking by reference
  app.get("/api/bookings/reference/:reference", async (req, res) => {
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

  // Create booking with passenger
  const createBookingSchema = z.object({
    passenger: insertPassengerSchema,
    booking: insertBookingSchema.omit({ passengerId: true }).extend({
      specialRequests: z.array(z.string()).optional(),
    }),
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const { passenger: passengerData, booking: bookingData } =
        createBookingSchema.parse(req.body);

      // Check if seat is available
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

      // Create passenger
      const passenger = await storage.createPassenger(passengerData);

      // Create booking
      const booking = await storage.createBooking({
        ...bookingData,
        passengerId: passenger.id.toString(),
        specialRequests: bookingData.specialRequests || [],
      });

      res.status(201).json({ booking, passenger });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const flights = await storage.getFlights();
      const bookings = await storage.getBookings();

      const totalFlights = flights.length;
      const activeBookings = bookings.filter(
        (b) => b.status === "confirmed" || b.status === "checked-in"
      ).length;
      const totalRevenue = bookings.reduce(
        (sum, booking) => sum + parseFloat(booking.totalPrice),
        0
      );

      // Calculate occupancy rate
      let totalSeats = 0;
      let occupiedSeats = 0;

      for (const flight of flights) {
        const seats = await storage.getFlightSeats(flight.id);
        totalSeats += seats.length;
        occupiedSeats += seats.filter((seat) => seat.isOccupied).length;
      }

      const occupancyRate =
        totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

      res.json({
        totalFlights,
        activeBookings,
        occupancyRate,
        totalRevenue: totalRevenue.toFixed(2),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Get flight availability for dashboard
  app.get("/api/dashboard/availability", async (req, res) => {
    try {
      const flights = await storage.getFlights();
      const availability = [];

      for (const flight of flights) {
        const seats = await storage.getFlightSeats(flight.id);
        const availableSeats = seats.filter((seat) => !seat.isOccupied).length;
        const totalSeats = seats.length;

        availability.push({
          flightNumber: flight.flightNumber,
          destination: flight.destination,
          availableSeats,
          totalSeats,
          occupancyRate:
            totalSeats > 0
              ? Math.round(((totalSeats - availableSeats) / totalSeats) * 100)
              : 0,
        });
      }

      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch availability data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
