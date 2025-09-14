import { Plane } from "lucide-react";
import type { Booking, Flight } from "@shared/schema";

interface TicketDesignProps {
  booking: Booking;
  flight?: Flight;
}

export default function TicketDesign({ booking, flight }: TicketDesignProps) {
  if (!flight) {
    return (
      <div className="bg-muted rounded-xl p-8 text-center">
        <p className="text-muted-foreground">Loading flight information...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-ethiopian-green to-blue-600 p-1 rounded-2xl mb-8">
      <div className="bg-white rounded-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-ethiopian-green to-ethiopian-gold rounded-full flex items-center justify-center">
              <Plane className="text-white h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-ethiopian-green">
                Ethiopian Airlines
              </h3>
              <p className="text-sm text-muted-foreground">Electronic Ticket</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Booking Reference</p>
            <p 
              className="text-2xl font-bold text-ethiopian-green"
              data-testid="booking-reference"
            >
              {booking.bookingReference}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">Passenger Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium" data-testid="passenger-name">Passenger</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seat:</span>
                <span className="font-medium" data-testid="ticket-seat">
                  {booking.seatNumber} ({booking.seatClass})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ticket Number:</span>
                <span className="font-medium">125-{booking.id.slice(-10)}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Flight Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flight:</span>
                <span className="font-medium" data-testid="ticket-flight-number">
                  {flight.flightNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route:</span>
                <span className="font-medium" data-testid="ticket-route">
                  {flight.departure.split(" ")[1]?.replace(/[()]/g, "")} → {flight.destination.split(" ")[1]?.replace(/[()]/g, "")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium" data-testid="ticket-time">
                  {flight.departureTime} - {flight.arrivalTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 mb-6">
          <div className="flex items-center justify-between text-2xl font-bold">
            <span>Total Paid:</span>
            <span className="text-ethiopian-green" data-testid="ticket-total">
              ${booking.totalPrice}
            </span>
          </div>
        </div>

        <div className="border-t border-dashed border-border pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">DEPARTURE</p>
              <p className="text-lg font-bold" data-testid="ticket-departure-time">
                {flight.departureTime}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="ticket-departure-city">
                {flight.departure.split(" ")[0]}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">FLIGHT TIME</p>
              <p className="text-lg font-bold" data-testid="ticket-duration">
                {flight.duration}
              </p>
              <p className="text-sm text-muted-foreground">Non-stop</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">ARRIVAL</p>
              <p className="text-lg font-bold" data-testid="ticket-arrival-time">
                {flight.arrivalTime}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="ticket-arrival-city">
                {flight.destination.split(" ")[0]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
