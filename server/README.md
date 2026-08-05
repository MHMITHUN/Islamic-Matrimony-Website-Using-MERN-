# 🔐 Muslims Nikah - Islamic Matrimony Platform (Backend)

<div align="center">

### RESTful API Server for Muslims Nikah Matrimony Platform

[![Live API](https://img.shields.io/badge/Live%20API-Vercel-000000?style=for-the-badge&logo=vercel)](https://nikah-website-ph-a-12.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://muslims-nikah-website.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/MHMITHUN/Matrimony-Website-Server--PH-A-12)

</div>

---

## 🌟 Overview

This is the backend server for **Muslims Nikah**, a comprehensive Islamic matrimony platform. Built with Node.js and Express, this RESTful API handles authentication, biodata management, payment processing, and administrative functions with robust security and scalability.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** - Secure token-based auth system
- **Firebase Integration** - Seamless Firebase authentication support
- **Role-Based Access Control (RBAC)** - Admin, premium, and regular user roles
- **Middleware Protection** - Route-level authentication and authorization

### 📊 Core Functionality
- **Biodata Management** - CRUD operations for matrimonial profiles
- **Contact Request System** - Manage contact information requests
- **Premium Membership** - Subscription-based premium features
- **Success Stories** - User success story management
- **Admin Dashboard** - Comprehensive analytics and management tools

### 💳 Payment Integration
- **Stripe Integration** - Secure payment processing for premium memberships
- **Payment Intent API** - Advanced payment flow handling
- **Transaction Management** - Complete payment history tracking

### 📈 Analytics & Reporting
- **Real-time Statistics** - Live counts and metrics
- **Revenue Tracking** - Detailed financial analytics
- **User Analytics** - User engagement and behavior tracking
- **Admin Dashboard Data** - Comprehensive administrative insights

---

## 🛠️ Technology Stack

### Core Technologies
- **⚡ Node.js** - JavaScript runtime environment
- **🚀 Express.js** - Fast, unopinionated web framework
- **🍃 MongoDB** - NoSQL database with Mongoose ODM
- **🔑 JWT** - JSON Web Tokens for authentication

### Key Libraries & Middleware
- **🔥 Firebase Admin SDK** - Firebase authentication verification
- **💳 Stripe** - Payment processing
- **🔒 Cors** - Cross-Origin Resource Sharing
- **📝 Dotenv** - Environment variable management
- **🍪 Cookie Parser** - Cookie handling middleware
- **🛡️ Helmet** - Security headers (recommended)
- **📊 Morgan** - HTTP request logger (recommended)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local or Atlas)
- **Stripe Account** - For payment processing
- **Firebase Project** - For authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MHMITHUN/Matrimony-Website-Server--PH-A-12.git
   cd Matrimony-Website-Server--PH-A-12
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   
   # Frontend URL (for CORS)
   CLIENT_URL=http://localhost:5174
   
   # Firebase Admin SDK (Optional - if using Firebase Admin)
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the production server**
   ```bash
   npm start
   ```

---

## 📁 Project Structure

```
server/
├── config/              # Configuration files
│   ├── db.js           # Database connection
│   └── firebase.js     # Firebase admin initialization
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication middleware
│   ├── verifyAdmin.js  # Admin verification middleware
│   └── errorHandler.js # Error handling middleware
├── models/             # Mongoose models
│   ├── Biodata.js      # Biodata schema
│   ├── User.js         # User schema
│   ├── ContactRequest.js
│   ├── SuccessStory.js
│   └── Payment.js
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── biodatas.js     # Biodata management routes
│   ├── users.js        # User management routes
│   ├── contacts.js     # Contact request routes
│   ├── payments.js     # Payment processing routes
│   ├── stories.js      # Success stories routes
│   └── admin.js        # Admin routes
├── controllers/        # Route controllers
├── utils/              # Utility functions
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── index.js            # Application entry point
├── package.json        # Dependencies and scripts
└── vercel.json         # Vercel deployment config
```

---

## 🌐 API Endpoints

### 🔐 Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
GET    /api/auth/verify            - Verify JWT token
POST   /api/auth/refresh           - Refresh access token
```

### 👥 Users
```
GET    /api/users                  - Get all users (Admin)
GET    /api/users/:id              - Get user by ID
PATCH  /api/users/:id              - Update user
DELETE /api/users/:id              - Delete user (Admin)
PATCH  /api/users/:id/role         - Update user role (Admin)
GET    /api/users/:id/stats        - Get user statistics
```

### 📝 Biodatas
```
GET    /api/biodatas               - Get all biodatas (with filters)
GET    /api/biodatas/:id           - Get biodata by ID
POST   /api/biodatas               - Create new biodata
PATCH  /api/biodatas/:id           - Update biodata
DELETE /api/biodatas/:id           - Delete biodata
GET    /api/biodatas/user/:userId  - Get user's biodata
PATCH  /api/biodatas/:id/approve   - Approve biodata (Admin)
GET    /api/biodatas/premium       - Get premium biodatas
```

### 💖 Favorites
```
GET    /api/users/:userId/favorites        - Get user favorites
POST   /api/users/:userId/favorites/:id    - Add to favorites
DELETE /api/users/:userId/favorites/:id    - Remove from favorites
```

### 📧 Contact Requests
```
GET    /api/contacts                - Get all contact requests (Admin)
GET    /api/contacts/user/:userId   - Get user's contact requests
POST   /api/contacts                - Create contact request
PATCH  /api/contacts/:id/approve    - Approve contact request (Admin)
DELETE /api/contacts/:id            - Delete contact request
```

### 💳 Payments
```
POST   /api/payments/create-intent  - Create Stripe payment intent
POST   /api/payments/confirm        - Confirm payment
GET    /api/payments/user/:userId   - Get user's payment history
GET    /api/payments                - Get all payments (Admin)
GET    /api/payments/stats          - Get payment statistics (Admin)
```

### 🎉 Success Stories
```
GET    /api/stories                 - Get all success stories
GET    /api/stories/:id             - Get story by ID
POST   /api/stories                 - Create success story
PATCH  /api/stories/:id             - Update success story (Admin)
DELETE /api/stories/:id             - Delete success story (Admin)
PATCH  /api/stories/:id/review      - Review/Approve story (Admin)
```

### 📊 Admin
```
GET    /api/admin/stats             - Get dashboard statistics
GET    /api/admin/analytics         - Get detailed analytics
GET    /api/admin/revenue           - Get revenue statistics
GET    /api/admin/users/overview    - Get users overview
GET    /api/admin/biodatas/pending  - Get pending biodatas
```

---

## 🔑 Admin Access

### Test Admin API Endpoints

To test admin-protected endpoints, you can use these credentials:

**Admin Login Credentials:**
- **Email:** `admin@islamicmatrimony.com`
- **Password:** `Admin@123`

**How to Test:**
1. Login using the admin credentials via `/api/auth/login`
2. Copy the JWT token from the response
3. Include the token in the Authorization header for admin endpoints:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

**Admin-Only Endpoints You Can Test:**
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/analytics` - Detailed analytics
- `PATCH /api/biodatas/:id/approve` - Approve biodatas
- `PATCH /api/users/:id/role` - Update user roles
- `GET /api/payments` - View all payments
- `PATCH /api/stories/:id/review` - Review success stories

✨ **All admin functionalities are available for testing!**

⚠️ **Note:** These are demo credentials for evaluation purposes only.

---

## 🗄️ Database Schema

### User Schema
```javascript
{
  email: String (unique, required),
  name: String (required),
  photoURL: String,
  role: String (enum: ['user', 'premium', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Biodata Schema
```javascript
{
  userId: ObjectId (ref: 'User'),
  biodataType: String (enum: ['male', 'female']),
  name: String (required),
  profileImage: String,
  dateOfBirth: Date (required),
  height: String,
  weight: String,
  age: Number,
  occupation: String,
  race: String,
  fatherName: String,
  motherName: String,
  permanentDivision: String,
  presentDivision: String,
  expectedPartnerAge: String,
  expectedPartnerHeight: String,
  expectedPartnerWeight: String,
  contactEmail: String (required),
  mobileNumber: String (required),
  status: String (enum: ['pending', 'approved', 'rejected']),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Request Schema
```javascript
{
  userId: ObjectId (ref: 'User'),
  biodataId: ObjectId (ref: 'Biodata'),
  requestedEmail: String,
  requestedMobile: String,
  status: String (enum: ['pending', 'approved']),
  paymentId: ObjectId (ref: 'Payment'),
  createdAt: Date
}
```

### Payment Schema
```javascript
{
  userId: ObjectId (ref: 'User'),
  biodataId: ObjectId (ref: 'Biodata'),
  amount: Number (required),
  currency: String (default: 'bdt'),
  stripePaymentIntentId: String,
  status: String (enum: ['pending', 'completed', 'failed']),
  createdAt: Date
}
```

### Success Story Schema
```javascript
{
  userId: ObjectId (ref: 'User'),
  marriageDate: Date (required),
  rating: Number (1-5),
  successStoryText: String (required),
  coupleImage: String,
  groomBiodataId: ObjectId (ref: 'Biodata'),
  brideBiodataId: ObjectId (ref: 'Biodata'),
  status: String (enum: ['pending', 'approved', 'rejected']),
  createdAt: Date
}
```

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens** - Secure stateless authentication
- **Bcrypt Password Hashing** - Secure password storage (if using local auth)
- **Role-Based Middleware** - Protect admin routes
- **Token Expiration** - Automatic token invalidation

### Data Protection
- **Input Validation** - Request data validation
- **MongoDB Injection Prevention** - Parameterized queries
- **CORS Configuration** - Controlled cross-origin requests
- **Environment Variables** - Sensitive data protection

### Best Practices
- **Error Handling** - Centralized error management
- **Rate Limiting** - API abuse prevention (recommended)
- **Helmet.js** - Security headers (recommended)
- **Request Logging** - Morgan for HTTP request logs (recommended)

---

## 🌐 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json`**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "index.js"
       }
     ],
     "env": {
       "MONGODB_URI": "@mongodb-uri",
       "JWT_SECRET": "@jwt-secret",
       "STRIPE_SECRET_KEY": "@stripe-secret-key"
     }
   }
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add STRIPE_SECRET_KEY
   ```

### Environment Variables for Production
- Set all environment variables in Vercel dashboard
- Update `CLIENT_URL` to production frontend URL
- Ensure MongoDB allows Vercel IP addresses

---

## 📦 Available Scripts

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start

# Run tests (if configured)
npm test
```

