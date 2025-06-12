import { db } from "../db";
import { logger } from "./logger";

// Database connection health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await db.execute("SELECT 1");
    return true;
  } catch (error) {
    logger.error("Database health check failed", error as Error);
    return false;
  }
}

// Query performance monitoring
export async function executeQuery<T>(
  query: string,
  params: any[] = [],
  operation: string = "query"
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await db.execute(query, params);
    const duration = Date.now() - startTime;
    
    logger.performance(`Database ${operation}`, duration, {
      query: query.substring(0, 100),
      paramCount: params.length,
    });
    
    return result as T;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.database(operation, undefined, duration, error as Error);
    throw error;
  }
}

// Transaction wrapper with retry logic
export async function withTransaction<T>(
  operation: (tx: any) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await db.transaction(operation);
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable (deadlock, connection issues)
      const isRetryable = error && (
        (error as any).code === 'DEADLOCK_DETECTED' ||
        (error as any).code === 'CONNECTION_LOST' ||
        (error as any).code === 'LOCK_WAIT_TIMEOUT'
      );
      
      if (!isRetryable || attempt === maxRetries) {
        logger.error(`Transaction failed (attempt ${attempt}/${maxRetries})`, error as Error);
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      logger.warn(`Transaction retry ${attempt}/${maxRetries} after ${delay}ms delay`);
    }
  }
  
  throw lastError!;
}

// Database migration utilities
export class MigrationRunner {
  static async checkPendingMigrations(): Promise<string[]> {
    // This would check for pending Drizzle migrations
    // Implementation depends on your migration strategy
    return [];
  }
  
  static async runMigrations(): Promise<void> {
    const pending = await this.checkPendingMigrations();
    
    if (pending.length > 0) {
      logger.info(`Running ${pending.length} pending migrations`);
      
      for (const migration of pending) {
        try {
          // Run migration
          logger.info(`Running migration: ${migration}`);
          // Implementation would go here
        } catch (error) {
          logger.error(`Migration failed: ${migration}`, error as Error);
          throw error;
        }
      }
      
      logger.info("All migrations completed successfully");
    }
  }
}

// Connection pool monitoring
export function monitorConnectionPool() {
  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      // Monitor connection pool health
      // Implementation depends on your connection pool setup
      logger.debug("Connection pool status", {
        // Add connection pool metrics here
      });
    }, 30000);
  }
}