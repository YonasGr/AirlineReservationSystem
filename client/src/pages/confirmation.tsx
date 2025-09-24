// client/src/pages/confirmation.tsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import TicketDesign from "@/components/ticket-design";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, Download, Mail, Loader2 } from "lucide-react";
import type { Booking, Flight } from "@shared/schema";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';

export default function Confirmation() {
    const [match, params] = useRoute("/confirmation/:bookingReference");
    const [, setLocation] = useLocation();
    const bookingReference = match ? params?.bookingReference : undefined;
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Create a ref to attach to the TicketDesign component
    const ticketRef = useRef(null);
    
    // State for email functionality
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [customEmail, setCustomEmail] = useState("");

    const {
        data: bookingData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["/api/bookings/reference", bookingReference],
        enabled: !!bookingReference,
    });

    const booking = bookingData as Booking | undefined;

    const {
        data: flight,
    } = useQuery<Flight>({
        queryKey: ["/api/flights", booking?.flightId],
        enabled: !!booking?.flightId,
    });

    const handleDownloadTicket = () => {
        if (ticketRef.current) {
            // Use html2canvas to capture the content of the ticket
            html2canvas(ticketRef.current, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`ticket-${bookingReference}.pdf`);
            });
        }
    };

    const handleEmailTicket = () => {
        if (!showEmailInput) {
            setShowEmailInput(true);
            return;
        }
        
        // Trigger email mutation
        emailTicketMutation.mutate({
            bookingReference: bookingReference!,
            email: customEmail.trim() || undefined
        });
    };

    // Email ticket mutation
    const emailTicketMutation = useMutation({
        mutationFn: async ({ bookingReference, email }: { bookingReference: string, email?: string }) => {
            const response = await fetch("/api/bookings/email-ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    bookingReference,
                    email 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to send email");
            }

            return response.json();
        },
        onSuccess: (data) => {
            toast({
                title: "Email Sent Successfully!",
                description: `Your ticket has been sent to ${data.recipientEmail}`,
            });
            setShowEmailInput(false);
            setCustomEmail("");
        },
        onError: (error: Error) => {
            toast({
                title: "Failed to Send Email",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleBookAnother = () => {
        setLocation("/");
    };

    if (!bookingReference) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-destructive">Invalid booking reference.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
                    <div className="h-96 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-destructive">Booking not found. Please check your booking reference.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Success Animation */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <Check className="text-green-600 h-12 w-12" />
                    </motion.div>
                    <h2 className="text-3xl font-display font-bold mb-2 text-green-600">
                        Booking Confirmed!
                    </h2>
                    <p className="text-muted-foreground">
                        Your flight has been successfully booked
                    </p>
                </motion.div>

                {/* Ticket Design */}
                <motion.div
                    ref={ticketRef} // Attach the ref here
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <TicketDesign booking={booking} flight={flight} />
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <Button
                        onClick={handleDownloadTicket}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        data-testid="button-download-ticket"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Ticket
                    </Button>
                    
                    {/* Email Ticket Section */}
                    <div className="flex flex-col gap-2">
                        {showEmailInput && (
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter email address (optional)"
                                    value={customEmail}
                                    onChange={(e) => setCustomEmail(e.target.value)}
                                    className="max-w-xs"
                                    disabled={emailTicketMutation.isPending}
                                />
                            </div>
                        )}
                        <Button
                            onClick={handleEmailTicket}
                            variant="secondary"
                            data-testid="button-email-ticket"
                            disabled={emailTicketMutation.isPending}
                        >
                            {emailTicketMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Mail className="mr-2 h-4 w-4" />
                            )}
                            {emailTicketMutation.isPending 
                                ? "Sending..." 
                                : showEmailInput 
                                    ? "Send Email" 
                                    : "Email Ticket"
                            }
                        </Button>
                    </div>
                    
                    <Button
                        onClick={handleBookAnother}
                        variant="outline"
                        data-testid="button-book-another"
                    >
                        Book Another Flight
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}