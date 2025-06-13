import {
  users,
  properties,
  bookings,
  reviews,
  chatMessages,
  payments,
  smsNotifications,
  notifications,
  analytics,
  favorites,
  availability,
  type User,
  type UpsertUser,
  type Property,
  type InsertProperty,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview,
  type ChatMessage,
  type InsertChatMessage,
  type Payment,
  type InsertPayment,
  type SmsNotification,
  type InsertSmsNotification,
  type Notification,
  type InsertNotification,
  type Analytics,
  type InsertAnalytics,
  type Favorite,
  type InsertFavorite,
  type Availability,
  type InsertAvailability,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, count, sum, ilike } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deactivateUser(id: string): Promise<User>;
  activateUser(id: string): Promise<User>;
  
  // Property operations
  getProperties(filters?: { featured?: boolean; limit?: number }): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByHost(hostId: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property>;
  searchProperties(filters: {
    location?: string;
    checkIn?: Date;
    checkOut?: Date;
    guests?: number;
  }): Promise<Property[]>;
  
  // Booking operations
  getBookingsByUser(userId: string): Promise<Booking[]>;
  getBookingsByHost(hostId: string): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
  
  // Review operations
  getReviewsByProperty(propertyId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Chat operations
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: string): Promise<Payment>;
  getPaymentsByBooking(bookingId: number): Promise<Payment[]>;
  
  // SMS operations
  createSmsNotification(sms: InsertSmsNotification): Promise<SmsNotification>;
  updateSmsStatus(id: number, status: string, externalId?: string): Promise<SmsNotification>;
  getPendingSmsNotifications(): Promise<SmsNotification[]>;
  
  // Admin operations
  getAdminStats(): Promise<{
    totalUsers: number;
    totalProperties: number;
    totalBookings: number;
    totalRevenue: number;
  }>;

  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string, unreadOnly?: boolean): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification>;
  markAllNotificationsAsRead(userId: string): Promise<void>;

  // Analytics operations
  trackEvent(event: InsertAnalytics): Promise<Analytics>;
  getAnalytics(filters: {
    userId?: string;
    eventType?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Analytics[]>;

  // Favorites operations
  addToFavorites(userId: string, propertyId: number): Promise<Favorite>;
  removeFromFavorites(userId: string, propertyId: number): Promise<void>;
  getUserFavorites(userId: string): Promise<Property[]>;
  
  // Availability operations
  setPropertyAvailability(propertyId: number, availability: InsertAvailability[]): Promise<void>;
  getPropertyAvailability(propertyId: number, startDate: Date, endDate: Date): Promise<Availability[]>;
  checkAvailability(propertyId: number, checkIn: Date, checkOut: Date): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.emailVerificationToken, token));
    return user;
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deactivateUser(id: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async activateUser(id: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Property operations
  async getProperties(filters?: { featured?: boolean; limit?: number }): Promise<Property[]> {
    let conditions = [eq(properties.isActive, true)];
    
    if (filters?.featured) {
      conditions.push(eq(properties.isFeatured, true));
    }
    
    let baseQuery = db.select().from(properties)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .orderBy(desc(properties.createdAt));
    
    if (filters?.limit) {
      return baseQuery.limit(filters.limit);
    }
    
    return baseQuery;
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async getPropertiesByHost(hostId: string): Promise<Property[]> {
    return db.select().from(properties)
      .where(eq(properties.hostId, hostId))
      .orderBy(desc(properties.createdAt));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values(property)
      .returning();
    return newProperty;
  }

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async searchProperties(filters: {
    location?: string;
    checkIn?: Date;
    checkOut?: Date;
    guests?: number;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    amenities?: string[];
  }): Promise<Property[]> {
    let conditions = [eq(properties.isActive, true)];
    
    if (filters.location) {
      conditions.push(ilike(properties.location, `%${filters.location}%`));
    }
    
    if (filters.guests) {
      conditions.push(gte(properties.maxGuests, filters.guests));
    }
    
    if (filters.minPrice) {
      conditions.push(gte(properties.pricePerNight, filters.minPrice.toString()));
    }
    
    if (filters.maxPrice) {
      conditions.push(lte(properties.pricePerNight, filters.maxPrice.toString()));
    }
    
    return db.select().from(properties)
      .where(and(...conditions))
      .orderBy(desc(properties.createdAt));
  }

  // Booking operations
  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return db.select().from(bookings)
      .where(eq(bookings.guestId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBookingsByHost(hostId: string): Promise<Booking[]> {
    const results = await db.select({
      id: bookings.id,
      propertyId: bookings.propertyId,
      guestId: bookings.guestId,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      guests: bookings.guests,
      totalAmount: bookings.totalAmount,
      status: bookings.status,
      paymentStatus: bookings.paymentStatus,
      guestInfo: bookings.guestInfo,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt,
    })
      .from(bookings)
      .innerJoin(properties, eq(bookings.propertyId, properties.id))
      .where(eq(properties.hostId, hostId))
      .orderBy(desc(bookings.createdAt));
    
    return results;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Review operations
  async getReviewsByProperty(propertyId: number): Promise<Review[]> {
    return db.select().from(reviews)
      .where(eq(reviews.propertyId, propertyId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  // Chat operations
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return db.select().from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return newPayment;
  }

  async updatePaymentStatus(id: number, status: string): Promise<Payment> {
    const [updatedPayment] = await db
      .update(payments)
      .set({ status, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  async getPaymentsByBooking(bookingId: number): Promise<Payment[]> {
    return db.select().from(payments)
      .where(eq(payments.bookingId, bookingId))
      .orderBy(desc(payments.createdAt));
  }

  // SMS operations
  async createSmsNotification(sms: InsertSmsNotification): Promise<SmsNotification> {
    const [newSms] = await db
      .insert(smsNotifications)
      .values(sms)
      .returning();
    return newSms;
  }

  async updateSmsStatus(id: number, status: string, externalId?: string): Promise<SmsNotification> {
    const updates: any = { status };
    if (status === 'sent') {
      updates.sentAt = new Date();
    }
    if (externalId) {
      updates.externalId = externalId;
    }

    const [updatedSms] = await db
      .update(smsNotifications)
      .set(updates)
      .where(eq(smsNotifications.id, id))
      .returning();
    return updatedSms;
  }

  async getPendingSmsNotifications(): Promise<SmsNotification[]> {
    return db.select().from(smsNotifications)
      .where(eq(smsNotifications.status, 'pending'))
      .orderBy(smsNotifications.createdAt);
  }

  // Admin operations
  async getAdminStats(): Promise<{
    totalUsers: number;
    totalProperties: number;
    totalBookings: number;
    totalRevenue: number;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [propertyCount] = await db.select({ count: count() }).from(properties);
    const [bookingCount] = await db.select({ count: count() }).from(bookings);
    const [revenueSum] = await db.select({ sum: sum(bookings.totalAmount) }).from(bookings);

    return {
      totalUsers: userCount.count,
      totalProperties: propertyCount.count,
      totalBookings: bookingCount.count,
      totalRevenue: parseFloat(revenueSum.sum || '0'),
    };
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async getUserNotifications(userId: string, unreadOnly = false): Promise<Notification[]> {
    if (unreadOnly) {
      return db.select().from(notifications)
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
        .orderBy(desc(notifications.createdAt));
    }
    
    return db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
  }

  // Analytics operations
  async trackEvent(event: InsertAnalytics): Promise<Analytics> {
    const [newEvent] = await db
      .insert(analytics)
      .values(event)
      .returning();
    return newEvent;
  }

  async getAnalytics(filters: {
    userId?: string;
    eventType?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Analytics[]> {
    let conditions = [];
    
    if (filters.userId) {
      conditions.push(eq(analytics.userId, filters.userId));
    }
    if (filters.eventType) {
      conditions.push(eq(analytics.eventType, filters.eventType));
    }
    if (filters.startDate) {
      conditions.push(gte(analytics.createdAt, filters.startDate));
    }
    if (filters.endDate) {
      conditions.push(lte(analytics.createdAt, filters.endDate));
    }

    return db.select().from(analytics)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(analytics.createdAt));
  }

  // Favorites operations
  async addToFavorites(userId: string, propertyId: number): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values({ userId, propertyId })
      .returning();
    return favorite;
  }

  async removeFromFavorites(userId: string, propertyId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.propertyId, propertyId)
      ));
  }

  async getUserFavorites(userId: string): Promise<Property[]> {
    return db
      .select({
        id: properties.id,
        hostId: properties.hostId,
        title: properties.title,
        description: properties.description,
        location: properties.location,
        pricePerNight: properties.pricePerNight,
        maxGuests: properties.maxGuests,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        amenities: properties.amenities,
        images: properties.images,
        rating: properties.rating,
        reviewCount: properties.reviewCount,
        isActive: properties.isActive,
        isFeatured: properties.isFeatured,
        createdAt: properties.createdAt,
        updatedAt: properties.updatedAt,
      })
      .from(favorites)
      .innerJoin(properties, eq(favorites.propertyId, properties.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));
  }

  // Availability operations
  async setPropertyAvailability(propertyId: number, availabilityData: InsertAvailability[]): Promise<void> {
    await db.insert(availability).values(availabilityData);
  }

  async getPropertyAvailability(propertyId: number, startDate: Date, endDate: Date): Promise<Availability[]> {
    return db.select().from(availability)
      .where(and(
        eq(availability.propertyId, propertyId),
        gte(availability.date, startDate),
        lte(availability.date, endDate)
      ))
      .orderBy(availability.date);
  }

  async checkAvailability(propertyId: number, checkIn: Date, checkOut: Date): Promise<boolean> {
    const availabilityResults = await this.getPropertyAvailability(propertyId, checkIn, checkOut);
    return availabilityResults.every(a => a.isAvailable);
  }
}

export const storage = new DatabaseStorage();