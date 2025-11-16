# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                     http://localhost:5173                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Frontend (SvelteKit)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐│
│  │   Routes   │  │ Components │  │   Stores & API Client  ││
│  │            │  │            │  │                        ││
│  │ - Login    │  │ - Navbar   │  │ - authStore           ││
│  │ - Dashboard│  │ - Sidebar  │  │ - pokemonStore        ││
│  │ - Gallery  │  │ - Grid     │  │ - Axios interceptors  ││
│  └────────────┘  └────────────┘  └────────────────────────┘│
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Axios + JWT Token
                         │ http://localhost:3000/api
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Backend (NestJS)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Controllers Layer                       │   │
│  │  AuthController │ ProjectsController │ PokemonController│
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │              Services Layer                          │   │
│  │  AuthService │ ProjectsService │ PokemonService      │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │         Guards & Middleware                          │   │
│  │  JwtAuthGuard │ ValidationPipe │ CORS                │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
            ▼                         ▼
┌───────────────────────┐  ┌──────────────────────┐
│   MongoDB Atlas       │  │    Cloudinary        │
│   (Database)          │  │  (File Storage)      │
│                       │  │                      │
│ - users               │  │ - images/            │
│ - projects            │  │ - skins/             │
│ - categories          │  │ - models/            │
│ - pokemon             │  │                      │
└───────────────────────┘  └──────────────────────┘
```

## Data Flow Examples

### Authentication Flow

```
User → Login Form → POST /api/auth/login
                         ↓
                    AuthService validates
                         ↓
                    Generate JWT token
                         ↓
                    Return {user, token}
                         ↓
              Store in localStorage
                         ↓
          Axios adds to all requests
                         ↓
        JwtAuthGuard validates token
```

### File Upload Flow

```
User → Select Files → FileManager Component
                           ↓
                  FormData with files
                           ↓
            POST /api/pokemon/:id/files
                           ↓
                 Multer processes files
                           ↓
            CloudinaryService.uploadFile()
                           ↓
                  Files → Cloudinary CDN
                           ↓
              Save URLs to MongoDB
                           ↓
            Return updated Pokemon
                           ↓
              Update pokemonStore
                           ↓
                   UI refreshes
```

### Category Filtering Flow

```
User → Click Category → selectedCategoryStore.set(id)
                              ↓
                Store subscription triggers
                              ↓
        GET /api/projects/:id/pokemon?categoryId=xxx
                              ↓
                  MongoDB query filter
                              ↓
              Return filtered Pokemon[]
                              ↓
                Update pokemonStore
                              ↓
              PokemonGrid re-renders
```

## Component Hierarchy

```
App (+layout.svelte)
│
├── Landing Page (+page.svelte)
├── Login Page
├── Register Page
│
└── Dashboard Layout (+layout.svelte)
    ├── Navbar
    │   └── Logout Button
    │
    ├── Dashboard (+page.svelte)
    │   ├── ProjectCard (×N)
    │   └── CreateProjectModal
    │
    └── Project Gallery ([projectId]/+page.svelte)
        ├── Sidebar
        │   ├── Category List
        │   ├── CreateCategoryModal
        │   └── CreatePokemonModal
        │
        ├── PokemonGrid
        │   └── PokemonCard (×N)
        │
        └── Drawer
            └── PokemonDrawer
                ├── Image Upload
                ├── Edit Form
                └── FileManager
                    ├── TabGroup
                    └── File List
```

## Database Schema Relationships

```
┌──────────┐
│   User   │
│  _id     │◄────────┐
└──────────┘         │
                     │
                     │ userId
                     │
              ┌──────▼─────┐
              │  Project   │
              │  _id       │◄────────┐
              └────────────┘         │
                                     │
                                     │ projectId
                     ┌───────────────┼──────────┐
                     │               │          │
              ┌──────▼─────┐  ┌──────▼─────┐   │
              │  Category  │  │  Pokemon   │   │
              │  _id       │◄─┤  _id       │   │
              │  projectId │  │  projectId │───┘
              └────────────┘  │  categoryId│
                              │  files[]   │
                              └────────────┘
```

## Request/Response Cycle

```
1. Browser Request
   ↓
2. Axios Interceptor (adds JWT)
   ↓
3. NestJS Controller receives
   ↓
4. JwtAuthGuard validates token
   ↓
5. ValidationPipe validates DTO
   ↓
6. Service processes business logic
   ↓
7. Mongoose queries MongoDB
   ↓
8. Service returns data
   ↓
9. Controller sends response
   ↓
10. Axios Interceptor (handles errors)
    ↓
11. Component receives data
    ↓
12. Store updates
    ↓
13. UI re-renders
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  HTTPS (in production)                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  CORS (only allow frontend origin)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  JWT Authentication                     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Ownership Verification                 │
│  (user can only access own data)        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Input Validation (DTOs)                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Business Logic                         │
└─────────────────────────────────────────┘
```

## State Management Flow

```
┌──────────────────────────────────────────┐
│         Svelte Stores (Global)           │
│                                          │
│  authStore                               │
│  ├── user: User | null                   │
│  ├── token: string | null                │
│  └── isAuthenticated: boolean            │
│                                          │
│  selectedProjectStore: Project | null    │
│  categoriesStore: Category[]             │
│  pokemonStore: Pokemon[]                 │
│  selectedCategoryStore: string | null    │
│  selectedPokemonStore: Pokemon | null    │
└──────────────────┬───────────────────────┘
                   │
    ┌──────────────┴─────────────┐
    │                            │
    ▼                            ▼
Components                  Persistent
subscribe                   Storage
to changes                  (localStorage)
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production                            │
│                                                          │
│  ┌──────────────────┐          ┌──────────────────┐    │
│  │   Vercel/Netlify │          │  Railway/Render  │    │
│  │    (Frontend)    │◄────────►│    (Backend)     │    │
│  │  SvelteKit Build │   HTTPS  │   NestJS API     │    │
│  └──────────────────┘          └────────┬─────────┘    │
│                                          │              │
│                              ┌───────────┴──────────┐   │
│                              │                      │   │
│                              ▼                      ▼   │
│                    ┌─────────────────┐  ┌──────────────┐
│                    │ MongoDB Atlas   │  │ Cloudinary   │
│                    │  (Database)     │  │ (CDN)        │
│                    └─────────────────┘  └──────────────┘
└─────────────────────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                 │
│  Svelte Components, Skeleton UI, Tailwind   │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│           Application Layer                  │
│  SvelteKit Routes, Stores, API Client       │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│             API Layer                        │
│  NestJS Controllers, Guards, Pipes          │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│           Business Logic Layer               │
│  NestJS Services, DTOs, Validation          │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│            Data Layer                        │
│  Mongoose Schemas, MongoDB, Cloudinary      │
└─────────────────────────────────────────────┘
```

---

This architecture provides:
✓ Clear separation of concerns
✓ Scalable and maintainable structure
✓ Security at multiple layers
✓ Efficient data flow
✓ Cloud-native design
