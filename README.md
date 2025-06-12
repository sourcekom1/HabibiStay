# Habibistay - Premium Property Rental Platform

A comprehensive Airbnb-style property rental platform built with modern technologies, featuring AI-powered customer support, real-time notifications, and advanced analytics.

## 🚀 Features

### Core Functionality
- **Property Search & Booking**: Advanced filtering with location, dates, price range, and amenities
- **User Management**: Authentication with role-based access (Guest, Host, Admin)
- **Real-time Notifications**: Instant updates for bookings, payments, and property changes
- **Favorites System**: Save and manage favorite properties
- **Payment Processing**: Secure PayPal integration for transactions
- **SMS Notifications**: Twilio-powered SMS alerts for important events

### AI & Analytics
- **Sara AI Chatbot**: OpenAI-powered customer support assistant
- **Analytics Dashboard**: Comprehensive tracking of user interactions and platform metrics
- **Performance Monitoring**: Real-time performance metrics and health checks

### Security & Performance
- **Rate Limiting**: API protection with configurable rate limits
- **Input Validation**: Comprehensive Zod-based validation
- **Caching System**: In-memory caching for improved performance
- **Error Handling**: Structured error logging and user-friendly error messages
- **Security Headers**: CSP, CORS, and other security measures

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for state management
- **Wouter** for routing
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL
- **Zod** for validation
- **Express Session** for authentication

### External Services
- **OpenAI API** for AI chatbot
- **Twilio** for SMS notifications
- **PayPal SDK** for payments
- **PostgreSQL** database

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 16+
- API Keys for:
  - OpenAI (for chatbot)
  - Twilio (for SMS)
  - PayPal (for payments)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habibistay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Required API keys
   OPENAI_API_KEY=your_openai_api_key
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   
   # Database
   DATABASE_URL=your_postgresql_connection_string
   
   # Optional
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5000
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Initiate login (Replit Auth)
- `GET /api/logout` - Logout user

### Property Endpoints
- `GET /api/properties` - List all properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (Host only)
- `PUT /api/properties/:id` - Update property (Host only)
- `GET /api/search` - Search properties with filters

### Booking Endpoints
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status

### Favorites Endpoints
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/:id/read` - Mark as read

### Analytics Endpoints
- `POST /api/analytics/track` - Track user event
- `GET /api/analytics` - Get analytics data (Admin only)

### Admin Endpoints
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/analytics` - Detailed analytics

## 🏗 Architecture

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Express backend
│   ├── middleware/         # Express middleware
│   ├── utils/              # Server utilities
│   └── routes.ts           # API routes
├── shared/                 # Shared types and schemas
└── tests/                  # Test utilities
```

### Database Schema
- **Users**: Authentication and user profiles
- **Properties**: Property listings and details
- **Bookings**: Reservation management
- **Reviews**: Property ratings and feedback
- **Notifications**: Real-time user notifications
- **Analytics**: User interaction tracking
- **Favorites**: User property favorites
- **Payments**: Transaction records
- **SMS Notifications**: SMS delivery tracking

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: All inputs validated with Zod schemas
- **Security Headers**: CSP, CORS, and security headers
- **Error Handling**: Structured error responses without data leakage
- **Authentication**: Session-based authentication with Replit Auth
- **SQL Injection Protection**: Parameterized queries with Drizzle ORM

## 📊 Monitoring & Performance

- **Health Checks**: `/health` endpoint for system monitoring
- **Performance Metrics**: Request timing and memory usage tracking
- **Error Logging**: Structured logging with different levels
- **Caching**: In-memory caching for improved response times
- **Database Connection Monitoring**: Connection pool health checks

## 🧪 Testing

The platform includes comprehensive testing utilities:

```bash
# Run tests (when test framework is configured)
npm test

# Database testing utilities available in tests/setup.ts
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```bash
NODE_ENV=production
DATABASE_URL=your_production_database_url
FRONTEND_URL=your_production_domain
# ... other API keys
```

### Health Check
Monitor application health at `/health` endpoint

## 📈 Performance Optimizations

- **Caching Strategy**: Intelligent caching with tag-based invalidation
- **Database Optimization**: Efficient queries and connection pooling
- **Asset Optimization**: Optimized builds with Vite
- **Rate Limiting**: Protects against abuse while maintaining performance
- **Memory Management**: Automatic cleanup of expired cache entries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper tests
4. Ensure all TypeScript checks pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For technical support or questions:
- Check the `/health` endpoint for system status
- Review server logs for error details
- Ensure all required API keys are properly configured