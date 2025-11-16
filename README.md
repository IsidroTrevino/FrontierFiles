# Pokemon Skin Gallery Management System

A full-stack application for organizing and managing custom Pokemon skins and assets with project-based categorization and cloud file storage.

## 🚀 Features

- **User Authentication** - Secure JWT-based auth with bcrypt password hashing
- **Project Management** - Create unlimited projects to organize your work
- **Category System** - Project-scoped categories with custom colors
- **Pokemon Gallery** - Visual grid view with thumbnails
- **File Management** - Upload, organize, and download files (skins, photos, models)
- **Cloud Storage** - All files stored securely on Cloudinary
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Mode** - Modern dark theme interface

## 📁 Project Structure

```
pokemon-gallery/
├── frontend/          # SvelteKit + Skeleton UI
├── backend/           # NestJS + MongoDB
├── shared/            # Shared TypeScript types
└── package.json       # Root workspace config
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: SvelteKit (TypeScript)
- **UI Library**: Skeleton UI
- **HTTP Client**: Axios
- **State Management**: Svelte Stores

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js + JWT
- **File Upload**: Multer + Cloudinary
- **Validation**: class-validator

### Services
- **Database**: MongoDB Atlas (free tier)
- **File Storage**: Cloudinary (free tier)

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free)
- Cloudinary account (free, no credit card)

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd pokemon-gallery
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../shared && npm install
```

### 2. Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get your connection string

### 3. Setup Cloudinary

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free (no credit card needed)
3. From dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

### 4. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pokemon-gallery

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 5. Configure Frontend

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
PUBLIC_API_URL=http://localhost:3000/api
```

### 6. Run the Application

**Option 1: Run both servers separately**

Terminal 1 - Backend:
```bash
cd backend
npm run start:dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option 2: Run concurrently from root**

```bash
cd ..  # Back to root
npm run dev
```

### 7. Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## 📖 Usage Guide

### 1. Register & Login

1. Navigate to http://localhost:5173
2. Click "Register" and create an account
3. Login with your credentials

### 2. Create a Project

1. Click "+ New Project" on dashboard
2. Enter project name and optional description
3. Click "Create"

### 3. Create Categories

1. Open a project
2. In left sidebar, click "+" next to Categories
3. Enter category name and choose a color
4. Click "Create"

### 4. Add Pokemon

1. Click "+ New Pokemon" button
2. Enter pokemon name
3. Optionally select a category
4. Add notes if desired
5. Click "Create"

### 5. Manage Pokemon

1. Click on a pokemon card to open details drawer
2. Upload main image
3. Edit name, category, and notes
4. Upload files organized by type (Skins, Photos, Models)
5. Download or delete files
6. Click "Save" when done

### 6. Filter by Category

- Click on category names in sidebar to filter gallery
- Click "All" to show all pokemon

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user
```

### Projects
```
GET    /api/projects               - Get all user's projects
POST   /api/projects               - Create new project
GET    /api/projects/:id           - Get project by ID
PATCH  /api/projects/:id           - Update project
DELETE /api/projects/:id           - Delete project
```

### Categories
```
GET    /api/projects/:projectId/categories       - Get all categories
POST   /api/projects/:projectId/categories       - Create category
PATCH  /api/categories/:id                       - Update category
DELETE /api/categories/:id                       - Delete category
```

### Pokemon
```
GET    /api/projects/:projectId/pokemon          - Get all pokemon
POST   /api/projects/:projectId/pokemon          - Create pokemon
GET    /api/pokemon/:id                          - Get pokemon by ID
PATCH  /api/pokemon/:id                          - Update pokemon
DELETE /api/pokemon/:id                          - Delete pokemon
```

### Files
```
POST   /api/pokemon/:id/main-image               - Upload main image
POST   /api/pokemon/:id/files                    - Upload files
PATCH  /api/pokemon/:pokemonId/files/:fileId     - Update file metadata
DELETE /api/pokemon/:pokemonId/files/:fileId     - Delete file
```

## 🏗️ Database Schema

### User
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  name: string (optional)
  createdAt: Date
  updatedAt: Date
}
```

### Project
```typescript
{
  name: string (required)
  description: string (optional)
  userId: ObjectId (required)
  createdAt: Date
  updatedAt: Date
}
```

### Category
```typescript
{
  name: string (required)
  projectId: ObjectId (required)
  color: string (hex color, optional)
  createdAt: Date
  updatedAt: Date
}
```

### Pokemon
```typescript
{
  name: string (required)
  projectId: ObjectId (required)
  categoryId: ObjectId (optional)
  mainImage: { url: string, publicId: string } (optional)
  notes: string (optional)
  files: [{
    name: string
    type: 'skin' | 'photo' | 'model' | 'other'
    folder: string (optional)
    url: string
    publicId: string
    uploadedAt: Date
  }]
  createdAt: Date
  updatedAt: Date
}
```

## 🔐 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for authentication
- Protected API routes
- CORS configuration
- Input validation
- File size limits (10MB per file)
- User ownership verification

## 📝 Development

### Build for Production

Backend:
```bash
cd backend
npm run build
npm run start:prod
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

### Project Commands

```bash
# Install all dependencies
npm install

# Run both dev servers
npm run dev

# Build both projects
npm run build
```

## 🚀 Deployment

### Backend (Railway/Render/Fly.io)

1. Push code to GitHub
2. Connect repository to hosting service
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `frontend/.svelte-kit`
5. Set environment variables
6. Deploy

## 🐛 Troubleshooting

### Connection Issues

- Ensure MongoDB Atlas IP whitelist includes your IP
- Check that .env files are configured correctly
- Verify MongoDB connection string format

### CORS Errors

- Check CORS_ORIGIN in backend .env
- Ensure frontend is running on correct port

### File Upload Issues

- Verify Cloudinary credentials
- Check file size limits
- Ensure proper file types

## 📄 License

MIT

## 👥 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 🙏 Acknowledgments

- NestJS for the amazing backend framework
- SvelteKit for the frontend framework
- Skeleton UI for the component library
- Cloudinary for file storage
- MongoDB Atlas for database hosting
