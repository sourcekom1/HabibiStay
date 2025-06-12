import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { db } from '../server/db';
import { seedDatabase } from '../server/seed';

// Test database setup
beforeAll(async () => {
  // Ensure test database is connected
  await db.execute('SELECT 1');
});

afterAll(async () => {
  // Clean up database connections
  process.exit(0);
});

beforeEach(async () => {
  // Clear database tables before each test
  await clearTestData();
});

afterEach(async () => {
  // Clean up after each test
  await clearTestData();
});

async function clearTestData() {
  try {
    // Delete test data in correct order to avoid foreign key constraints
    await db.execute('DELETE FROM analytics WHERE id > 0');
    await db.execute('DELETE FROM notifications WHERE id > 0');
    await db.execute('DELETE FROM favorites WHERE id > 0');
    await db.execute('DELETE FROM sms_notifications WHERE id > 0');
    await db.execute('DELETE FROM payments WHERE id > 0');
    await db.execute('DELETE FROM chat_messages WHERE id > 0');
    await db.execute('DELETE FROM reviews WHERE id > 0');
    await db.execute('DELETE FROM bookings WHERE id > 0');
    await db.execute('DELETE FROM availability WHERE id > 0');
    await db.execute('DELETE FROM properties WHERE id > 0');
    await db.execute('DELETE FROM users WHERE id != \'system\'');
  } catch (error) {
    console.error('Failed to clear test data:', error);
  }
}

// Test utilities
export const testUtils = {
  createTestUser: async (userData: any = {}) => {
    const defaultUser = {
      id: `test_${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      name: 'Test User',
      userType: 'guest',
      ...userData,
    };
    
    await db.execute(
      'INSERT INTO users (id, email, name, user_type) VALUES ($1, $2, $3, $4)',
      [defaultUser.id, defaultUser.email, defaultUser.name, defaultUser.userType]
    );
    
    return defaultUser;
  },

  createTestProperty: async (propertyData: any = {}) => {
    const defaultProperty = {
      hostId: 'test_host_1',
      title: 'Test Property',
      description: 'A test property for unit testing',
      location: 'Test City',
      pricePerNight: '100.00',
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'Parking'],
      images: ['https://example.com/image1.jpg'],
      ...propertyData,
    };

    const result = await db.execute(
      `INSERT INTO properties (host_id, title, description, location, price_per_night, 
       max_guests, bedrooms, bathrooms, amenities, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        defaultProperty.hostId,
        defaultProperty.title,
        defaultProperty.description,
        defaultProperty.location,
        defaultProperty.pricePerNight,
        defaultProperty.maxGuests,
        defaultProperty.bedrooms,
        defaultProperty.bathrooms,
        JSON.stringify(defaultProperty.amenities),
        JSON.stringify(defaultProperty.images),
      ]
    );

    return { ...defaultProperty, id: result[0].id };
  },

  createTestBooking: async (bookingData: any = {}) => {
    const defaultBooking = {
      userId: 'test_user_1',
      propertyId: 1,
      checkIn: new Date('2024-12-01'),
      checkOut: new Date('2024-12-05'),
      guests: 2,
      totalAmount: '400.00',
      status: 'confirmed',
      ...bookingData,
    };

    const result = await db.execute(
      `INSERT INTO bookings (user_id, property_id, check_in, check_out, guests, total_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        defaultBooking.userId,
        defaultBooking.propertyId,
        defaultBooking.checkIn,
        defaultBooking.checkOut,
        defaultBooking.guests,
        defaultBooking.totalAmount,
        defaultBooking.status,
      ]
    );

    return { ...defaultBooking, id: result[0].id };
  },

  generateTestData: async () => {
    // Create test users
    const host = await testUtils.createTestUser({
      id: 'test_host_1',
      userType: 'host',
      name: 'Test Host',
    });

    const guest = await testUtils.createTestUser({
      id: 'test_guest_1',
      userType: 'guest',
      name: 'Test Guest',
    });

    // Create test property
    const property = await testUtils.createTestProperty({
      hostId: host.id,
    });

    return { host, guest, property };
  },
};