// Enhanced type definitions for better type safety
export interface PropertyFilters {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  amenities?: string[];
  rating?: number;
}

export interface BookingStatus {
  PENDING: 'pending';
  CONFIRMED: 'confirmed';
  CANCELLED: 'cancelled';
  COMPLETED: 'completed';
  IN_PROGRESS: 'in_progress';
}

export interface PaymentStatus {
  PENDING: 'pending';
  PAID: 'paid';
  FAILED: 'failed';
  REFUNDED: 'refunded';
  PROCESSING: 'processing';
}

export interface UserRole {
  GUEST: 'guest';
  HOST: 'host';
  ADMIN: 'admin';
  SUPER_ADMIN: 'super_admin';
}

export interface NotificationEvent {
  BOOKING_CREATED: 'booking_created';
  BOOKING_CONFIRMED: 'booking_confirmed';
  BOOKING_CANCELLED: 'booking_cancelled';
  PAYMENT_RECEIVED: 'payment_received';
  REVIEW_SUBMITTED: 'review_submitted';
  PROPERTY_APPROVED: 'property_approved';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchAnalytics {
  query: string;
  resultsCount: number;
  timestamp: Date;
  userId?: string;
  filters: PropertyFilters;
}