import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Performance monitoring middleware
export function performanceMonitoring(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  
  res.on('finish', async () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    
    // Log slow requests (> 1 second)
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} - ${duration.toFixed(2)}ms`);
    }
    
    // Track API analytics for authenticated users
    if ((req as any).user?.claims?.sub && duration < 30000) { // Skip if request took too long
      try {
        await storage.trackEvent({
          userId: (req as any).user.claims.sub,
          eventType: 'api_request',
          eventData: {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: Math.round(duration),
            userAgent: req.headers['user-agent'],
            ip: req.ip
          }
        });
      } catch (error) {
        // Silently fail analytics tracking
      }
    }
  });
  
  next();
}

// Health check endpoint
export function healthCheck(req: Request, res: Response) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  };
  
  res.status(200).json(health);
}

// Database health check
export async function databaseHealthCheck(req: Request, res: Response) {
  try {
    // Simple database connectivity test
    const testUser = await storage.getUser('health-check-test');
    
    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
}

// Error tracking middleware
export function errorTracking(error: any, req: Request, res: Response, next: NextFunction) {
  const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  // Log error with context
  console.error(`Error ${errorId}:`, {
    message: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path,
    body: req.body,
    user: (req as any).user?.claims?.sub,
    timestamp: new Date().toISOString()
  });
  
  // Track error in analytics if user is authenticated
  if ((req as any).user?.claims?.sub) {
    try {
      storage.trackEvent({
        userId: (req as any).user.claims.sub,
        eventType: 'api_error',
        eventData: {
          errorId,
          message: error.message,
          method: req.method,
          path: req.path,
          statusCode: error.status || 500
        }
      }).catch(() => {}); // Silently fail
    } catch (trackingError) {
      // Ignore tracking errors
    }
  }
  
  const status = error.status || error.statusCode || 500;
  const message = status === 500 ? 'Internal Server Error' : error.message;
  
  res.status(status).json({
    message,
    errorId,
    timestamp: new Date().toISOString()
  });
}

// Request logging middleware
export function requestLogging(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const originalSend = res.send;
  
  res.send = function(body) {
    const duration = Date.now() - start;
    const contentLength = Buffer.byteLength(body || '');
    
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms ${contentLength}b`);
    
    return originalSend.call(this, body);
  };
  
  next();
}