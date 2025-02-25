import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (seconds < 60) {
    return `${secs < 10 ? "0" : ""}${secs}`;
  }
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};
