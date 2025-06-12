import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { setupSecurity } from "./middleware/security";
import { requestIdMiddleware, performanceMiddleware, healthCheckMiddleware } from "./middleware/monitoring";
import { globalErrorHandler, notFoundHandler } from "./utils/errorHandler";
import { logger } from "./utils/logger";
import { checkDatabaseHealth, monitorConnectionPool } from "./utils/database";

const app = express();

// Security middleware (must be first)
setupSecurity(app);

// Request processing middleware
app.use(requestIdMiddleware);
app.use(performanceMiddleware);
app.use(healthCheckMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Database health check
    const isDbHealthy = await checkDatabaseHealth();
    if (!isDbHealthy) {
      logger.error("Database health check failed");
      process.exit(1);
    }
    
    // Initialize monitoring
    monitorConnectionPool();
    
    // Seed the database with initial data
    await seedDatabase();
    
    const server = await registerRoutes(app);

    // Setup Vite in development or serve static files in production
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      logger.info(`Habibistay server started on port ${port}`, {
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server', error as Error);
    process.exit(1);
  }
})();