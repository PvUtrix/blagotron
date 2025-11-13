# Blagotron

## Life & Career Design Platform

Blagotron is a comprehensive platform designed to help people design meaningful and fulfilling lives and careers. The name comes from the Russian word "благо" (blago), meaning "good," "blessing," or "benefit."

## Vision

To empower individuals to understand themselves better, set meaningful goals, and create balanced, fulfilling lives through evidence-based methodologies, peer learning, and adaptive life management tools.

## Platform Components

- **Web Application**: Full-featured desktop experience
- **Telegram Bot**: Quick access and notifications
- **Telegram Mini App**: Rich mobile experience within Telegram

## Core Methodology

Based on Stanford's "Designing Your Life" methodology, enhanced with:
- Self-discovery tools (Life Balance Wheel, energy tracking, flow states)
- Evidence-based insights from research on happiness, health, and productivity
- Peer learning and community support
- Adaptive planning based on personal state and context
- Integration with smart devices and productivity tools

## Documentation Structure

- [CONSTITUTION.md](./CONSTITUTION.md) - Core values, principles, and mission
- [specs/](./specs/) - Detailed specifications
  - [core-features.md](./specs/core-features.md) - Feature specifications
  - [architecture.md](./specs/architecture.md) - Technical architecture
  - [user-stories.md](./specs/user-stories.md) - User stories and use cases
  - [platform-components.md](./specs/platform-components.md) - Platform components breakdown
  - [integrations.md](./specs/integrations.md) - Third-party integrations
  - [roadmap.md](./specs/roadmap.md) - Development roadmap

## Project Status

🚧 **Early Development** - MVP in progress

Current implementation:
- ✅ Backend API with authentication, goals, activities, life balance, and reflections
- ✅ PostgreSQL database schema with Prisma ORM
- ✅ Web application with authentication and dashboard
- 🚧 Telegram bot (planned)
- 🚧 Telegram mini app (planned)

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- Docker and Docker Compose

### Setup

```bash
# Clone repository
git clone <repository-url>
cd blagotron

# Install dependencies
pnpm install

# Start development services (PostgreSQL, Redis)
docker-compose up -d

# Setup backend
cd packages/backend
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
pnpm prisma:generate
pnpm prisma:migrate

# Start development servers (from root)
cd ../..
pnpm dev

# Backend: http://localhost:3001
# Web app: http://localhost:3000
```

For detailed development instructions, see [DEV_README.md](./DEV_README.md).

## Repository Structure

```
blagotron/
├── packages/
│   ├── shared/          # Shared TypeScript types and validators
│   ├── backend/         # Fastify API + Prisma
│   ├── web/             # Next.js 14 web application
│   ├── telegram-bot/    # Telegram bot (coming soon)
│   └── telegram-mini-app/ # Telegram mini app (coming soon)
├── specs/               # Detailed specifications
├── docker-compose.yml   # Development services
├── CONSTITUTION.md      # Project values and principles
└── DEV_README.md        # Development guide
```

## Technology Stack

- **Backend**: Node.js, Fastify, Prisma, PostgreSQL
- **Web**: Next.js 14, React, Tailwind CSS, React Query, Zustand
- **Shared**: TypeScript, Zod validation
- **Infrastructure**: Docker, pnpm workspaces

## Contributing

See [DEV_README.md](./DEV_README.md) for development guidelines.

## License

TBD
