import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Seat } from "@shared/schema";

interface SeatMapProps {
  seats: Seat[];
  selectedSeat: Seat | null;
  onSeatSelect: (seat: Seat) => void;
}

export default function SeatMap({ seats, selectedSeat, onSeatSelect }: SeatMapProps) {
  const businessSeats = seats.filter(seat => seat.seatClass === 'Business');
  const economySeats = seats.filter(seat => seat.seatClass === 'Economy');

  const getSeatClasses = (seat: Seat) => {
    const baseClasses = "w-10 h-10 border-2 rounded flex items-center justify-center text-xs font-medium cursor-pointer hover:scale-105 transition-transform";
    
    if (selectedSeat?.id === seat.id) {
      return cn(baseClasses, "seat-selected");
    }
    
    if (seat.isOccupied) {
      return cn(baseClasses, "seat-occupied");
    }
    
    return cn(baseClasses, "seat-available");
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.isOccupied) return;
    onSeatSelect(seat);
  };

  const renderSeats = (seatList: Seat[], title: string, color: string) => {
    const rows = seatList.reduce((acc, seat) => {
      const row = parseInt(seat.seatNumber);
      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);
      return acc;
    }, {} as Record<number, Seat[]>);

    return (
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <div className={`w-3 h-3 ${color} rounded-full`}></div>
          <h4 className="font-semibold">{title}</h4>
        </div>
        <div className="space-y-2">
          {Object.entries(rows)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([rowNumber, rowSeats]) => {
              const sortedSeats = rowSeats.sort((a, b) => 
                a.seatNumber.localeCompare(b.seatNumber)
              );
              
              return (
                <div key={rowNumber} className="flex justify-center space-x-2">
                  {sortedSeats.map((seat, index) => {
                    // Add gap between C and D for economy class (aisle)
                    const showGap = title === 'Economy Class' && 
                                  index === 2 && 
                                  sortedSeats.length > 3;
                    
                    return (
                      <div key={seat.id} className="flex space-x-2">
                        <div
                          className={getSeatClasses(seat)}
                          onClick={() => handleSeatClick(seat)}
                          data-testid={`seat-${seat.seatNumber}`}
                        >
                          {seat.seatNumber}
                        </div>
                        {showGap && <div className="w-4"></div>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aircraft Seat Map</CardTitle>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-ethiopian-green border-2 border-ethiopian-green rounded"></div>
            <span>Selected</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {businessSeats.length > 0 && renderSeats(businessSeats, 'Business Class', 'bg-ethiopian-gold')}
        {economySeats.length > 0 && renderSeats(economySeats, 'Economy Class', 'bg-green-500')}
      </CardContent>
    </Card>
  );
}
