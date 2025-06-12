import { Request } from "express";

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  requestId?: string;
  ip?: string;
}

class Logger {
  private logLevel: LogLevel;

  constructor() {
    this.logLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  }

  private formatLog(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    let logString = `[${entry.timestamp}] ${levelName}: ${entry.message}`;
    
    if (entry.userId) logString += ` | User: ${entry.userId}`;
    if (entry.requestId) logString += ` | Request: ${entry.requestId}`;
    if (entry.ip) logString += ` | IP: ${entry.ip}`;
    
    if (entry.data) {
      logString += ` | Data: ${JSON.stringify(entry.data)}`;
    }
    
    return logString;
  }

  private log(level: LogLevel, message: string, data?: any, context?: Partial<LogEntry>) {
    if (level > this.logLevel) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      ...context,
    };

    const logString = this.formatLog(entry);

    if (level === LogLevel.ERROR) {
      console.error(logString);
    } else if (level === LogLevel.WARN) {
      console.warn(logString);
    } else {
      console.log(logString);
    }

    // In production, you would send logs to external service
    if (process.env.NODE_ENV === 'production' && level <= LogLevel.WARN) {
      this.sendToExternalLogging(entry);
    }
  }

  private sendToExternalLogging(entry: LogEntry) {
    // Implement external logging service integration here
    // e.g., DataDog, CloudWatch, Sentry, etc.
  }

  error(message: string, error?: Error, context?: Partial<LogEntry>) {
    const data = error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : undefined;
    
    this.log(LogLevel.ERROR, message, data, context);
  }

  warn(message: string, data?: any, context?: Partial<LogEntry>) {
    this.log(LogLevel.WARN, message, data, context);
  }

  info(message: string, data?: any, context?: Partial<LogEntry>) {
    this.log(LogLevel.INFO, message, data, context);
  }

  debug(message: string, data?: any, context?: Partial<LogEntry>) {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  // Request-specific logging
  request(req: Request, message: string, data?: any) {
    const context = {
      requestId: req.headers['x-request-id'] as string,
      ip: req.ip || req.connection.remoteAddress,
      userId: (req as any).user?.id,
    };
    
    this.info(`${req.method} ${req.path} - ${message}`, data, context);
  }

  // Database operation logging
  database(operation: string, table?: string, duration?: number, error?: Error) {
    const message = `Database ${operation}${table ? ` on ${table}` : ''}${duration ? ` (${duration}ms)` : ''}`;
    
    if (error) {
      this.error(message, error);
    } else {
      this.debug(message);
    }
  }

  // Performance monitoring
  performance(operation: string, duration: number, metadata?: any) {
    const message = `Performance: ${operation} completed in ${duration}ms`;
    
    if (duration > 1000) {
      this.warn(message, metadata);
    } else {
      this.debug(message, metadata);
    }
  }
}

export const logger = new Logger();