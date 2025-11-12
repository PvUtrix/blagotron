# Technical Architecture Specification

## System Overview

Blagotron is built as a distributed system with multiple client applications connecting to a centralized backend API. The architecture prioritizes user privacy, data portability, and cross-platform consistency.

## Architecture Principles

1. **API-First**: All functionality exposed through well-documented REST/GraphQL APIs
2. **Privacy-First**: End-to-end encryption for sensitive data, minimal data collection
3. **Offline-First**: Clients work offline with sync when connected
4. **Microservices**: Loosely coupled services for scalability and maintainability
5. **Progressive Enhancement**: Core features work everywhere, enhanced features where supported
6. **Open Standards**: Use standard protocols and data formats for interoperability

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├──────────────────┬────────────────┬─────────────────────────┤
│   Web App        │  Telegram Bot  │  Telegram Mini App      │
│   (React/Next.js)│  (Node.js)     │  (React/TWA)            │
└────────┬─────────┴────────┬───────┴──────────┬──────────────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                ┌───────────▼───────────┐
                │   API Gateway         │
                │   (Authentication,    │
                │    Rate Limiting,     │
                │    Routing)           │
                └───────────┬───────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼─────┐    ┌──────▼──────┐    ┌─────▼──────┐
    │  User    │    │  Content    │    │ Analytics  │
    │  Service │    │  Service    │    │ Service    │
    └────┬─────┘    └──────┬──────┘    └─────┬──────┘
         │                 │                  │
    ┌────▼─────┐    ┌──────▼──────┐    ┌─────▼──────┐
    │  Goals   │    │  Community  │    │ Integration│
    │  Service │    │  Service    │    │ Service    │
    └────┬─────┘    └──────┬──────┘    └─────┬──────┘
         │                 │                  │
         └─────────────────┼──────────────────┘
                           │
                ┌──────────▼──────────┐
                │   Data Layer        │
                ├─────────────────────┤
                │ PostgreSQL (Primary)│
                │ Redis (Cache)       │
                │ S3 (File Storage)   │
                │ TimescaleDB (Metrics)│
                └─────────────────────┘
```

## Technology Stack

### Frontend

#### Web Application
- **Framework**: React with Next.js 14+ (App Router)
- **Language**: TypeScript
- **State Management**: Zustand or Redux Toolkit
- **UI Components**: Tailwind CSS + Headless UI or shadcn/ui
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Recharts or Apache ECharts
- **Forms**: React Hook Form + Zod validation
- **PWA**: Service Workers for offline capability
- **Build**: Vite or Next.js built-in

#### Telegram Bot
- **Framework**: Node.js with Telegraf or Grammy
- **Language**: TypeScript
- **Database Client**: Prisma ORM
- **Job Queue**: Bull or BullMQ
- **Caching**: Redis

#### Telegram Mini App
- **Framework**: React with Telegram WebApp SDK
- **Language**: TypeScript
- **UI**: Telegram UI Kit or custom responsive design
- **State**: Zustand + IndexedDB for offline
- **Build**: Vite

### Backend

#### API Gateway
- **Framework**: Node.js with Express or Fastify, OR Go with Gin/Fiber
- **Authentication**: JWT with refresh tokens
- **Rate Limiting**: Redis-based token bucket
- **API Documentation**: OpenAPI/Swagger
- **Monitoring**: Prometheus + Grafana

#### Microservices
- **Language**: Node.js (TypeScript) or Go
- **Framework**:
  - Node: NestJS for complex services, Fastify for lightweight
  - Go: Gin or Fiber for HTTP, gRPC for inter-service communication
- **Communication**:
  - REST for external APIs
  - gRPC for inter-service (high performance)
  - Message Queue (RabbitMQ or NATS) for async operations
- **Database ORM**:
  - Node: Prisma
  - Go: GORM or sqlc

### Data Layer

#### Primary Database: PostgreSQL 15+
- **Purpose**: Main data store for users, goals, activities, reflections
- **Schema**:
  ```
  - users
  - profiles
  - goals
  - activities
  - reflections
  - life_balance_snapshots
  - energy_logs
  - relationships (peer connections)
  - content (articles, research, activities)
  ```
- **Features**: JSONB for flexible data, full-text search, row-level security

#### Time-Series Database: TimescaleDB (PostgreSQL extension)
- **Purpose**: High-performance storage for metrics and time-series data
- **Data**: Energy levels, biorhythm data, wearable data, patterns

#### Cache: Redis 7+
- **Purpose**: Session storage, rate limiting, job queues, real-time data
- **Features**: Pub/Sub for real-time updates, sorted sets for leaderboards

#### File Storage: S3-Compatible
- **Purpose**: User uploads, exports, backups
- **Options**: AWS S3, MinIO (self-hosted), Backblaze B2
- **Structure**: Encrypted at rest, per-user folders

#### Search: PostgreSQL Full-Text or Elasticsearch
- **Purpose**: Search across activities, reflections, content
- **Choice**: Start with PostgreSQL FTS, migrate to Elasticsearch if needed

### Infrastructure

#### Hosting Options
1. **Cloud-Native**: AWS/GCP/Azure
   - ECS/EKS for containers
   - RDS for PostgreSQL
   - ElastiCache for Redis
   - S3 for storage

2. **Platform-as-a-Service**: Railway, Render, Fly.io
   - Simpler deployment for MVP
   - Built-in scaling
   - Lower initial complexity

3. **Self-Hosted**: Docker Compose → Kubernetes
   - Full control
   - Cost-effective at scale
   - Requires DevOps expertise

#### Deployment
- **Containerization**: Docker
- **Orchestration**: Kubernetes or Docker Swarm
- **CI/CD**: GitHub Actions or GitLab CI
- **Monitoring**: Prometheus, Grafana, Sentry (errors)
- **Logging**: ELK Stack or Grafana Loki

### Development Tools
- **Monorepo**: Turborepo or Nx
- **Package Manager**: pnpm or yarn
- **Code Quality**: ESLint, Prettier, Husky (pre-commit hooks)
- **Testing**:
  - Unit: Jest or Vitest
  - Integration: Supertest
  - E2E: Playwright or Cypress
- **API Testing**: Postman or Bruno

## Service Breakdown

### 1. User Service
**Responsibilities**:
- User authentication and authorization
- Profile management
- User preferences and settings
- Account lifecycle (creation, deletion, export)

**Endpoints**:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /users/me`
- `PATCH /users/me`
- `GET /users/me/export`
- `DELETE /users/me`

