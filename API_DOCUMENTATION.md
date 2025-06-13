# Habibistay API Documentation

## Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "guest"
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "newPassword": "newpassword123"
}
```

### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token"
}
```

## Properties

### Get All Properties
```http
GET /api/properties?featured=true&limit=10
```

### Get Property by ID
```http
GET /api/properties/:id
```

### Create Property (Host/Admin only)
```http
POST /api/properties
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Beautiful Ocean View Villa",
  "description": "Stunning oceanfront property",
  "location": "Malibu, CA",
  "pricePerNight": "299.99",
  "maxGuests": 8,
  "bedrooms": 4,
  "bathrooms": 3,
  "amenities": ["wifi", "pool", "parking"],
  "images": ["image1.jpg", "image2.jpg"]
}
```

### Update Property
```http
PUT /api/properties/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Property Title",
  "pricePerNight": "349.99"
}
```

### Get Host Properties
```http
GET /api/host/properties
Authorization: Bearer <jwt-token>
```

## Bookings

### Get User Bookings
```http
GET /api/bookings
Authorization: Bearer <jwt-token>
```

### Get Host Bookings
```http
GET /api/host/bookings
Authorization: Bearer <jwt-token>
```

### Create Booking
```http
POST /api/bookings
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "propertyId": 1,
  "checkIn": "2024-07-01T00:00:00.000Z",
  "checkOut": "2024-07-05T00:00:00.000Z",
  "guests": 4,
  "totalAmount": "1199.96",
  "guestInfo": {
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  }
}
```

### Update Booking Status (Host/Admin only)
```http
PUT /api/bookings/:id/status
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

## Admin Routes

### Get All Users (Admin only)
```http
GET /api/admin/users
Authorization: Bearer <jwt-token>
```

### Update User Role (Admin only)
```http
PUT /api/admin/users/:id/role
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "userType": "host"
}
```

### Deactivate User (Admin only)
```http
PUT /api/admin/users/:id/deactivate
Authorization: Bearer <jwt-token>
```

### Activate User (Admin only)
```http
PUT /api/admin/users/:id/activate
Authorization: Bearer <jwt-token>
```

### Get System Analytics (Admin only)
```http
GET /api/admin/analytics
Authorization: Bearer <jwt-token>
```

### Get All Properties for Moderation (Admin only)
```http
GET /api/admin/properties
Authorization: Bearer <jwt-token>
```

### Approve/Reject Property (Admin only)
```http
PUT /api/admin/properties/:id/status
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "isActive": true,
  "reason": "Property meets all requirements"
}
```

## Notifications

### Get User Notifications
```http
GET /api/notifications?unreadOnly=true
Authorization: Bearer <jwt-token>
```

### Mark Notification as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <jwt-token>
```

### Mark All Notifications as Read
```http
PUT /api/notifications/read-all
Authorization: Bearer <jwt-token>
```

## Reviews

### Get Property Reviews
```http
GET /api/properties/:id/reviews
```

### Create Review
```http
POST /api/reviews
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "propertyId": 1,
  "bookingId": 1,
  "rating": 5,
  "comment": "Amazing stay! Highly recommended."
}
```

## Favorites

### Get User Favorites
```http
GET /api/favorites
Authorization: Bearer <jwt-token>
```

### Add to Favorites
```http
POST /api/favorites
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "propertyId": 1
}
```

### Remove from Favorites
```http
DELETE /api/favorites/:propertyId
Authorization: Bearer <jwt-token>
```

## Chat/AI Assistant

### Send Message to Sara AI
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Find me oceanfront properties in California",
  "sessionId": "session-uuid"
}
```

### Get Chat History
```http
GET /api/chat/:sessionId
```

## Search

### Search Properties
```http
POST /api/search
Content-Type: application/json

{
  "location": "California",
  "checkIn": "2024-07-01",
  "checkOut": "2024-07-05",
  "guests": 4,
  "minPrice": 100,
  "maxPrice": 500,
  "amenities": ["wifi", "pool"]
}
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error

## Authentication Headers

Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Search endpoints: 30 requests per minute