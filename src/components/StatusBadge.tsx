import { BookingStatus, PropertyStatus } from "@/types";

const bookingColors: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  ACCEPTED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-gray-100 text-gray-600 border-gray-200",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
};

const propertyColors: Record<PropertyStatus, string> = {
  AVAILABLE: "bg-green-50 text-green-700 border-green-200",
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  RENTED: "bg-gray-100 text-gray-600 border-gray-200",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bookingColors[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${propertyColors[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
