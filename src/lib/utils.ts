import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: string): string {
  // Extract number from duration string (e.g., "180 min" -> 180)
  const match = duration.match(/(\d+)/);
  if (match) {
    const minutes = parseInt(match[1], 10);
    if (minutes > 120) {
      return "120+ min";
    }
  }
  return duration;
}
