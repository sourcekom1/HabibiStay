import { db } from "./db";
import { properties, users } from "@shared/schema";
import { eq } from "drizzle-orm";

// Seed data for properties in Saudi Arabia
const seedProperties = [
  {
    hostId: "host_1",
    title: "Luxury Desert Villa in AlUla",
    description: "Experience the magic of AlUla in this stunning desert villa with panoramic views of the ancient rock formations. Features traditional Najdi architecture with modern luxury amenities.",
    location: "AlUla",
    pricePerNight: "750.00",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["wifi", "pool", "parking", "desert-view", "traditional-architecture"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    rating: "4.90",
    reviewCount: 127,
    isActive: true,
    isFeatured: true
  },
  {
    hostId: "host_2",
    title: "Modern Apartment in Riyadh City Center",
    description: "Stylish apartment in the heart of Riyadh with stunning city skyline views. Walking distance to King Abdulaziz Conference Center and major shopping districts.",
    location: "Riyadh",
    pricePerNight: "280.00",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["wifi", "parking", "gym", "city-view", "business-center"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    rating: "4.70",
    reviewCount: 89,
    isActive: true,
    isFeatured: true
  },
  {
    hostId: "host_3",
    title: "Beachfront Resort in Jeddah",
    description: "Luxurious beachfront property on the Red Sea coast. Enjoy private beach access, water sports, and traditional Saudi hospitality with modern amenities.",
    location: "Jeddah",
    pricePerNight: "950.00",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["wifi", "pool", "beach-access", "water-sports", "spa"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    rating: "4.80",
    reviewCount: 156,
    isActive: true,
    isFeatured: true
  },
  {
    hostId: "host_4",
    title: "Historic House in Al-Diriyah",
    description: "Stay in a beautifully restored traditional house in the UNESCO World Heritage site of Al-Diriyah. Experience authentic Saudi culture and history.",
    location: "Al-Diriyah",
    pricePerNight: "420.00",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["wifi", "heritage-site", "traditional-decor", "cultural-tours"],
    maxGuests: 5,
    bedrooms: 3,
    bathrooms: 2,
    rating: "4.60",
    reviewCount: 74,
    isActive: true,
    isFeatured: false
  },
  {
    hostId: "host_5",
    title: "Mountain Retreat in Abha",
    description: "Escape to the cool mountains of Abha in this charming retreat. Perfect for nature lovers with hiking trails and breathtaking mountain views.",
    location: "Abha",
    pricePerNight: "320.00",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["wifi", "mountain-view", "hiking", "fireplace", "nature-tours"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    rating: "4.50",
    reviewCount: 45,
    isActive: true,
    isFeatured: false
  },
  {
    hostId: "host_6",
    title: "Business Hotel Suite in Dammam",
    description: "Premium business suite in Dammam's commercial district. Ideal for business travelers with meeting rooms and close proximity to major corporations.",
    location: "Dammam",
    pricePerNight: "380.00",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["wifi", "business-center", "meeting-rooms", "parking", "gym"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    rating: "4.40",
    reviewCount: 67,
    isActive: true,
    isFeatured: false
  }
];

const seedUsers = [
  {
    id: "host_1",
    firstName: "Ahmed",
    lastName: "Al-Rashid",
    email: "ahmed.rashid@example.com",
    userType: "host"
  },
  {
    id: "host_2", 
    firstName: "Fatima",
    lastName: "Al-Zahra",
    email: "fatima.zahra@example.com",
    userType: "host"
  },
  {
    id: "host_3",
    firstName: "Mohammed",
    lastName: "Al-Saud",
    email: "mohammed.saud@example.com", 
    userType: "host"
  },
  {
    id: "host_4",
    firstName: "Nora",
    lastName: "Al-Qahtani",
    email: "nora.qahtani@example.com",
    userType: "host"
  },
  {
    id: "host_5",
    firstName: "Omar",
    lastName: "Al-Ghamdi",
    email: "omar.ghamdi@example.com",
    userType: "host"
  },
  {
    id: "host_6",
    firstName: "Sarah",
    lastName: "Al-Dosari",
    email: "sarah.dosari@example.com",
    userType: "host"
  }
];

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Check if properties already exist
    const existingProperties = await db.select().from(properties).limit(1);
    if (existingProperties.length > 0) {
      console.log("📋 Database already seeded, skipping...");
      return;
    }

    // Seed users first
    for (const user of seedUsers) {
      await db.insert(users).values(user).onConflictDoNothing();
    }
    console.log("👥 Seeded users");

    // Seed properties
    await db.insert(properties).values(seedProperties);
    console.log("🏠 Seeded properties");

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}