**Database Tables**:
- `users` (id, email, password_hash, created_at, etc.)
- `profiles` (user_id, display_name, timezone, preferences_json)
- `sessions` (session_id, user_id, expires_at)

### 2. Goals Service
**Responsibilities**:
- Goal creation and management
- Life balance wheel
- Progress tracking
- Values and vision management

**Endpoints**:
- `GET /goals`
- `POST /goals`
- `PATCH /goals/:id`
- `DELETE /goals/:id`
- `GET /goals/:id/progress`
- `GET /life-balance`
- `POST /life-balance/snapshots`
- `GET /values`
- `PATCH /values`

**Database Tables**:
- `goals` (id, user_id, title, description, domain, timeline, status)
- `goal_progress` (goal_id, timestamp, progress_percent, notes)
- `life_balance_snapshots` (user_id, timestamp, domain_scores_json)
- `values` (user_id, value, rank, notes)

### 3. Activity Service
**Responsibilities**:
- Activity logging
- Energy and flow tracking
- Activity library and suggestions
- Time tracking

**Endpoints**:
- `POST /activities/log`
- `GET /activities`
- `GET /activities/energy-patterns`
- `GET /activities/library`
- `GET /activities/suggestions`
- `POST /activities/library` (user contributions)

**Database Tables**:
- `activity_logs` (id, user_id, activity_type, timestamp, duration, energy_delta, flow_metrics_json)
- `activity_library` (id, title, description, time_required, domain, energy_level)
- `user_activities` (user contributions)

### 4. Reflection Service
**Responsibilities**:
- Journaling and reflection prompts
- Coaching questions
- Reflection history and search

**Endpoints**:
- `POST /reflections`
- `GET /reflections`
- `GET /reflections/search?q=`
- `GET /reflection-prompts/daily`
- `GET /reflection-prompts/weekly`

**Database Tables**:
- `reflections` (id, user_id, timestamp, prompt, response, tags)
- `reflection_prompts` (id, prompt_text, frequency, category)

### 5. Analytics Service
**Responsibilities**:
- Pattern recognition
- Insights generation
- Dashboard data aggregation
- Progress reports

**Endpoints**:
- `GET /analytics/dashboard`
- `GET /analytics/patterns/energy`
- `GET /analytics/patterns/productivity`
- `GET /analytics/insights`
- `GET /analytics/reports/weekly`
- `GET /analytics/reports/monthly`

**Database**: Primarily reads from other services' data, writes to TimescaleDB for aggregated metrics

### 6. Content Service
**Responsibilities**:
- Research articles and education
- Day-in-the-life examples
- Skills and career information
- Learning resources

**Endpoints**:
- `GET /content/research`
- `GET /content/research/:id`
- `GET /content/routines`
- `GET /content/skills`
- `GET /content/learning-resources`

**Database Tables**:
- `content` (id, type, title, body, source, tags)
- `skills` (id, name, category, description, learning_paths)
- `learning_resources` (id, skill_id, title, url, type, rating)

