# Military Fitness Hub - Backend API

A Node.js/Express backend API with MongoDB for user authentication, profile management, and file uploads.

## Features

- User registration and login with JWT authentication
- User profile management
- File upload and storage
- Secure API endpoints with token-based access control

## Setup

### Prerequisites

- Node.js and npm installed
- MongoDB running locally or a MongoDB Atlas connection string

### Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file from the example:
   ```
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   - `PORT`: API server port (default: 5000)
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens

5. Start the server:
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

The API will be available at `http://localhost:5000`.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password",
    "name": "User Name"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```

- `GET /api/auth/me` - Get current user (requires auth token)

### Profiles

- `GET /api/profiles` - Get user profile (requires auth token)
- `POST /api/profiles` - Create or update profile (requires auth token)
- `GET /api/profiles/all` - Get all user profiles (requires auth token)
- `GET /api/profiles/:userId` - Get specific user profile (requires auth token)

### Files

- `POST /api/files/upload` - Upload a file (requires auth token)
- `GET /api/files` - Get user's files (requires auth token)
- `GET /api/files/download/:fileId` - Download a file (requires auth token)
- `DELETE /api/files/:fileId` - Delete a file (requires auth token)

## Authentication

Include the JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## File Storage

Files are stored in the `backend/uploads` directory. Ensure this directory exists and has proper permissions.

## Database Models

### User
- email (unique)
- password (hashed)
- name
- createdAt

### Profile
- userId (reference to User)
- name
- age
- height
- weight
- waist
- updatedAt

### FileUpload
- userId (reference to User)
- filename
- originalName
- filePath
- fileSize
- mimeType
- uploadedAt

## Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Implement rate limiting for production
- Validate all file uploads
- Use environment variables for sensitive data
