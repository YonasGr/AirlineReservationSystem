import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plane, Check } from "lucide-react";
import type { Flight, Seat } from "@shared/schema";

const bookingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(1, "Nationality is required"),
  passportId: z.string().min(1, "ID number is required"),
  wheelchairAssistance: z.boolean().default(false),
  vegetarianMeal: z.boolean().default(false),
  extraLegroom: z.boolean().default(false),
  petTransportation: z.boolean().default(false),
});

export default function Booking() {
  const [match, params] = useRoute("/booking/:flightId/:seatNumber");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const flightId = match ? params?.flightId : undefined;
  const seatNumber = match ? params?.seatNumber : undefined;

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      passportId: "",
      wheelchairAssistance: false,
      vegetarianMeal: false,
      extraLegroom: false,
      petTransportation: false,
    },
  });

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

  const selectedSeat = seats?.find(seat => seat.seatNumber === seatNumber);

  const createBookingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof bookingFormSchema>) => {
      if (!flight || !selectedSeat) throw new Error("Missing flight or seat data");
      
      const specialRequests = [];
      if (data.wheelchairAssistance) specialRequests.push("Wheelchair assistance");
      if (data.vegetarianMeal) specialRequests.push("Vegetarian meal");
      if (data.extraLegroom) specialRequests.push("Extra legroom");
      if (data.petTransportation) specialRequests.push("Pet transportation");

      const totalPrice = parseFloat(flight.price) + parseFloat(selectedSeat.price) + 12; // Add taxes/fees

      return await apiRequest("POST", "/api/bookings", {
        passenger: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          nationality: data.nationality,
          passportId: data.passportId,
        },
        booking: {
          flightId: flight.id,
          seatNumber: selectedSeat.seatNumber,
          seatClass: selectedSeat.seatClass,
          totalPrice: totalPrice.toFixed(2),
          specialRequests,
          status: "confirmed",
        },
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      toast({
        title: "Booking Confirmed!",
        description: `Your booking reference is ${data.booking.bookingReference}`,
      });
      
      // Invalidate queries to update seat availability
      queryClient.invalidateQueries({ queryKey: ["/api/flights", flightId, "seats"] });
      
      setLocation(`/confirmation/${data.booking.bookingReference}`);
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof bookingFormSchema>) => {
    createBookingMutation.mutate(data);
  };

  if (!flightId || !seatNumber) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Invalid booking parameters.</p>
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
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (flightError || seatsError || !flight || !selectedSeat) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Failed to load booking information. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrice = parseFloat(flight.price) + parseFloat(selectedSeat.price) + 12;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-display font-bold mb-2">Passenger Information</h2>
          <p className="text-muted-foreground">Complete your booking details</p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                <Check className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Flight Selected</span>
            </div>
            <div className="w-12 h-0.5 bg-primary"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                <Check className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Seats Selected</span>
            </div>
            <div className="w-12 h-0.5 bg-primary"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <span className="ml-2 text-sm font-medium text-primary">Booking Details</span>
            </div>
            <div className="w-12 h-0.5 bg-muted"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-semibold">4</div>
              <span className="ml-2 text-sm text-muted-foreground">Confirmation</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} data-testid="input-first-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} data-testid="input-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+251 9XX XXX XXX" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-dob" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-gender">
                                  <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nationality *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-nationality">
                                  <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ethiopia">Ethiopia</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="passportId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport/ID Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your ID number" {...field} data-testid="input-passport" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-4">Special Requests</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="wheelchairAssistance"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-wheelchair"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Wheelchair assistance</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="vegetarianMeal"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-vegetarian"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Vegetarian meal</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="extraLegroom"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-legroom"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Extra legroom</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="petTransportation"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-pet"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Pet transportation</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createBookingMutation.isPending}
                      data-testid="button-complete-booking"
                    >
                      {createBookingMutation.isPending ? "Processing..." : "Complete Booking"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Plane className="text-white h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold" data-testid="summary-flight">
                        {flight.flightNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {flight.departure.split(" ")[0]} → {flight.destination.split(" ")[0]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {flight.departureTime} - {flight.arrivalTime}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="font-semibold mb-2">Selected Seat:</p>
                    <p className="text-sm" data-testid="summary-seat">
                      Seat {selectedSeat.seatNumber} ({selectedSeat.seatClass}) - +${selectedSeat.price}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Passenger:</span>
                    <span className="font-semibold" data-testid="summary-base-price">${flight.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Seat Selection:</span>
                    <span className="font-semibold" data-testid="summary-seat-price">${selectedSeat.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taxes & Fees:</span>
                    <span className="font-semibold">$12</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span data-testid="summary-total-price">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
