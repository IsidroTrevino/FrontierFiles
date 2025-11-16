# 🚀 Quick Setup Guide

Follow these steps to get your Pokemon Gallery up and running in minutes!

## Step 1: Install Dependencies

```bash
# From the root directory
cd pokemon-gallery

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install shared types
cd ../shared
npm install && npm run build

# Return to root
cd ..
```

## Step 2: Setup MongoDB Atlas (FREE)

1. **Sign up**: Go to https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster**: 
   - Choose FREE tier (M0 Sandbox)
   - Select your preferred cloud provider and region
   - Click "Create Cluster" (takes ~5 minutes)
3. **Create Database User**:
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set role to "Read and write to any database"
4. **Whitelist IP**:
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
5. **Get Connection String**:
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `pokemon-gallery`

Example: `mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/pokemon-gallery`

## Step 3: Setup Cloudinary (FREE - No Credit Card!)

1. **Sign up**: Go to https://cloudinary.com/users/register/free
2. **Get Credentials**:
   - After signup, you'll see your dashboard
   - Find these three values:
     - **Cloud Name** (e.g., `dxyz123abc`)
     - **API Key** (e.g., `123456789012345`)
     - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)
3. **Optional - Create Upload Preset** (for easier testing):
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set "Signing Mode" to "Unsigned" (for testing)

## Step 4: Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
# MongoDB - Use your connection string from Step 2
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/pokemon-gallery

# JWT - Generate a random secret (can use any long random string)
JWT_SECRET=super-secret-key-change-this-to-something-random-and-secure
JWT_EXPIRES_IN=7d

# Cloudinary - Use your credentials from Step 3
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Generate JWT Secret** (optional - secure random string):
```bash
# On Mac/Linux
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or just use any long random string
```

## Step 5: Configure Frontend Environment

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
PUBLIC_API_URL=http://localhost:3000/api
```

## Step 6: Start the Application

### Option A: Start Both Servers from Root (Recommended)

```bash
# From pokemon-gallery root directory
npm run dev
```

This starts both backend and frontend simultaneously!

### Option B: Start Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 7: Access the Application

🎉 **You're done! Open your browser:**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

## Step 8: Create Your First Project

1. Click **"Register"** and create an account
2. Login with your credentials
3. Click **"+ New Project"**
4. Enter a project name (e.g., "My Pokemon Skins")
5. Click **"Create"**
6. You're now in your project gallery!

## Next Steps

### Create Categories
1. In the left sidebar, click **"+"** next to "Categories"
2. Enter a name (e.g., "Halloween", "Summer")
3. Choose a color
4. Click **"Create"**

### Add Pokemon
1. Click **"+ New Pokemon"**
2. Enter pokemon name
3. Select a category (optional)
4. Click **"Create"**

### Upload Files
1. Click on a pokemon card
2. Upload a main image
3. Go to Files section
4. Select tab (Skins/Photos/Models)
5. Choose files and upload

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- ✅ Check your MongoDB connection string in `backend/.env`
- ✅ Verify username and password are correct
- ✅ Ensure IP is whitelisted (0.0.0.0/0 for dev)
- ✅ Check MongoDB cluster is running

### "CORS Error"
- ✅ Verify `CORS_ORIGIN` in `backend/.env` is `http://localhost:5173`
- ✅ Make sure both servers are running
- ✅ Clear browser cache

### "Failed to upload file"
- ✅ Check Cloudinary credentials in `backend/.env`
- ✅ Ensure file is under 10MB
- ✅ Try uploading a different file type

### "Port already in use"
- ✅ Backend: Change `PORT` in `backend/.env`
- ✅ Frontend: Change port in `frontend/vite.config.ts`

### Backend won't start
```bash
# Clear and reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't start
```bash
# Clear and reinstall dependencies
cd frontend
rm -rf node_modules .svelte-kit package-lock.json
npm install
```

## 📚 Useful Commands

```bash
# Root directory
npm run dev              # Start both servers
npm run build            # Build both projects

# Backend only
cd backend
npm run start:dev        # Development mode with hot reload
npm run build            # Build for production
npm run start:prod       # Run production build

# Frontend only
cd frontend
npm run dev              # Development server
npm run build            # Build for production
npm run preview          # Preview production build
```

## 🎯 What You Should See

### Backend Running:
```
🚀 Application is running on: http://localhost:3000/api
```

### Frontend Running:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 💡 Tips

1. **Keep both terminals open** while developing
2. **Backend restarts automatically** when you make changes
3. **Frontend hot-reloads** - changes appear instantly
4. **Check browser console** for frontend errors
5. **Check terminal** for backend errors

## 🆘 Still Having Issues?

1. Make sure Node.js 18+ is installed: `node --version`
2. Make sure npm is installed: `npm --version`
3. Try restarting both servers
4. Check that ports 3000 and 5173 are not in use
5. Verify all .env files are created correctly

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Cloudinary account created
- [ ] Backend .env file configured
- [ ] Frontend .env file configured
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Can register a new user
- [ ] Can create a project
- [ ] Can create categories
- [ ] Can create pokemon
- [ ] Can upload files

---

**Need help?** Check the main README.md for detailed documentation!

Happy organizing your Pokemon skins! 🎮✨
