import nodemailer from 'nodemailer';
import type { Booking, Flight, Passenger } from '@shared/schema';

interface EmailTicketData {
  booking: Booking;
  flight: Flight;
  passenger: Passenger;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure nodemailer transporter
    // For production, you would use real SMTP credentials
    // For demo purposes, we'll use a test account or console log
    this.transporter = nodemailer.createTransport({
      // Use ethereal email for testing or replace with real SMTP config
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.EMAIL_PASS || 'ethereal.pass'
      }
    });
  }

  async sendTicketEmail(to: string, ticketData: EmailTicketData): Promise<boolean> {
    try {
      const { booking, flight, passenger } = ticketData;

      // Create email HTML template
      const htmlContent = this.generateEmailTemplate(ticketData);

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@ethiopianairlines.com',
        to: to,
        subject: `Your Flight Ticket - ${flight.flightNumber} (${booking.bookingReference})`,
        html: htmlContent,
        text: this.generateTextContent(ticketData)
      };

      // For development/demo purposes, log email content instead of sending
      if (process.env.NODE_ENV === 'development') {
        console.log('=== EMAIL TICKET ===');
        console.log(`To: ${to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log('Content:');
        console.log(mailOptions.text);
        console.log('===================');
        return true;
      }

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  private generateEmailTemplate(ticketData: EmailTicketData): string {
    const { booking, flight, passenger } = ticketData;
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Flight Ticket</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #22c55e, #3b82f6); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 10px 0 0; font-size: 16px; opacity: 0.9; }
            .content { padding: 30px; }
            .ticket-section { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .ticket-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .ticket-label { font-weight: bold; color: #374151; }
            .ticket-value { color: #1f2937; }
            .highlight { background-color: #dbeafe; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✈️ Ethiopian Airlines</h1>
                <p>Your flight ticket is ready!</p>
            </div>
            
            <div class="content">
                <div class="highlight">
                    <h2 style="margin: 0; color: #1f2937;">Booking Confirmed!</h2>
                    <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #059669;">
                        Booking Reference: ${booking.bookingReference}
                    </p>
                </div>
                
                <div class="ticket-section">
                    <h3 style="margin-top: 0; color: #374151;">Passenger Information</h3>
                    <div class="ticket-row">
                        <span class="ticket-label">Name:</span>
                        <span class="ticket-value">${passenger.firstName} ${passenger.lastName}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Email:</span>
                        <span class="ticket-value">${passenger.email}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Phone:</span>
                        <span class="ticket-value">${passenger.phone}</span>
                    </div>
                </div>
                
                <div class="ticket-section">
                    <h3 style="margin-top: 0; color: #374151;">Flight Details</h3>
                    <div class="ticket-row">
                        <span class="ticket-label">Flight:</span>
                        <span class="ticket-value">${flight.flightNumber}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Route:</span>
                        <span class="ticket-value">${flight.departure} → ${flight.destination}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Departure:</span>
                        <span class="ticket-value">${flight.departureTime}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Arrival:</span>
                        <span class="ticket-value">${flight.arrivalTime}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Duration:</span>
                        <span class="ticket-value">${flight.duration}</span>
                    </div>
                </div>
                
                <div class="ticket-section">
                    <h3 style="margin-top: 0; color: #374151;">Booking Details</h3>
                    <div class="ticket-row">
                        <span class="ticket-label">Seat:</span>
                        <span class="ticket-value">${booking.seatNumber} (${booking.seatClass})</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Total Price:</span>
                        <span class="ticket-value">$${booking.totalPrice}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Status:</span>
                        <span class="ticket-value">${booking.status}</span>
                    </div>
                    ${booking.specialRequests?.length ? `
                    <div class="ticket-row">
                        <span class="ticket-label">Special Requests:</span>
                        <span class="ticket-value">${booking.specialRequests.join(', ')}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #374151; margin: 0;">Please arrive at the airport at least 2 hours before departure.</p>
                    <p style="color: #6b7280; margin: 5px 0 0; font-size: 14px;">Have a safe and pleasant flight!</p>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated email. Please do not reply to this email.</p>
                <p>&copy; 2024 Ethiopian Airlines. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateTextContent(ticketData: EmailTicketData): string {
    const { booking, flight, passenger } = ticketData;
    
    return `
Ethiopian Airlines - Flight Ticket

BOOKING CONFIRMED!
Booking Reference: ${booking.bookingReference}

PASSENGER INFORMATION
Name: ${passenger.firstName} ${passenger.lastName}
Email: ${passenger.email}
Phone: ${passenger.phone}

FLIGHT DETAILS
Flight: ${flight.flightNumber}
Route: ${flight.departure} → ${flight.destination}
Departure: ${flight.departureTime}
Arrival: ${flight.arrivalTime}
Duration: ${flight.duration}

BOOKING DETAILS
Seat: ${booking.seatNumber} (${booking.seatClass})
Total Price: $${booking.totalPrice}
Status: ${booking.status}
${booking.specialRequests?.length ? `Special Requests: ${booking.specialRequests.join(', ')}` : ''}

Please arrive at the airport at least 2 hours before departure.
Have a safe and pleasant flight!

This is an automated email. Please do not reply to this email.
© 2024 Ethiopian Airlines. All rights reserved.
    `.trim();
  }
}

export const emailService = new EmailService();