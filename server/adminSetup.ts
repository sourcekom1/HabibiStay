import { storage } from './storage';

// Admin user setup utility for development and testing
export async function setupAdminUser(email: string): Promise<void> {
  try {
    const existingUser = await storage.getUserByEmail(email);
    
    if (existingUser) {
      // Update existing user to admin
      await storage.updateUser(existingUser.id, { 
        userType: 'admin',
        isActive: true,
        emailVerified: true
      });
      console.log(`✅ User ${email} promoted to admin`);
    } else {
      // Create new admin user
      await storage.createUser({
        email,
        firstName: 'Admin',
        lastName: 'User',
        userType: 'admin',
        isActive: true,
        emailVerified: true
      });
      console.log(`✅ Admin user created: ${email}`);
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
}

// Setup admin users for the current authenticated users
export async function initializeAdminAccess(): Promise<void> {
  const adminEmails = [
    'sourcekom2023@gmail.com', // Current logged-in user
    'admin@habibistay.com'      // Default admin
  ];

  for (const email of adminEmails) {
    await setupAdminUser(email);
  }
}