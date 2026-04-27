export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type PropertyStatus = "AVAILABLE" | "PENDING" | "RENTED";
export type PropertyType = "APARTMENT" | "HOUSE" | "TOWNHOUSE" | "STUDIO" | "ROOM";
export type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;
  role: Role;
  bio?: string | null;
  createdAt: Date;
}

export interface Property {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  address: string;
  suburb: string;
  city: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  images: string[];
  amenities: string[];
  status: PropertyStatus;
  type: PropertyType;
  createdAt: Date;
  landlord?: User;
  reviews?: Review[];
  _count?: { reviews: number; bookingRequests: number };
}

export interface BookingRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  status: BookingStatus;
  message?: string | null;
  moveInDate?: Date | null;
  createdAt: Date;
  tenant?: User;
  property?: Property;
}

export interface Review {
  id: string;
  tenantId: string;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  tenant?: User;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  propertyId?: string | null;
  content: string;
  read: boolean;
  createdAt: Date;
  sender?: User;
  receiver?: User;
}

export interface SearchFilters {
  city: string;
  bedrooms: number | null;
  maxPrice: number | null;
  type: PropertyType | null;
}
