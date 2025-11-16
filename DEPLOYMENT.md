# Deployment Guide

## Prerequisites
- Vercel account (https://vercel.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- Cloudinary account (https://cloudinary.com)

## Backend Deployment (FrontierFilesApi)

### 1. Create MongoDB Atlas Database
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Create a new cluster (free tier is fine)
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for Vercel
5. Get your connection string

### 2. Set up Cloudinary
1. Go to Cloudinary dashboard
2. Note your Cloud Name, API Key, and API Secret

### 3. Deploy Backend to Vercel
```bash
cd /Users/isidrotrevino/Documents/Personal/FrontierFiles/pokemon-gallery/backend
vercel
```

Or manually:
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Set Root Directory to `backend`
4. Set Project Name to `FrontierFilesApi`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A random secure string (generate with `openssl rand -base64 32`)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `CORS_ORIGIN`: Your frontend URL (will add after frontend deployment)
6. Click Deploy

### 4. Note your API URL
After deployment, note the URL (e.g., `https://frontier-files-api.vercel.app`)

## Frontend Deployment (FrontierFiles)

### 1. Deploy Frontend to Vercel
```bash
cd /Users/isidrotrevino/Documents/Personal/FrontierFiles/pokemon-gallery/frontend
vercel
```

Or manually:
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Set Root Directory to `frontend`
4. Set Project Name to `FrontierFiles`
5. Add Environment Variables:
   - `VITE_API_URL`: Your backend API URL from step above (e.g., `https://frontier-files-api.vercel.app/api`)
6. Click Deploy

### 2. Update Backend CORS
1. Go to your backend project in Vercel
2. Settings → Environment Variables
3. Update `CORS_ORIGIN` to your frontend URL (e.g., `https://frontier-files.vercel.app`)
4. Redeploy the backend

## Using Vercel CLI (Recommended)

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy Backend
```bash
cd backend
vercel --prod
```

When prompted:
- Project name: `FrontierFilesApi`
- Link to existing project: No
- Directory: `.` (current directory)

Then add environment variables via Vercel dashboard.

### Deploy Frontend
```bash
cd ../frontend
vercel --prod
```

When prompted:
- Project name: `FrontierFiles`
- Link to existing project: No
- Directory: `.` (current directory)

## Post-Deployment

### Test the Deployment
1. Visit your frontend URL
2. Register a new account
3. Create a project
4. Upload files
5. Verify everything works

### Set up Custom Domain (Optional)
1. Go to your Vercel project
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Backend Issues
- Check Vercel logs for errors
- Verify MongoDB connection string
- Verify Cloudinary credentials
- Ensure all environment variables are set

### Frontend Issues
- Check browser console for errors
- Verify VITE_API_URL is correct
- Ensure backend CORS_ORIGIN includes frontend URL

### Database Connection
- Ensure MongoDB Atlas allows connections from all IPs
- Check if database user has correct permissions

## Environment Variables Summary

### Backend (FrontierFilesApi)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=https://frontier-files.vercel.app
```

### Frontend (FrontierFiles)
```
VITE_API_URL=https://frontier-files-api.vercel.app/api
```
