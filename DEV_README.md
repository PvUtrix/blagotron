# Blagotron - Development Guide

## Project Structure

This is a monorepo managed with pnpm workspaces:

```
blagotron/
├── packages/
│   ├── shared/          # Shared types, validators, constants
│   ├── backend/         # Backend API (Fastify + Prisma)
│   ├── web/             # Web application (Next.js 14)
│   ├── telegram-bot/    # Telegram bot (Node.js)
│   └── telegram-mini-app/ # Telegram mini app (React)
├── specs/               # Specifications and documentation
├── docker-compose.yml   # Local development services
└── README.md            # Project overview
```

## Prerequisites

- Node.js 20+ and pnpm 8+
- Docker and Docker Compose
- PostgreSQL 15+ (via Docker or local install)

## Getting Started

### 1. Install Dependencies

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 2. Start Development Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Check services are running
docker-compose ps
```

### 3. Configure Environment

```bash
# Backend environment
cd packages/backend
cp .env.example .env

# Edit .env and set:
# DATABASE_URL="postgresql://blagotron:blagotron_dev_password@localhost:5432/blagotron?schema=public"
# JWT_SECRET="your-random-secret-key-here"
```

### 4. Initialize Database

```bash
# Generate Prisma client
cd packages/backend
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# (Optional) Open Prisma Studio to view database
pnpm prisma:studio
```

### 5. Start Development Servers

```bash
# From root directory

# Start all services in parallel
pnpm dev

# Or start individually:
pnpm backend:dev  # Backend API on http://localhost:3001
pnpm web:dev      # Web app on http://localhost:3000
```

## Development Workflow

### Backend Development

The backend is built with Fastify and Prisma:

```bash
cd packages/backend

# Watch mode (auto-restart on changes)
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Run Prisma Studio (database GUI)
pnpm prisma:studio
```

#### Adding New Database Models

1. Edit `prisma/schema.prisma`
2. Create migration: `pnpm prisma:migrate`
3. Generate client: `pnpm prisma:generate`

#### API Routes

Routes are organized in `src/routes/`:
- `/api/auth` - Authentication (register, login, logout)
- `/api/users` - User profile and settings
- `/api/goals` - Goal management
- `/api/activities` - Activity logging and patterns
- `/api/life-balance` - Life balance snapshots
- `/api/reflections` - Reflections and journaling

### Web Development

The web app is built with Next.js 14 (App Router):

```bash
cd packages/web

# Development mode
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Lint code
pnpm lint
```

#### Key Directories

- `src/app/` - Pages and layouts (App Router)
- `src/components/` - Reusable React components
- `src/lib/` - Utilities, API client, state management
- `src/hooks/` - Custom React hooks

#### State Management

- **Authentication**: Zustand store (`src/lib/store.ts`)
- **Server State**: React Query (TanStack Query)
- **API Client**: Custom client (`src/lib/api.ts`)

### Shared Package

The shared package contains TypeScript types, Zod validators, and constants used across all packages:

```bash
cd packages/shared

# Build (watch mode)
pnpm dev

# Build once
pnpm build
```

## Testing

### Backend Tests

```bash
cd packages/backend
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Web Tests

```bash
cd packages/web
pnpm test
```

## Database Management

### Migrations

```bash
cd packages/backend

# Create new migration
pnpm prisma migrate dev --name descriptive_name

# Apply migrations
pnpm prisma migrate deploy

# Reset database (caution: deletes all data)
pnpm prisma migrate reset
```

### Seeding Data

Create seed script in `packages/backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create seed data
  await prisma.reflectionPrompt.createMany({
    data: [
      {
        promptText: 'What gave you the most energy today?',
        frequency: 'daily',
        category: 'energy',
        active: true
      },
      // Add more prompts...
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run with: `pnpm prisma db seed`

## API Documentation

### Authentication

**POST /api/auth/register**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST /api/auth/refresh**
```json
{
  "refreshToken": "abc123..."
}
```

### Protected Endpoints

All protected endpoints require `Authorization: Bearer <accessToken>` header.

**GET /api/users/me** - Get current user
**PATCH /api/users/me** - Update profile
**GET /api/users/me/export** - Export all user data

**GET /api/goals** - List goals
**POST /api/goals** - Create goal
**GET /api/goals/:id** - Get goal
**PATCH /api/goals/:id** - Update goal
**DELETE /api/goals/:id** - Delete goal

**GET /api/activities** - List activities
**POST /api/activities/log** - Log activity
**GET /api/activities/patterns/energy** - Get energy patterns

**GET /api/life-balance/latest** - Get latest snapshot
**GET /api/life-balance/history** - Get snapshot history
**POST /api/life-balance/snapshots** - Create snapshot

**GET /api/reflections** - List reflections
**POST /api/reflections** - Create reflection
**GET /api/reflections/prompts/daily** - Get daily prompt

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

### Port Already in Use

```bash
# Find process using port 3000 or 3001
lsof -ti:3000
lsof -ti:3001

# Kill process
kill -9 <PID>
```

### Prisma Client Out of Sync

```bash
cd packages/backend
pnpm prisma generate
```

### Clear All Data and Start Fresh

```bash
# Stop services
docker-compose down -v

# Start services
docker-compose up -d

# Reset database
cd packages/backend
pnpm prisma migrate reset
```

## Production Build

### Backend

```bash
cd packages/backend
pnpm build
NODE_ENV=production pnpm start
```

### Web

```bash
cd packages/web
pnpm build
pnpm start
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="random-secret-key"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

### Web (.env.local)

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (run `pnpm prettier --write .`)
- **Linting**: ESLint (run `pnpm lint`)

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

## Resources

- [Fastify Documentation](https://www.fastify.io/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For questions or issues:
1. Check this README and project specs in `/specs`
2. Review existing code and comments
3. Open an issue on GitHub

## License

TBD
