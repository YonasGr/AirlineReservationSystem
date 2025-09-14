import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ArrowUp, 
  ArrowDown,
  Clock
} from "lucide-react";
import type { Booking } from "@shared/schema";

interface DashboardStats {
  totalFlights: number;
  activeBookings: number;
  occupancyRate: number;
  totalRevenue: string;
}

interface FlightAvailability {
  flightNumber: string;
  destination: string;
  availableSeats: number;
  totalSeats: number;
  occupancyRate: number;
}

export default function Dashboard() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const {
    data: availability,
    isLoading: availabilityLoading,
    error: availabilityError,
  } = useQuery<FlightAvailability[]>({
    queryKey: ["/api/dashboard/availability"],
  });

  const {
    data: bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  if (statsLoading || availabilityLoading || bookingsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (statsError || availabilityError || bookingsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Failed to load dashboard data. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getFlightStatus = (flightNumber: string) => {
    const statusMap: Record<string, { status: string; color: string; bgColor: string }> = {
      "ET-101": { status: "On Time", color: "text-green-700", bgColor: "bg-green-100" },
      "ET-102": { status: "Boarding", color: "text-blue-700", bgColor: "bg-blue-100" },
      "ET-103": { status: "Delayed", color: "text-yellow-700", bgColor: "bg-yellow-100" },
      "ET-104": { status: "On Time", color: "text-green-700", bgColor: "bg-green-100" },
      "ET-105": { status: "Departed", color: "text-purple-700", bgColor: "bg-purple-100" }
    };
    return statusMap[flightNumber] || { status: "Unknown", color: "text-gray-700", bgColor: "bg-gray-100" };
  };

  const recentBookings = bookings?.slice(0, 5) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-display font-bold mb-2">Flight Management Dashboard</h2>
        <p className="text-muted-foreground">Real-time flight operations overview</p>
      </motion.div>

      {/* Dashboard Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Flights</p>
                <p className="text-3xl font-bold text-ethiopian-green" data-testid="stat-total-flights">
                  {stats?.totalFlights || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-ethiopian-green/10 rounded-full flex items-center justify-center">
                <Plane className="text-ethiopian-green h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500 mr-1">5.2%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Bookings</p>
                <p className="text-3xl font-bold text-blue-600" data-testid="stat-active-bookings">
                  {stats?.activeBookings || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center">
                <Users className="text-blue-600 h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500 mr-1">12.3%</span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Occupancy Rate</p>
                <p className="text-3xl font-bold text-ethiopian-gold" data-testid="stat-occupancy-rate">
                  {stats?.occupancyRate || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-ethiopian-gold/10 rounded-full flex items-center justify-center">
                <TrendingUp className="text-ethiopian-gold h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500 mr-1">3.1%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Revenue Today</p>
                <p className="text-3xl font-bold text-ethiopian-red" data-testid="stat-revenue">
                  ${stats?.totalRevenue || '0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-ethiopian-red/10 rounded-full flex items-center justify-center">
                <DollarSign className="text-ethiopian-red h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowDown className="text-red-500 h-4 w-4 mr-1" />
              <span className="text-red-500 mr-1">2.1%</span>
              <span className="text-muted-foreground">vs yesterday</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Flight Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Today's Flight Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["ET-101", "ET-102", "ET-103", "ET-104", "ET-105"].map((flightNumber, index) => {
                const flightData = getFlightStatus(flightNumber);
                const destinations = ["Dire Dawa", "Gondar", "Bahir Dar", "Mekele", "Addis Ababa"];
                const times = ["08:00 AM", "09:00 AM", "10:00 AM", "01:00 PM", "02:00 PM"];
                
                return (
                  <div 
                    key={flightNumber}
                    className={`flex items-center justify-between p-4 ${flightData.bgColor} border border-opacity-20 rounded-xl`}
                    data-testid={`flight-status-${flightNumber}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-current rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-semibold">{flightNumber} to {destinations[index]}</p>
                        <p className="text-sm text-muted-foreground">{times[index]} - {flightData.status}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${flightData.bgColor} ${flightData.color}`}>
                      {flightData.status}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Seat Availability Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Seat Availability by Route</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availability?.map((flight, index) => {
                const colors = [
                  "bg-ethiopian-green",
                  "bg-blue-600", 
                  "bg-ethiopian-gold",
                  "bg-purple-600",
                  "bg-ethiopian-red"
                ];
                
                return (
                  <div key={flight.flightNumber}>
                    <div className="flex justify-between text-sm mb-2">
                      <span data-testid={`availability-flight-${flight.flightNumber}`}>
                        {flight.destination.split(" ")[0]} ({flight.flightNumber})
                      </span>
                      <span data-testid={`availability-seats-${flight.flightNumber}`}>
                        {flight.availableSeats}/{flight.totalSeats} Available
                      </span>
                    </div>
                    <Progress 
                      value={flight.occupancyRate} 
                      className="h-2"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Badge variant="secondary">Latest Updates</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Booking ID</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Flight</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Seat</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking, index) => (
                      <tr key={booking.id} className="border-b border-border last:border-b-0">
                        <td className="py-4 px-4 font-mono text-sm" data-testid={`booking-id-${index}`}>
                          {booking.bookingReference}
                        </td>
                        <td className="py-4 px-4" data-testid={`booking-flight-${index}`}>
                          Flight to destination
                        </td>
                        <td className="py-4 px-4" data-testid={`booking-seat-${index}`}>
                          {booking.seatNumber}
                        </td>
                        <td className="py-4 px-4 font-semibold" data-testid={`booking-amount-${index}`}>
                          ${booking.totalPrice}
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                            data-testid={`booking-status-${index}`}
                          >
                            {booking.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-center text-muted-foreground">
                        No recent bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
