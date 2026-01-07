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