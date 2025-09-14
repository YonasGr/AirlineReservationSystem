import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Clock, MapPin } from "lucide-react";
import type { Flight } from "@shared/schema";

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const [, setLocation] = useLocation();

  const handleSelectFlight = () => {
    setLocation(`/seat-selection/${flight.id}`);
  };

  const getDestinationCity = (destination: string) => {
    const city = destination.split(" ")[0];
    return city;
  };

  const getGradientColor = (flightNumber: string) => {
    const colorMap: Record<string, string> = {
      "ET-101": "from-ethiopian-green to-blue-600",
      "ET-102": "from-ethiopian-red to-orange-600",
      "ET-103": "from-blue-600 to-ethiopian-green",
      "ET-104": "from-purple-600 to-ethiopian-green",
      "ET-105": "from-ethiopian-gold to-ethiopian-red",
    };
    return colorMap[flightNumber] || "from-ethiopian-green to-blue-600";
  };

  return (
    <Card className="flight-card bg-card rounded-2xl shadow-lg border border-border p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div
              className={`w-16 h-16 bg-gradient-to-br ${getGradientColor(
                flight.flightNumber
              )} rounded-xl flex items-center justify-center`}
            >
              <Plane className="text-white h-6 w-6" />
            </div>
            <div>
              <h3
                className="font-display font-semibold text-xl"
                data-testid={`text-flight-${flight.id}`}
              >
                {flight.flightNumber}
              </h3>
              <p className="text-muted-foreground">Ethiopian Airlines</p>
            </div>
          </div>
          <div className="text-right">
            <p
              className="text-2xl font-bold text-ethiopian-green"
              data-testid={`text-price-${flight.id}`}
            >
              ${flight.price}
            </p>
            <p className="text-sm text-muted-foreground">per person</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <p
              className="text-2xl font-bold"
              data-testid={`text-departure-${flight.id}`}
            >
              {flight.departureTime}
            </p>
            <p className="text-sm text-muted-foreground">
              {flight.departure.split(" ")[1]?.replace(/[()]/g, "")}
            </p>
            <p className="text-xs text-muted-foreground">
              {flight.departure.split(" ")[0]}
            </p>
          </div>

          <div className="flex-1 mx-6 relative">
            <div className="h-0.5 bg-border"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-ethiopian-green w-8 h-8 rounded-full flex items-center justify-center">
              <Plane className="text-white h-4 w-4" />
            </div>
            <div className="flex items-center justify-center mt-2 space-x-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{flight.duration}</p>
            </div>
          </div>

          <div className="text-center">
            <p
              className="text-2xl font-bold"
              data-testid={`text-arrival-${flight.id}`}
            >
              {flight.arrivalTime}
            </p>
            <p className="text-sm text-muted-foreground">
              {flight.destination.split(" ")[1]?.replace(/[()]/g, "")}
            </p>
            <p className="text-xs text-muted-foreground">
              {getDestinationCity(flight.destination)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">
                Economy: {flight.economySeats} seats
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-ethiopian-gold rounded-full"></div>
              <span className="text-sm">
                Business: {flight.businessSeats} seats
              </span>
            </div>
          </div>
          <Button
            onClick={handleSelectFlight}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            data-testid={`button-select-flight-${flight.id}`}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Select Flight
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
