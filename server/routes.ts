import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateChatResponse, analyzeUserIntent } from "./openai";
import { smsService, smsTemplates } from "./sms";
import { 
  insertPropertySchema,
  insertBookingSchema, 
  insertPaymentSchema, 
  insertChatMessageSchema, 
  insertSmsNotificationSchema,
  insertReviewSchema
} from "@shared/schema";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // PayPal payment routes
  app.get("/setup", loadPaypalDefault);
  app.post("/order", createPaypalOrder);
  app.post("/order/:orderID/capture", capturePaypalOrder);

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

  // Email/password authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create user with email/password
      const user = await storage.createUser({
        id: `user_${Date.now()}_${Math.random()}`,
        email,
        firstName,
        lastName,
        // In a real app, you'd hash the password
        // For now, we'll store it as metadata
        profileImageUrl: null
      });

      res.json({ message: "Account created successfully", user });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd verify the hashed password
      // For now, we'll simulate successful login
      res.json({ message: "Login successful", user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to log in" });
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
      const propertyId = parseInt(req.params.id);
      
      if (isNaN(propertyId) || propertyId <= 0) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const property = await storage.getProperty(propertyId);
      
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

      // Create booking
      const booking = await storage.createBooking(bookingData);

      // Create PayPal payment record
      const paymentData = {
        bookingId: booking.id,
        amount: booking.totalAmount,
        currency: "USD",
        paymentMethod: "paypal",
        status: "pending"
      };
      
      await storage.createPayment(paymentData);

      // Send confirmation SMS if phone number provided
      if (req.body.guestInfo?.phone) {
        const property = await storage.getProperty(booking.propertyId);
        const smsData = {
          userId,
          phoneNumber: req.body.guestInfo.phone,
          message: smsTemplates.bookingConfirmation(
            req.body.guestInfo.name || "Guest",
            property?.title || "Property",
            new Date(booking.checkIn).toLocaleDateString()
          ),
          bookingId: booking.id
        };
        await storage.createSmsNotification(smsData);
        
        // Send SMS immediately
        const smsResult = await smsService.sendSms(smsData.phoneNumber, smsData.message);
        if (smsResult.success) {
          await storage.updateSmsStatus(booking.id, "sent", smsResult.messageId);
        }
      }

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

  // Chat routes for Sara AI assistant
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
      
      // Generate AI response using OpenAI
      if (!messageData.isFromBot) {
        // Get recent properties for context
        const properties = await storage.getProperties({ featured: true, limit: 5 });
        
        // Get previous messages for context
        const previousMessages = await storage.getChatMessages(messageData.sessionId);
        const lastFewMessages = previousMessages.slice(-5).map(msg => ({
          role: msg.isFromBot ? "assistant" : "user",
          content: msg.message
        }));

        const botResponse = await generateChatResponse(messageData.message, {
          previousMessages: lastFewMessages,
          userType: messageData.userId ? "guest" : "anonymous",
          properties
        });

        const botMessage = await storage.createChatMessage({
          sessionId: messageData.sessionId,
          userId: messageData.userId,
          message: botResponse.message,
          isFromBot: true,
          messageType: botResponse.messageType,
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
      
      // Safely parse guests parameter
      let parsedGuests: number | undefined;
      if (guests && guests !== 'NaN' && guests !== '') {
        const guestNum = parseInt(guests as string);
        parsedGuests = !isNaN(guestNum) && guestNum > 0 ? guestNum : undefined;
      }
      
      const properties = await storage.searchProperties({
        location: location as string,
        checkIn: checkIn ? new Date(checkIn as string) : undefined,
        checkOut: checkOut ? new Date(checkOut as string) : undefined,
        guests: parsedGuests
      });
      res.json(properties);
    } catch (error) {
      console.error("Error searching properties:", error);
      res.status(500).json({ message: "Failed to search properties" });
    }
  });

  // Host routes
  app.get('/api/host/properties', isAuthenticated, async (req: any, res) => {
    try {
      const hostId = req.user.claims.sub;
      const properties = await storage.getPropertiesByHost(hostId);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching host properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get('/api/host/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const hostId = req.user.claims.sub;
      const bookings = await storage.getBookingsByHost(hostId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching host bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser || currentUser.userType !== 'admin') {
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
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser || currentUser.userType !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get('/api/admin/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser || currentUser.userType !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { startDate, endDate, eventType } = req.query;
      const analytics = await storage.getAnalytics({
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        eventType: eventType as string,
      });
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Enhanced API routes for new features
  
  // Host application routes
  app.post('/api/host/apply', async (req, res) => {
    try {
      const { propertyType, address, description, phone, experience } = req.body;
      
      // Create a notification for admin review
      await storage.createNotification({
        userId: 'admin',
        type: 'host_application',
        title: 'New Host Application',
        message: `New host application from ${phone} for ${propertyType} in ${address}`,
        metadata: JSON.stringify({ propertyType, address, description, phone, experience })
      });
      
      res.json({ 
        success: true, 
        message: "Application submitted successfully! We'll review it within 24 hours." 
      });
    } catch (error) {
      console.error("Error submitting host application:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });
  
  // Notifications routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { unread } = req.query;
      const notifications = await storage.getUserNotifications(userId, unread === 'true');
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(notificationId);
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to update notification" });
    }
  });

  app.patch('/api/notifications/read-all', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to update notifications" });
    }
  });

  // Favorites routes
  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { propertyId } = req.body;
      const favorite = await storage.addToFavorites(userId, propertyId);
      res.json(favorite);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });

  app.delete('/api/favorites/:propertyId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const propertyId = parseInt(req.params.propertyId);
      await storage.removeFromFavorites(userId, propertyId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  // Analytics tracking route
  app.post('/api/analytics/track', async (req, res) => {
    try {
      const { eventType, eventData, sessionId, userId } = req.body;
      const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      const analyticsEvent = {
        userId: userId || null,
        eventType,
        eventData,
        sessionId,
        ipAddress: clientIP as string,
        userAgent,
      };
      
      await storage.trackEvent(analyticsEvent);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking analytics event:", error);
      res.status(500).json({ message: "Failed to track event" });
    }
  });

  // Enhanced property search with analytics
  app.get('/api/search', async (req, res) => {
    try {
      const { location, checkIn, checkOut, guests, minPrice, maxPrice, propertyType, amenities } = req.query;
      
      // Safely parse guests parameter
      let parsedGuests: number | undefined;
      if (guests && guests !== 'NaN' && guests !== '') {
        const guestNum = parseInt(guests as string);
        parsedGuests = !isNaN(guestNum) && guestNum > 0 ? guestNum : undefined;
      }

      // Enhanced search with more filters
      const searchFilters = {
        location: location as string,
        checkIn: checkIn ? new Date(checkIn as string) : undefined,
        checkOut: checkOut ? new Date(checkOut as string) : undefined,
        guests: parsedGuests,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        propertyType: propertyType as string,
        amenities: amenities ? (amenities as string).split(',') : undefined,
      };

      const properties = await storage.searchProperties(searchFilters);

      // Track search analytics
      const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const sessionId = req.headers['x-session-id'] as string || `anonymous_${Date.now()}`;
      
      await storage.trackEvent({
        eventType: 'search',
        eventData: {
          query: searchFilters,
          resultsCount: properties.length,
        },
        sessionId,
        ipAddress: clientIP as string,
        userAgent: userAgent as string,
      });

      res.json(properties);
    } catch (error) {
      console.error("Error searching properties:", error);
      res.status(500).json({ message: "Failed to search properties" });
    }
  });

  // AI Settings routes for admin
  app.get('/api/admin/ai-settings', isAuthenticated, async (req, res) => {
    try {
      // Return default AI settings (in a real app, this would be stored in database)
      const defaultSettings = {
        id: 1,
        modelProvider: "openai",
        modelName: "gpt-4o",
        temperature: 0.7,
        maxTokens: 800,
        systemPrompt: "You are Sara, a helpful travel assistant for an Airbnb-like platform. Help users find properties, make bookings, and answer travel-related questions. Be friendly, concise, and professional.",
        enableVoiceRecognition: true,
        enableAutoResponses: true,
        responseDelay: 1000,
        isActive: true,
      };
      res.json(defaultSettings);
    } catch (error) {
      console.error("Error fetching AI settings:", error);
      res.status(500).json({ message: "Failed to fetch AI settings" });
    }
  });

  app.post('/api/admin/ai-settings', isAuthenticated, async (req, res) => {
    try {
      const settings = req.body;
      // In a real app, save settings to database
      console.log("AI settings updated:", settings);
      res.json({ message: "AI settings saved successfully", settings });
    } catch (error) {
      console.error("Error saving AI settings:", error);
      res.status(500).json({ message: "Failed to save AI settings" });
    }
  });

  app.post('/api/admin/test-ai', isAuthenticated, async (req, res) => {
    try {
      const { message } = req.body;
      
      // Test AI response using the OpenAI integration
      const properties = await storage.getProperties({ featured: true, limit: 3 });
      const aiResponse = await generateChatResponse(message, {
        previousMessages: [],
        userType: "guest",
        properties
      });

      res.json({ 
        response: aiResponse.message,
        messageType: aiResponse.messageType 
      });
    } catch (error) {
      console.error("Error testing AI:", error);
      res.status(500).json({ 
        response: "AI test failed. Please check your configuration and API keys.",
        messageType: "error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}