import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import FlightCard from "@/components/flight-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Flight } from "@shared/schema";

export default function Home() {
  const [searchForm, setSearchForm] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "1",
  });
  const [showResults, setShowResults] = useState(false);

  const {
    data: flights,
    isLoading,
    error,
  } = useQuery<Flight[]>({
    queryKey: ["/api/flights"],
    enabled: showResults,
  });

  const handleSearch = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative bg-gradient-to-br from-ethiopian-green via-blue-600 to-ethiopian-gold min-h-[60vh] flex items-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <motion.h1
              className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Discover
              <br />
              <span className="text-ethiopian-gold">Ethiopia</span>
            </motion.h1>
            <motion.p
              className="text-xl text-white/90 mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience the cradle of humanity with our premium domestic flights
              connecting you to Ethiopia's most beautiful destinations.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Flight Search Form */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-ethiopian-green rounded-full flex items-center justify-center">
              <Search className="text-white h-6 w-6" />
            </div>
            <h2 className="text-2xl font-display font-semibold">Search Flights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Select onValueChange={(value) => setSearchForm({...searchForm, from: value})}>
                <SelectTrigger data-testid="select-from">
                  <SelectValue placeholder="Select departure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADD">Addis Ababa (ADD)</SelectItem>
                  <SelectItem value="DIR">Dire Dawa (DIR)</SelectItem>
                  <SelectItem value="GDQ">Gondar (GDQ)</SelectItem>
                  <SelectItem value="BJR">Bahir Dar (BJR)</SelectItem>
                  <SelectItem value="MQX">Mekele (MQX)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Select onValueChange={(value) => setSearchForm({...searchForm, to: value})}>
                <SelectTrigger data-testid="select-to">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIR">Dire Dawa (DIR)</SelectItem>
                  <SelectItem value="GDQ">Gondar (GDQ)</SelectItem>
                  <SelectItem value="BJR">Bahir Dar (BJR)</SelectItem>
                  <SelectItem value="MQX">Mekele (MQX)</SelectItem>
                  <SelectItem value="ADD">Addis Ababa (ADD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Departure</Label>
              <Input
                id="date"
                type="date"
                value={searchForm.date}
                onChange={(e) => setSearchForm({...searchForm, date: e.target.value})}
                data-testid="input-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passengers">Passengers</Label>
              <Select onValueChange={(value) => setSearchForm({...searchForm, passengers: value})}>
                <SelectTrigger data-testid="select-passengers">
                  <SelectValue placeholder="1 Passenger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Passenger</SelectItem>
                  <SelectItem value="2">2 Passengers</SelectItem>
                  <SelectItem value="3">3 Passengers</SelectItem>
                  <SelectItem value="4">4+ Passengers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-ethiopian-green to-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            data-testid="button-search-flights"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Flights
          </Button>
        </motion.div>
      </div>

      {/* Flight Results */}
      {showResults && (
        <div className="container mx-auto px-4 mt-12">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-display font-bold mb-2">Available Flights</h2>
            <p className="text-muted-foreground">Choose from our domestic routes</p>
          </motion.div>

          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-xl"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-24"></div>
                          <div className="h-3 bg-muted rounded w-32"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-destructive">Failed to load flights. Please try again.</p>
              </CardContent>
            </Card>
          )}

          {flights && flights.length > 0 && (
            <motion.div
              className="grid gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {flights.map((flight, index) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <FlightCard flight={flight} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {flights && flights.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No flights found. Please try different search criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
