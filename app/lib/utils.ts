import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatApiDateToYYYYMMDD(apiDate: string): string {
  const date = new Date(apiDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTimeToHHMM(timeString: string): string {
  // Convert HH:MM:SS to HH:MM format
  if (timeString && timeString.includes(':') && timeString.split(':').length === 3) {
    return timeString.substring(0, 5);
  }
  return timeString;
}

// Format DD-MM-YYYY to readable date
export function formatDDMMYYYYToReadable(dateString: string): string {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`).toLocaleDateString();
}

// Format ISO date string to readable date
export function formatISODateToReadable(isoString: string): string {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString();
}

// Format ISO datetime to time HH:MM
export function formatISODateTimeToTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// Calculate arrival time from departure time and duration
export function calculateArrivalTime(departureTime: string, durationMinutes: number): string {
  if (!departureTime) return '';
  const [hours, minutes] = departureTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const arrivalHours = Math.floor(totalMinutes / 60) % 24;
  const arrivalMinutes = totalMinutes % 60;
  return `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`;
}

// Format duration in minutes to readable format (e.g., "2h 30m")
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
}