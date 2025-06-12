import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super('Too many requests', 429, 'RATE_LIMIT');
    this.name = 'RateLimitError';
  }
}

// Global error handler
export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let error = err;

  // Handle specific error types
  if (error.name === 'CastError') {
    error = new ValidationError('Invalid ID format');
  }

  if (error.name === 'ValidationError') {
    error = new ValidationError('Validation failed');
  }

  if (error.name === 'MongoError' && (error as any).code === 11000) {
    error = new ConflictError('Duplicate field value');
  }

  if (error.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired');
  }

  // Log error
  logger.error('Unhandled error', error, {
    requestId: req.headers['x-request-id'] as string,
    ip: req.ip,
    userId: (req as any).user?.id,
  });

  // Send error response
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
    });
  } else {
    // Unknown error
    res.status(500).json({
      error: {
        message: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Internal server error',
        code: 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
    });
  }
}

// Async error wrapper
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// 404 handler
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: {
      message: `Route ${req.originalUrl} not found`,
      code: 'ROUTE_NOT_FOUND',
    },
  });
}