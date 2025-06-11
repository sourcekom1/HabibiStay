import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertPropertySchema, 
  insertBookingSchema, 
  insertReviewSchema,
  insertChatMessageSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Properties routes
  app.get('/api/properties', async (req, res) => {
    try {
      const { featured, limit } = req.query;
      const properties = await storage.getProperties({
        featured: featured === 'true',
        limit: limit ? parseInt(limit as string) : undefined
      });
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get('/api/properties/:id', async (req, res) => {
    try {
      const property = await storage.getProperty(parseInt(req.params.id));
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const propertyData = insertPropertySchema.parse({
        ...req.body,
        hostId: userId
      });
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.put('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const propertyId = parseInt(req.params.id);
      
      // Check if user owns this property
      const property = await storage.getProperty(propertyId);
      if (!property || property.hostId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updatedProperty = await storage.updateProperty(propertyId, req.body);
      res.json(updatedProperty);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  // Host properties
  app.get('/api/host/properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const properties = await storage.getPropertiesByHost(userId);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching host properties:", error);
      res.status(500).json({ message: "Failed to fetch host properties" });
    }
  });

  // Bookings routes
  app.get('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookings = await storage.getBookingsByUser(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        guestId: userId
      });
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Host bookings
  app.get('/api/host/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookings = await storage.getBookingsByHost(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching host bookings:", error);
      res.status(500).json({ message: "Failed to fetch host bookings" });
    }
  });

  // Reviews routes
  app.get('/api/properties/:id/reviews', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByProperty(propertyId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        guestId: userId
      });
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Chat routes
  app.get('/api/chat/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(messageData);
      
      // Simple AI response logic for Sara
      if (!messageData.isFromBot) {
        const botResponse = await generateBotResponse(messageData.message);
        const botMessage = await storage.createChatMessage({
          sessionId: messageData.sessionId,
          userId: messageData.userId,
          message: botResponse.message,
          isFromBot: true,
          messageType: botResponse.type,
          metadata: botResponse.metadata
        });
        res.json({ userMessage: message, botMessage });
      } else {
        res.json({ userMessage: message });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      console.error("Error creating chat message:", error);
      res.status(500).json({ message: "Failed to create chat message" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Search properties
  app.get('/api/search', async (req, res) => {
    try {
      const { location, checkIn, checkOut, guests } = req.query;
      const properties = await storage.searchProperties({
        location: location as string,
        checkIn: checkIn ? new Date(checkIn as string) : undefined,
        checkOut: checkOut ? new Date(checkOut as string) : undefined,
        guests: guests ? parseInt(guests as string) : undefined
      });
      res.json(properties);
    } catch (error) {
      console.error("Error searching properties:", error);
      res.status(500).json({ message: "Failed to search properties" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simple AI response generator for Sara chatbot
async function generateBotResponse(userMessage: string): Promise<{
  message: string;
  type: string;
  metadata?: any;
}> {
  const message = userMessage.toLowerCase();
  
  if (message.includes('beach') || message.includes('ocean') || message.includes('sea')) {
    return {
      message: "I found some beautiful beachfront properties! Our Ocean View Villa in the Maldives is very popular. Would you like to see more details or check availability?",
      type: "property_suggestion",
      metadata: { suggestedPropertyType: "beachfront" }
    };
  }
  
  if (message.includes('mountain') || message.includes('cabin') || message.includes('ski')) {
    return {
      message: "Perfect! I have some amazing mountain retreats. Our Mountain Cabin in Aspen has stunning alpine views. Would you like to see the details or explore similar properties?",
      type: "property_suggestion",
      metadata: { suggestedPropertyType: "mountain" }
    };
  }
  
  if (message.includes('book') || message.includes('reserve') || message.includes('available')) {
    return {
      message: "I'd be happy to help you with booking! To check availability and make a reservation, I'll need to know your preferred dates and number of guests. Which property interests you?",
      type: "booking_action",
      metadata: { action: "booking_inquiry" }
    };
  }
  
  if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
    return {
      message: "Our properties range from $150 to $450 per night. I can help you find options within your budget. What's your preferred price range?",
      type: "text",
      metadata: { topic: "pricing" }
    };
  }
  
  return {
    message: "Hi! I'm Sara, your travel assistant. I can help you find the perfect accommodation, check availability, make bookings, and answer any questions about our properties. What are you looking for today?",
    type: "text",
    metadata: { topic: "general" }
  };
}
