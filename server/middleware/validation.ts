import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchSchema = z.object({
  location: z.string().min(1).max(100).optional(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  guests: z.coerce.number().min(1).max(20).default(1),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  propertyType: z.string().max(50).optional(),
  amenities: z.string().optional(),
});

export const bookingSchema = z.object({
  propertyId: z.number().positive(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().min(1).max(20),
  totalAmount: z.number().positive(),
  paymentMethod: z.enum(['paypal', 'stripe']),
});

export const reviewSchema = z.object({
  propertyId: z.number().positive(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

export const propertySchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(2000),
  location: z.string().min(2).max(100),
  pricePerNight: z.string().regex(/^\d+(\.\d{1,2})?$/),
  maxGuests: z.number().min(1).max(20),
  bedrooms: z.number().min(0).max(20),
  bathrooms: z.number().min(0).max(20),
  amenities: z.array(z.string().max(50)).max(20),
  images: z.array(z.string().url()).min(1).max(10),
});

// Validation middleware factory
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Query validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
}

export function validateParams<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Parameter validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
}