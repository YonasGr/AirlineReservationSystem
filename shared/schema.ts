import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const flights = pgTable("flights", {
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
  totalSeats: integer("total_seats").notNull().default(15),
});

export const passengers = pgTable("passengers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  nationality: text("nationality").notNull(),
  passportId: text("passport_id").notNull(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingReference: text("booking_reference").notNull().unique(),
  flightId: varchar("flight_id").notNull(),
  passengerId: varchar("passenger_id").notNull(),
  seatNumber: text("seat_number").notNull(),
  seatClass: text("seat_class").notNull(), // 'Economy' or 'Business'
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  specialRequests: text("special_requests").array(),
  bookingDate: timestamp("booking_date").defaultNow(),
  status: text("status").notNull().default("confirmed"), // 'confirmed', 'checked-in', 'cancelled'
});

export const seats = pgTable("seats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flightId: varchar("flight_id").notNull(),
  seatNumber: text("seat_number").notNull(),
  seatClass: text("seat_class").notNull(),
  isOccupied: boolean("is_occupied").default(false),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
});

export const insertPassengerSchema = createInsertSchema(passengers).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingReference: true,
  bookingDate: true,
});

export const insertSeatSchema = createInsertSchema(seats).omit({
  id: true,
});

export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type InsertPassenger = z.infer<typeof insertPassengerSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertSeat = z.infer<typeof insertSeatSchema>;

export type Flight = typeof flights.$inferSelect;
export type Passenger = typeof passengers.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Seat = typeof seats.$inferSelect;
