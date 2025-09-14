import { 
  type Flight, 
  type InsertFlight,
  type Passenger,
  type InsertPassenger,
  type Booking,
  type InsertBooking,
  type Seat,
  type InsertSeat
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Flights
  getFlights(): Promise<Flight[]>;
  getFlight(id: string): Promise<Flight | undefined>;
  createFlight(flight: InsertFlight): Promise<Flight>;

  // Passengers
  getPassenger(id: string): Promise<Passenger | undefined>;
  createPassenger(passenger: InsertPassenger): Promise<Passenger>;

  // Bookings
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingByReference(reference: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;

  // Seats
  getFlightSeats(flightId: string): Promise<Seat[]>;
  getSeat(flightId: string, seatNumber: string): Promise<Seat | undefined>;
  createSeat(seat: InsertSeat): Promise<Seat>;
  updateSeatOccupancy(flightId: string, seatNumber: string, isOccupied: boolean): Promise<Seat | undefined>;
}

export class MemStorage implements IStorage {
  private flights: Map<string, Flight> = new Map();
  private passengers: Map<string, Passenger> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private seats: Map<string, Seat> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default flights from the design reference
    const defaultFlights: Flight[] = [
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

    defaultFlights.forEach(flight => {
      this.flights.set(flight.id, flight);
      this.initializeFlightSeats(flight.id, flight.businessSeats, flight.economySeats);
    });
  }

  private initializeFlightSeats(flightId: string, businessSeats: number, economySeats: number) {
    // Initialize business class seats (rows 1-2, seats A-C)
    for (let row = 1; row <= Math.ceil(businessSeats / 3); row++) {
      const seats = ['A', 'B', 'C'];
      for (let i = 0; i < Math.min(3, businessSeats - (row - 1) * 3); i++) {
        const seatNumber = `${row}${seats[i]}`;
        const seat: Seat = {
          id: `${flightId}_${seatNumber}`,
          flightId,
          seatNumber,
          seatClass: 'Business',
          isOccupied: Math.random() < 0.3, // 30% chance of being occupied
          price: "25.00"
        };
        this.seats.set(seat.id, seat);
      }
    }

    // Initialize economy class seats (rows 3+, seats A-F)
    const startRow = Math.ceil(businessSeats / 3) + 1;
    for (let row = startRow; row < startRow + Math.ceil(economySeats / 6); row++) {
      const seats = ['A', 'B', 'C', 'D', 'E', 'F'];
      const seatsInRow = Math.min(6, economySeats - (row - startRow) * 6);
      for (let i = 0; i < seatsInRow; i++) {
        const seatNumber = `${row}${seats[i]}`;
        const seat: Seat = {
          id: `${flightId}_${seatNumber}`,
          flightId,
          seatNumber,
          seatClass: 'Economy',
          isOccupied: Math.random() < 0.4, // 40% chance of being occupied
          price: "15.00"
        };
        this.seats.set(seat.id, seat);
      }
    }
  }

  private generateBookingReference(): string {
    return 'ET' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  // Flight methods
  async getFlights(): Promise<Flight[]> {
    return Array.from(this.flights.values());
  }

  async getFlight(id: string): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async createFlight(insertFlight: InsertFlight): Promise<Flight> {
    const id = randomUUID();
    const flight: Flight = { 
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
  async getPassenger(id: string): Promise<Passenger | undefined> {
    return this.passengers.get(id);
  }

  async createPassenger(insertPassenger: InsertPassenger): Promise<Passenger> {
    const id = randomUUID();
    const passenger: Passenger = { ...insertPassenger, id };
    this.passengers.set(id, passenger);
    return passenger;
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingByReference(reference: string): Promise<Booking | undefined> {
    return Array.from(this.bookings.values()).find(
      booking => booking.bookingReference === reference
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const bookingReference = this.generateBookingReference();
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      bookingReference,
      bookingDate: new Date(),
      status: insertBooking.status || "confirmed",
      specialRequests: insertBooking.specialRequests || []
    };
    this.bookings.set(id, booking);
    
    // Mark seat as occupied
    await this.updateSeatOccupancy(booking.flightId, booking.seatNumber, true);
    
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      this.bookings.set(id, booking);
    }
    return booking;
  }

  // Seat methods
  async getFlightSeats(flightId: string): Promise<Seat[]> {
    return Array.from(this.seats.values()).filter(seat => seat.flightId === flightId);
  }

  async getSeat(flightId: string, seatNumber: string): Promise<Seat | undefined> {
    return this.seats.get(`${flightId}_${seatNumber}`);
  }

  async createSeat(insertSeat: InsertSeat): Promise<Seat> {
    const id = `${insertSeat.flightId}_${insertSeat.seatNumber}`;
    const seat: Seat = { 
      ...insertSeat, 
      id,
      price: insertSeat.price || "0",
      isOccupied: insertSeat.isOccupied || false
    };
    this.seats.set(id, seat);
    return seat;
  }

  async updateSeatOccupancy(flightId: string, seatNumber: string, isOccupied: boolean): Promise<Seat | undefined> {
    const seatId = `${flightId}_${seatNumber}`;
    const seat = this.seats.get(seatId);
    if (seat) {
      seat.isOccupied = isOccupied;
      this.seats.set(seatId, seat);
    }
    return seat;
  }
}

export const storage = new MemStorage();
