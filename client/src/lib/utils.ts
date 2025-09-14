import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBookingReference(): string {
  return 'ET' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `$${numPrice.toFixed(2)}`;
}

export function formatTime(time: string): string {
  // Assumes time is in HH:MM format and converts to 12-hour format
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function getDestinationCity(destination: string): string {
  return destination.split(' ')[0];
}

export function getAirportCode(destination: string): string {
  const match = destination.match(/\(([^)]+)\)/);
  return match ? match[1] : '';
}
