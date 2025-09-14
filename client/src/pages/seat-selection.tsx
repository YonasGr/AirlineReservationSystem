import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import SeatMap from "@/components/seat-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Flight, Seat } from "@shared/schema";

export default function SeatSelection() {
  const [match, params] = useRoute("/seat-selection/:flightId");
  const [, setLocation] = useLocation();
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  const flightId = match ? params?.flightId : undefined;

  const {
    data: flight,
    isLoading: flightLoading,
    error: flightError,
  } = useQuery<Flight>({
    queryKey: ["/api/flights", flightId],
    enabled: !!flightId,
  });

  const {
    data: seats,
    isLoading: seatsLoading,
    error: seatsError,
  } = useQuery<Seat[]>({
    queryKey: ["/api/flights", flightId, "seats"],
    enabled: !!flightId,
  });

  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeat(seat);
  };

  const handleProceedToBooking = () => {
    if (selectedSeat && flightId) {
      setLocation(`/booking/${flightId}/${selectedSeat.seatNumber}`);
    }
  };

  const calculateTotal = () => {
    if (!flight || !selectedSeat) return parseFloat(flight?.price || "0");
    return parseFloat(flight.price) + parseFloat(selectedSeat.price);
  };

  if (!flightId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Invalid flight selected.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (flightLoading || seatsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (flightError || seatsError || !flight || !seats) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Failed to load flight information. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-display font-bold mb-2">Select Your Seats</h2>
          <p className="text-muted-foreground">
            Flight {flight.flightNumber} to {flight.destination.split(" ")[0]}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SeatMap
              seats={seats}
              selectedSeat={selectedSeat}
              onSeatSelect={handleSeatSelect}
            />
          </motion.div>

          {/* Seat Selection Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Selection Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div id="selected-seats-display" data-testid="selected-seats-display">
                  {selectedSeat ? (
                    <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                      <span>Seat {selectedSeat.seatNumber} ({selectedSeat.seatClass})</span>
                      <span className="font-semibold">+${selectedSeat.price}</span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No seats selected</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Base Price:</span>
                    <span className="font-semibold" data-testid="base-price">${flight.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Seat Selection:</span>
                    <span className="font-semibold" data-testid="seat-fee">
                      ${selectedSeat ? selectedSeat.price : "0"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span data-testid="total-price">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToBooking}
                  disabled={!selectedSeat}
                  className="w-full"
                  data-testid="button-proceed-booking"
                >
                  Continue to Booking
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