### 7. Community Service
**Responsibilities**:
- Peer connections and matching
- Groups and challenges
- Accountability partnerships
- User-generated content moderation

**Endpoints**:
- `GET /community/peers`
- `POST /community/connections`
- `GET /community/groups`
- `POST /community/groups/:id/join`
- `GET /accountability/partners`
- `POST /accountability/check-in`

**Database Tables**:
- `connections` (user_id_1, user_id_2, connection_type, status)
- `groups` (id, name, description, type, member_count)
- `group_members` (group_id, user_id, role)
- `accountability_partnerships` (id, user_ids, goal_ids, frequency)

### 8. Integration Service
**Responsibilities**:
- Calendar sync (Google, Apple, Outlook)
- Wearable data import (Fitbit, Apple Health, Garmin)
- Productivity tool integration (Notion, Todoist)
- OAuth flows

**Endpoints**:
- `POST /integrations/calendar/connect`
- `GET /integrations/calendar/events`
- `POST /integrations/wearables/sync`
- `GET /integrations/available`

**Database Tables**:
- `integrations` (user_id, service, credentials_encrypted, status)
- `sync_status` (integration_id, last_sync, next_sync, status)

### 9. Notification Service
**Responsibilities**:
- Email notifications
- Telegram messages
- Push notifications (PWA)
- Reminder scheduling

**Endpoints**:
- `POST /notifications/send`
- `GET /notifications/preferences`
- `PATCH /notifications/preferences`

**Technology**:
- Email: SendGrid or Postmark
- Queue: RabbitMQ or Bull
- Scheduling: Cron jobs or node-schedule

## Data Models

### Core Entities

#### User
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  status: 'active' | 'suspended' | 'deleted';
}

interface Profile {
  userId: string;
  displayName: string;
  timezone: string;
  language: string;
  preferences: {
    lifeDomains: string[];
    notificationSettings: object;
    privacySettings: object;
  };
}
```

#### Goal
```typescript
interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  domain: string; // career, health, relationships, etc.
  timeline: 'short' | 'medium' | 'long'; // <3mo, 3-12mo, >12mo
  targetDate: Date | null;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  progressPercent: number;
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt: Date | null;
}
```

#### Activity Log
```typescript
interface ActivityLog {
  id: string;
  userId: string;
  activityType: string;
  timestamp: Date;
  duration: number; // minutes
  energyDelta: number; // -3 to +3
  flowMetrics: {
    challengeLevel: number; // 1-10
    skillLevel: number; // 1-10
    engagement: number; // 1-10
  };
  context: {
    location?: string;
    people?: string[];
    mood?: string;
    tags: string[];
  };
  notes?: string;
}
```

#### Life Balance Snapshot
```typescript
interface LifeBalanceSnapshot {
  id: string;
  userId: string;
  timestamp: Date;
  scores: {
    [domain: string]: number; // 0-10
  };
  notes?: string;
}
```

#### Reflection
```typescript
interface Reflection {
  id: string;
  userId: string;
  timestamp: Date;
  promptId?: string;
  prompt?: string;
  response: string;
  tags: string[];
  mood?: string;
}
```

## Security Architecture

### Authentication
- **JWT**: Access tokens (15 min expiry) + Refresh tokens (30 day expiry)
- **Password**: bcrypt hashing (cost factor 12+)
- **2FA**: Optional TOTP for sensitive accounts
- **OAuth**: Support for Google, Apple sign-in

### Authorization
- **RBAC**: Role-based access control (user, premium, admin)
- **Row-Level Security**: PostgreSQL RLS for data isolation
- **API Keys**: For integrations, rotatable

### Data Protection
- **Encryption at Rest**: Database encryption, encrypted S3 buckets
- **Encryption in Transit**: TLS 1.3 for all connections
- **PII Handling**: Minimal collection, pseudonymization where possible
- **Data Retention**: User-controlled, default 2 year rolling window with option to extend or delete

### Privacy
- **GDPR Compliance**: Data export, deletion, consent management
- **Anonymous Usage**: Option to use without email (Telegram-only mode)
- **Data Minimization**: Only collect what's necessary
- **Transparency**: Clear data usage policies

## Scalability Considerations

### Horizontal Scaling
- **Stateless Services**: All application services are stateless
- **Load Balancing**: Application-level load balancer (Nginx, HAProxy)
- **Database Replicas**: Read replicas for query distribution
- **Caching**: Redis for hot data, CDN for static assets

### Performance Optimization
- **Database Indexing**: Strategic indexes on frequent queries
- **Query Optimization**: EXPLAIN ANALYZE for slow queries
- **Connection Pooling**: PgBouncer for PostgreSQL
- **Async Processing**: Background jobs for heavy operations
- **Pagination**: Cursor-based pagination for large datasets

### Monitoring & Observability
- **Metrics**: Prometheus with Grafana dashboards
- **Logging**: Structured logging (JSON), centralized with Loki or ELK
- **Tracing**: Distributed tracing with Jaeger or Zipkin
- **Alerting**: PagerDuty or Opsgenie for critical issues
- **Uptime**: UptimeRobot or Pingdom

## Development Workflow

### Local Development
```bash
# Start all services with Docker Compose
docker-compose up -d

