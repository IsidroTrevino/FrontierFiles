# Quick Start Commands

## Installation

```bash
# From root directory
npm install

# Install backend
cd backend && npm install && cd ..

# Install frontend  
cd frontend && npm install && cd ..

# Install shared types
cd shared && npm install && npm run build && cd ..
```

## Running the Application

```bash
# Option 1: Run both from root (Recommended)
npm run dev

# Option 2: Run separately
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## Building for Production

```bash
# Build everything
npm run build

# Or separately
cd backend && npm run build
cd frontend && npm run build
```

## Quick Commands Reference

```bash
# Backend
cd backend
npm run start:dev      # Development mode
npm run build          # Build
npm run start:prod     # Production mode

# Frontend
cd frontend
npm run dev            # Development server
npm run build          # Build for production
npm run preview        # Preview production build
```

## First Time Setup Checklist

- [ ] Install Node.js 18+
- [ ] Clone/download project
- [ ] Run `npm install` in root, backend, frontend, shared
- [ ] Create MongoDB Atlas account
- [ ] Create Cloudinary account
- [ ] Copy `backend/.env.example` to `backend/.env`
- [ ] Copy `frontend/.env.example` to `frontend/.env`
- [ ] Fill in MongoDB connection string in `backend/.env`
- [ ] Fill in Cloudinary credentials in `backend/.env`
- [ ] Run `npm run dev` from root
- [ ] Open http://localhost:5173
- [ ] Register and start using!

## Default Ports

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API: http://localhost:3000/api

## Common Issues & Solutions

### Port in use
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill
```

### Dependencies issue
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### MongoDB connection fails
- Check internet connection
- Verify MongoDB Atlas is running
- Check connection string in .env
- Ensure IP is whitelisted (0.0.0.0/0)

### Cloudinary upload fails
- Verify credentials in .env
- Check Cloudinary account is active
- Ensure file is under 10MB

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pokemon-gallery
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
PUBLIC_API_URL=http://localhost:3000/api
```

## File Structure Quick Reference

```
pokemon-gallery/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication
│   │   ├── users/         # User management
│   │   ├── projects/      # Projects CRUD
│   │   ├── categories/    # Categories CRUD
│   │   ├── pokemon/       # Pokemon + Files
│   │   └── cloudinary/    # File upload service
│   ├── .env              # Config (create this!)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── routes/        # Pages
│   │   └── lib/           # Components, stores, API
│   ├── .env              # Config (create this!)
│   └── package.json
└── package.json          # Root (workspace)
```

## Testing the API

You can use these curl commands to test:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Create Project (replace TOKEN)
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"My Project","description":"Test"}'
```

## Development Workflow

1. **Start servers**: `npm run dev`
2. **Make changes**: Edit files in `backend/src` or `frontend/src`
3. **Auto-reload**: Both servers restart/reload automatically
4. **Check console**: Watch for errors in terminal
5. **Test in browser**: http://localhost:5173

## Deployment

### Backend (Railway/Render)
1. Push to GitHub
2. Create new service
3. Connect repository
4. Set environment variables
5. Deploy

### Frontend (Vercel)
1. Push to GitHub
2. Import project in Vercel
3. Set `PUBLIC_API_URL` to production backend
4. Deploy

---

**Need detailed help?** See SETUP.md or DEVELOPMENT.md
