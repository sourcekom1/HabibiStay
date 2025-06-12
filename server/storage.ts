import {
  users,
  properties,
  bookings,
  reviews,
  chatMessages,
  payments,
  smsNotifications,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, count, sum, ilike } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
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
  createBooking(booking: InsertBooking): Promise<Booking>;
  
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
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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
  }): Promise<Property[]> {
    let conditions = [eq(properties.isActive, true)];
    
    if (filters.location) {
      conditions.push(eq(properties.location, filters.location));
    }
    
    if (filters.guests) {
      conditions.push(gte(properties.maxGuests, filters.guests));
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

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
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
}

export const storage = new DatabaseStorage();