# Run specific service
pnpm --filter @blagotron/web dev

# Run tests
pnpm test

# Database migrations
pnpm migrate:dev
```

### Environments
1. **Local**: Developer machines, Docker Compose
2. **Development**: Shared dev environment, auto-deploy from `develop` branch
3. **Staging**: Production mirror, deploy from release candidates
4. **Production**: Live system, deploy from `main` branch after approval

### Database Migrations
- **Tool**: Prisma Migrate or golang-migrate
- **Strategy**: Backward-compatible migrations, rollback plan for each
- **Review**: All migrations peer-reviewed before staging

### API Versioning
- **Strategy**: URI versioning (`/api/v1/`, `/api/v2/`)
- **Deprecation**: 6-month notice, maintain 2 versions concurrently
- **Documentation**: Version-specific docs with migration guides

## Disaster Recovery

### Backup Strategy
- **Database**: Daily full backups, hourly incremental
- **Files**: S3 versioning enabled, cross-region replication
- **Retention**: 30 days rolling, quarterly archives for 2 years
- **Testing**: Monthly restore drills

### High Availability
- **Database**: Multi-AZ deployment with automatic failover
- **Application**: Multi-region deployment (future)
- **Monitoring**: Health checks every 30 seconds
- **Failover**: Automated with 5-minute RTO target

## Cost Optimization

### Initial (MVP)
- **Hosting**: Platform-as-a-Service (Railway/Render) - $50-100/mo
- **Database**: Managed PostgreSQL - $25/mo
- **Storage**: S3 or equivalent - $10/mo
- **Email**: SendGrid free tier → $20/mo
- **Total**: ~$100-150/mo for 100-1000 users

### Growth Phase
- **Hosting**: Containerized on AWS/GCP - $200-500/mo
- **Database**: Scaled RDS - $100-300/mo
- **CDN**: CloudFlare or CloudFront - $50/mo
- **Monitoring**: Grafana Cloud/Datadog - $100/mo
- **Total**: ~$500-1000/mo for 10k-100k users

### Optimization Strategies
- **Caching**: Reduce database load by 70%+
- **CDN**: Reduce bandwidth costs by 80%+
- **Reserved Instances**: 40% savings on compute
- **Auto-scaling**: Scale down during low usage (nights, weekends)
- **Data Lifecycle**: Archive old data to cheaper storage tiers

## Technology Decisions Rationale

### Why PostgreSQL?
- Mature, reliable, feature-rich
- JSONB for flexibility without sacrificing relational integrity
- Full-text search built-in
- TimescaleDB extension for time-series data
- Strong community and tooling

### Why TypeScript?
- Type safety reduces bugs
- Better IDE support and refactoring
- Gradual adoption if needed
- Strong ecosystem for both frontend and backend

### Why Microservices?
- Independent scaling of services
- Team autonomy (can work on services independently)
- Technology flexibility per service
- Fault isolation
- Gradual migration path (start monolithic, split as needed)

### Why REST over GraphQL initially?
- Simpler to implement and debug
- Better caching with HTTP
- Easier rate limiting per endpoint
- Can add GraphQL layer later if complexity warrants

### Why Multiple Client Platforms?
- **Web**: Rich feature set, no install friction
- **Telegram Bot**: Lowest friction entry, conversational interface
- **Telegram Mini App**: Mobile experience without app store hurdles
- Covers 90%+ of use cases without native mobile apps initially

## Future Considerations

### Mobile Native Apps
- React Native or Flutter if user demand justifies
- Share business logic with web (TypeScript)
- Better offline experience and native integrations

### AI/ML Features
- Personalized recommendations (collaborative filtering)
- Predictive insights (time series forecasting)
- Natural language processing for reflections
- Anomaly detection for well-being signals

### Real-time Features
- Live collaborative planning sessions
- Real-time peer check-ins
- WebSocket or Server-Sent Events

### Advanced Analytics
- Causal inference for intervention effectiveness
- Cohort analysis for feature adoption
- A/B testing framework for UX improvements

### Enterprise Features
- Team/organization accounts
- Admin dashboards
- Custom integrations
- White-label options

---

*This architecture is designed to evolve. Start simple, measure, and scale based on actual usage patterns and user needs.*
