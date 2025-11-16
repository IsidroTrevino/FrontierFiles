# Development Guide

## Project Architecture

### Monorepo Structure
```
pokemon-gallery/
├── backend/           # NestJS REST API
│   ├── src/
│   │   ├── auth/      # Authentication (JWT, Passport)
│   │   ├── users/     # User management
│   │   ├── projects/  # Project CRUD
│   │   ├── categories/# Category CRUD
│   │   ├── pokemon/   # Pokemon CRUD + files
│   │   └── cloudinary/# File upload service
│   └── package.json
├── frontend/          # SvelteKit SPA
│   ├── src/
│   │   ├── routes/    # Pages (file-based routing)
│   │   ├── lib/       # Components, stores, API
│   │   │   ├── api/   # Axios client + endpoints
│   │   │   ├── stores/# Svelte stores
│   │   │   └── components/
│   │   └── app.css    # Global styles
│   └── package.json
└── shared/            # TypeScript types
    └── src/index.ts
```

## Key Technologies

### Backend Stack
- **NestJS**: Modern Node.js framework with decorators
- **MongoDB + Mongoose**: NoSQL database with ODM
- **Passport + JWT**: Authentication strategy
- **Cloudinary**: Cloud file storage
- **Multer**: Multipart form data handling

### Frontend Stack
- **SvelteKit**: Full-stack Svelte framework
- **Skeleton UI**: Tailwind-based component library
- **Axios**: HTTP client with interceptors
- **Svelte Stores**: Reactive state management

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials with bcrypt
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Axios interceptor adds token to all requests
7. Backend JWT guard validates token on protected routes

### File Upload Flow
1. User selects files in FileManager component
2. Files sent as FormData to `/api/pokemon/:id/files`
3. Backend Multer middleware processes files
4. CloudinaryService uploads to Cloudinary
5. Backend saves Cloudinary URLs to Pokemon.files array
6. Frontend receives updated Pokemon object
7. UI refreshes to show new files

### Category Filtering Flow
1. User clicks category in sidebar
2. `selectedCategoryStore` is updated
3. Store subscription triggers in gallery page
4. API call: `/api/projects/:projectId/pokemon?categoryId=xxx`
5. Backend filters Pokemon by categoryId
6. Frontend updates `pokemonStore`
7. PokemonGrid re-renders with filtered list

## State Management

### Auth Store
```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean
}
```
- Persisted to localStorage
- Used for: login state, user info, auth token

### Data Stores
```typescript
selectedProjectStore: Project | null
categoriesStore: Category[]
pokemonStore: Pokemon[]
selectedCategoryStore: string | null
selectedPokemonStore: Pokemon | null
```

## API Design Patterns

### RESTful Endpoints
- **Collections**: `/api/projects` (GET all, POST create)
- **Resources**: `/api/projects/:id` (GET one, PATCH update, DELETE remove)
- **Nested**: `/api/projects/:projectId/pokemon`

### Request/Response
```typescript
// Request
POST /api/auth/register
{
  email: "user@example.com",
  password: "secret123",
  name: "John Doe"
}

// Response
{
  user: { _id: "...", email: "...", name: "..." },
  access_token: "eyJhbGciOiJIUzI1NiIs..."
}
```

### Error Handling
```typescript
// Backend throws
throw new NotFoundException('Pokemon not found');

// Frontend catches
catch (error: any) {
  toastStore.trigger({
    message: error.response?.data?.message || 'Failed',
    background: 'variant-filled-error'
  });
}
```

## Component Patterns

### Modal Pattern (Skeleton UI)
```typescript
// Open modal
modalStore.trigger({
  type: 'component',
  component: { ref: CreateProjectModal },
  response: (result: any) => {
    if (result) loadProjects(); // Refresh data
  }
});

// Close modal from component
modalStore.close();
if ($modalStore[0]?.response) {
  $modalStore[0].response(true); // Return result
}
```

### Drawer Pattern
```typescript
// Open drawer
selectedPokemonStore.set(pokemon);
drawerStore.open({});

// In drawer component
<Drawer>
  {#if selectedPokemon}
    <PokemonDrawer {pokemon} />
  {/if}
</Drawer>
```

## Security Best Practices

