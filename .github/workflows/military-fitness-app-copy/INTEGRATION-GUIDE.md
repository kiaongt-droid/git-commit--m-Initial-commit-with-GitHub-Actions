# Full-Stack Setup Guide

This guide explains how to set up and run the complete Military Fitness Hub application with authentication and file uploads.

## Architecture

- **Frontend**: Static HTML/CSS/JS (runs on any server or locally)
- **Backend**: Node.js/Express API server
- **Database**: MongoDB (local or Atlas)
- **Storage**: Local file system (or easily swappable for cloud storage)

## Prerequisites

- Node.js and npm
- MongoDB (local installation or MongoDB Atlas account)
- A modern web browser

## Step 1: Backend Setup

### 1.1 Install dependencies
```bash
cd backend
npm install
```

### 1.2 Configure environment
```bash
cp .env.example .env
```

Edit `.env` with:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong random string for JWT signing
- `PORT`: Server port (default 5000)

### 1.3 Start MongoDB
If using local MongoDB:
```bash
mongod
```

If using MongoDB Atlas, ensure the URI in `.env` is correct.

### 1.4 Start the backend server
```bash
npm start
```

The API should be running at `http://localhost:5000`.

Verify with:
```bash
curl http://localhost:5000/api/health
```

## Step 2: Frontend Setup

### 2.1 Update API URL
Edit `auth.js` and update the `API_URL`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

### 2.2 Integrate auth sections into index.html
Add these lines before the closing `</body>` tag in `index.html`:
```html
<link rel="stylesheet" href="auth-styles.css" />
<script src="auth.js"></script>
```

Add the auth sections (from `auth-sections.html`) to the main `<main>` element.

### 2.3 Add Profiles and Documents tabs to navigation
Update the navigation in `index.html`:
```html
<button type="button" class="nav-button" data-target="profiles">User Profiles</button>
<button type="button" class="nav-button" data-target="documents">Documents</button>
```

### 2.4 Run the frontend
Use the launcher script:
```bash
./run-app.bat
```

Or serve manually:
```bash
npx http-server . -p 8080
```

The app will be available at `http://127.0.0.1:8080`.

## Step 3: Test the Application

1. **Sign up**: Create a new account with email and password
2. **Add profile**: Fill in your profile information (name, age, height, etc.)
3. **Upload document**: Try uploading a file
4. **View profiles**: Browse other users' profiles
5. **Log out**: Clear localStorage token and refresh

## Deployment

### Frontend
- Build and deploy to a static hosting service (GitHub Pages, Vercel, AWS S3)
- Update `API_URL` in `auth.js` to point to production backend

### Backend
- Deploy Node.js server to a service like Heroku, AWS EC2, or DigitalOcean
- Use MongoDB Atlas for the database
- Configure environment variables in deployment
- Set up CORS to allow your frontend domain

## Troubleshooting

### CORS errors
Update backend `server.js` CORS settings:
```javascript
app.use(cors({
  origin: 'http://your-frontend-domain.com'
}));
```

### File upload not working
- Check backend uploads directory exists
- Verify file permissions
- Check MongoDB is running

### Authentication issues
- Verify JWT_SECRET matches between frontend and backend
- Check token expiration time
- Clear browser localStorage and log in again

### MongoDB connection error
- Verify MongoDB is running
- Check connection string in `.env`
- If using Atlas, whitelist your IP address

## Next Steps

- Add password reset functionality
- Implement user roles and permissions
- Add profile picture uploads
- Integrate real AI API for training/meal plans
- Add email verification
- Deploy to production
