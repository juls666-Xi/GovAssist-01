import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string | null): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

export function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `APP-${year}-${random.toString().padStart(4, "0")}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    REVIEWING: "bg-blue-100 text-blue-800 border-blue-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
    CLAIMED: "bg-purple-100 text-purple-800 border-purple-200",
    SCHEDULED: "bg-indigo-100 text-indigo-800 border-indigo-200",
    DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
    DOCUMENTS_REQUIRED: "bg-orange-100 text-orange-800 border-orange-200",
    ACTIVE: "bg-green-100 text-green-800 border-green-200",
    INACTIVE: "bg-gray-100 text-gray-800 border-gray-200",
    VERIFIED: "bg-green-100 text-green-800 border-green-200",
    SUSPENDED: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