### Backend
1. **Never expose passwords**: Use `toJSON` transform in schema
2. **Hash passwords**: bcrypt with 10 salt rounds
3. **Validate inputs**: class-validator on all DTOs
4. **Check ownership**: Verify user owns resource before mutation
5. **File validation**: Check size, type before upload

### Frontend
1. **Store token safely**: httpOnly cookies ideal, localStorage okay for demo
2. **Handle 401s**: Redirect to login on auth failure
3. **Sanitize inputs**: Prevent XSS in user-generated content
4. **Validate forms**: Client-side validation for UX

## Database Patterns

### References vs Embedded
```typescript
// Reference (used for userId, projectId, categoryId)
userId: { type: Types.ObjectId, ref: 'User' }

// Embedded (used for files array)
files: [{ name: String, url: String, ... }]
```

### Population
```typescript
// Get pokemon with category details
await pokemonModel
  .find({ projectId })
  .populate('categoryId')  // Joins category data
  .exec();
```

## Performance Optimizations

### Backend
- Index frequently queried fields (userId, projectId)
- Limit file upload size (10MB)
- Use pagination for large datasets (not implemented yet)
- Cache Cloudinary URLs (done automatically)

### Frontend
- Lazy load images with `loading="lazy"`
- Debounce search inputs
- Cache API responses in stores
- Use SvelteKit's preloading

## Testing Strategy

### Backend Tests (Not Implemented - Future)
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend Tests (Not Implemented - Future)
```bash
# Unit tests
npm test

# E2E tests (Playwright)
npm run test:e2e
```

## Debugging Tips

### Backend
1. Add console.logs in controllers/services
2. Use NestJS Logger: `this.logger.log('message')`
3. Check MongoDB queries in Atlas dashboard
4. Test endpoints with Postman/Insomnia
5. Enable verbose logging: `nest start --debug`

### Frontend
1. Use browser DevTools (Console, Network, Application)
2. Check Svelte DevTools extension
3. Log store values: `$: console.log($pokemonStore)`
4. Inspect API requests in Network tab
5. Check localStorage for auth token

### Common Issues

**"Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Port already in use"**
```bash
lsof -ti:3000 | xargs kill  # Kill process on port 3000
lsof -ti:5173 | xargs kill  # Kill process on port 5173
```

**MongoDB connection timeout**
- Check internet connection
- Verify MongoDB Atlas IP whitelist
- Check connection string format

**Cloudinary upload fails**
- Verify credentials in .env
- Check file size (< 10MB)
- Ensure Cloudinary account is active

## Code Style

### Backend (NestJS)
- Use decorators: `@Injectable()`, `@Get()`, etc.
- Dependency injection in constructors
- DTOs for validation
- Services for business logic
- Controllers for routing only

### Frontend (Svelte)
- Reactive declarations: `$: filteredData = data.filter(...)`
- Event dispatching: `createEventDispatcher()`
- Component props: `export let pokemon: Pokemon`
- Stores for global state
- Keep components small and focused

## Deployment Checklist

### Backend
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Enable MongoDB Atlas IP whitelist for production IPs
- [ ] Set up error logging (Sentry, etc.)
- [ ] Configure rate limiting
- [ ] Enable HTTPS
- [ ] Set proper CORS origins

### Frontend
- [ ] Build for production: `npm run build`
- [ ] Set PUBLIC_API_URL to production backend
- [ ] Enable analytics (optional)
- [ ] Configure CDN for static assets
- [ ] Enable HTTPS
- [ ] Set up error tracking

## Useful Resources

- [NestJS Docs](https://docs.nestjs.com)
- [SvelteKit Docs](https://kit.svelte.dev)
- [Skeleton UI Docs](https://www.skeleton.dev)
- [MongoDB Docs](https://docs.mongodb.com)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Passport.js Docs](http://www.passportjs.org)

## Future Enhancements

### Priority 1
- [ ] Add image editing (crop, resize)
- [ ] Implement search functionality
- [ ] Add pagination to pokemon list
- [ ] Bulk file upload progress
- [ ] Drag & drop file upload

### Priority 2
- [ ] Export project as ZIP
- [ ] Share project (public link)
- [ ] User profile settings
- [ ] Email verification
- [ ] Password reset

### Priority 3
- [ ] Real-time collaboration
- [ ] Comments on pokemon
- [ ] Version history for files
- [ ] Tags system (in addition to categories)
- [ ] Advanced filtering (date, size, type)

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test thoroughly
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

Happy coding! 🚀
