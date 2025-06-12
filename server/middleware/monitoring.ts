import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  timestamp: number;
  userId?: string;
  memoryUsage: NodeJS.MemoryUsage;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000;

  addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
    
    // Log slow requests
    if (metric.duration > 1000) {
      logger.warn(`Slow request detected: ${metric.method} ${metric.endpoint}`, {
        duration: metric.duration,
        statusCode: metric.statusCode,
        memoryUsage: metric.memoryUsage
      });
    }
  }

  getMetrics(endpoint?: string): PerformanceMetrics[] {
    if (endpoint) {
      return this.metrics.filter(m => m.endpoint === endpoint);
    }
    return [...this.metrics];
  }

  getAverageResponseTime(endpoint?: string): number {
    const relevantMetrics = endpoint 
      ? this.metrics.filter(m => m.endpoint === endpoint)
      : this.metrics;
    
    if (relevantMetrics.length === 0) return 0;
    
    const total = relevantMetrics.reduce((sum, m) => sum + m.duration, 0);
    return Math.round(total / relevantMetrics.length);
  }

  getErrorRate(endpoint?: string): number {
    const relevantMetrics = endpoint 
      ? this.metrics.filter(m => m.endpoint === endpoint)
      : this.metrics;
    
    if (relevantMetrics.length === 0) return 0;
    
    const errors = relevantMetrics.filter(m => m.statusCode >= 400).length;
    return Math.round((errors / relevantMetrics.length) * 100);
  }

  getSummary() {
    const now = Date.now();
    const last24Hours = this.metrics.filter(m => now - m.timestamp < 24 * 60 * 60 * 1000);
    
    return {
      totalRequests: last24Hours.length,
      averageResponseTime: this.getAverageResponseTime(),
      errorRate: this.getErrorRate(),
      slowRequests: last24Hours.filter(m => m.duration > 1000).length,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Request ID middleware
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = req.headers['x-request-id'] as string || 
    `req_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  
  next();
}

// Performance monitoring middleware
export function performanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();
  
  // Track response completion
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const endMemory = process.memoryUsage();
    
    // Calculate memory delta
    const memoryDelta = {
      rss: endMemory.rss - startMemory.rss,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      external: endMemory.external - startMemory.external,
      arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers,
    };
    
    const metric: PerformanceMetrics = {
      endpoint: req.route?.path || req.path,
      method: req.method,
      duration,
      statusCode: res.statusCode,
      timestamp: Date.now(),
      userId: (req as any).user?.id,
      memoryUsage: memoryDelta,
    };
    
    performanceMonitor.addMetric(metric);
  });
  
  next();
}

// Health check middleware
export function healthCheckMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/health') {
    const summary = performanceMonitor.getSummary();
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: summary.uptime,
      memory: summary.memoryUsage,
      performance: {
        averageResponseTime: summary.averageResponseTime,
        errorRate: summary.errorRate,
        slowRequests: summary.slowRequests,
      },
      environment: process.env.NODE_ENV || 'development',
    };
    
    return res.json(health);
  }
  
  next();
}