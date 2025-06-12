import { z } from "zod";

// Enhanced validation schemas for better data integrity
export const propertyFiltersSchema = z.object({
  location: z.string().optional(),
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  guests: z.coerce.number().int().min(1).max(20).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  propertyType: z.enum(['apartment', 'house', 'villa', 'studio', 'resort']).optional(),
  amenities: z.array(z.string()).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const dateRangeSchema = z.object({
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
}).refine(data => data.checkOut > data.checkIn, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"]
});

export const phoneNumberSchema = z.string()
  .regex(/^\+966[0-9]{9}$/, "Phone number must be in Saudi Arabia format (+966XXXXXXXXX)");

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
  propertyId: z.number().int().positive(),
  bookingId: z.number().int().positive(),
});

export const propertyValidationSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(2000),
  location: z.string().min(2).max(100),
  pricePerNight: z.coerce.number().positive().max(10000),
  maxGuests: z.coerce.number().int().min(1).max(20),
  bedrooms: z.coerce.number().int().min(0).max(10),
  bathrooms: z.coerce.number().int().min(1).max(10),
  amenities: z.array(z.string()).min(1),
  images: z.array(z.string().url()).min(1).max(10),
});

export const bookingValidationSchema = z.object({
  propertyId: z.number().int().positive(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.number().int().min(1).max(20),
  guestInfo: z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    phone: phoneNumberSchema,
  }),
  specialRequests: z.string().max(500).optional(),
}).refine(data => data.checkOut > data.checkIn, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"]
});