# ACTIV Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
The `.env` file is already configured with your MongoDB credentials:
- MongoDB URI: Connected to your cluster
- Database: activ-db
- Collection: web users

### 3. Start the Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:4000`

## API Endpoints

### Authentication

#### Register New User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+91 1234567890",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "user": {
        "id": "...",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "+91 1234567890",
        "role": "member"
      },
      "token": "jwt_token..."
    }
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "...",
        "fullName": "John Doe",
        "email": "john@example.com",
        "role": "member"
      },
      "token": "jwt_token..."
    }
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "member"
    }
  }
  ```

#### Update Profile
- **PUT** `/api/auth/profile`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "fullName": "John Smith",
    "phoneNumber": "+91 9876543210"
  }
  ```

#### Change Password
- **PUT** `/api/auth/change-password`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword123"
  }
  ```

### Health Check
- **GET** `/api/health`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2025-12-14T..."
  }
  ```

## Database Schema

### Web Users Collection
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  phoneNumber: String (required),
  password: String (required, hashed),
  role: String (default: 'member'),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Input Validation**: Express-validator
4. **Error Handling**: Centralized error handler
5. **CORS**: Configured for frontend access
6. **Role-Based Access**: Protected routes with role checks

## Project Structure
```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js              # JWT verification
│   └── errorHandler.js      # Error handling
├── models/
│   └── WebUser.js           # User schema
├── routes/
│   └── authRoutes.js        # API routes
├── .env                     # Environment variables
├── server.js                # Main server file
└── package.json
```

## Testing the API

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands

Example curl:
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phoneNumber": "+91 1234567890",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