---

## 🔍 API Testing

### Using Postman or Thunder Client

1. **Set Base URL:** `https://nikah-website-ph-a-12.vercel.app/api`
2. **Authentication:** Include JWT token in Authorization header
   ```
   Authorization: Bearer <your_jwt_token>
   ```

### Sample Request
```bash
# Get all biodatas
curl -X GET https://nikah-website-ph-a-12.vercel.app/api/biodatas

# Create biodata (requires authentication)
curl -X POST https://nikah-website-ph-a-12.vercel.app/api/biodatas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "biodataType": "male", ...}'
```

---

## 🐛 Error Handling

The API uses standard HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## 📊 Performance Optimization

- **Database Indexing** - Optimized queries with indexes
- **Pagination** - Limit large dataset responses
- **Caching** - Redis for frequently accessed data (recommended)
- **Compression** - Gzip compression for responses (recommended)
- **Connection Pooling** - MongoDB connection optimization

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Check test coverage
npm run test:coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🔗 Related Links

- **Frontend Repository:** [Matrimony-Website-Client--PH-A-12](https://github.com/MHMITHUN/Matrimony-Website-Client--PH-A-12)
- **Live Frontend:** [https://muslims-nikah-website.netlify.app](https://muslims-nikah-website.netlify.app)
- **Live API:** [https://nikah-website-ph-a-12.vercel.app](https://nikah-website-ph-a-12.vercel.app)

---

## 👨‍💻 Developer

**Mohammad Mithun**

- GitHub: [@MHMITHUN](https://github.com/MHMITHUN)
- Repository: [Client](https://github.com/MHMITHUN/Matrimony-Website-Client--PH-A-12) | [Server](https://github.com/MHMITHUN/Matrimony-Website-Server--PH-A-12)

---

## 🙏 Acknowledgments

- **MongoDB** - Database solution
- **Stripe** - Payment processing
- **Vercel** - Hosting and deployment
- **Firebase** - Authentication services
- All contributors and users of Muslims Nikah

---

<div align="center">

### Built with 💚 for the Muslim Community

**[API Documentation](https://nikah-website-ph-a-12.vercel.app)** | **[View Frontend](https://muslims-nikah-website.netlify.app)** | **[Report Bug](https://github.com/MHMITHUN/Matrimony-Website-Server--PH-A-12/issues)**

</div>
