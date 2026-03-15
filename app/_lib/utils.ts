import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes and handles conditional logic safely.
 * Example: cn("px-2 py-1", isError && "bg-red-500", customClassName)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractErrorMessage = (error: any) => {
  const getString = (data: unknown) => {
    return typeof data === "string" ? data : JSON.stringify(data);
  };

  if (error?.response?.data?.message) {
    return getString(error.response.data.message);
  }

  if (error?.response?.data?.error) {
    return getString(error.response.data.error);
  }

  if (error?.response?.error) {
    return getString(error.response.error);
  }

  return getString(error?.message || "An unknown error occurred");
};
