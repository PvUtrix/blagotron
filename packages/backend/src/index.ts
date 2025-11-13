import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth';
import { goalsRoutes } from './routes/goals';
import { activitiesRoutes } from './routes/activities';
import { lifeBalanceRoutes } from './routes/life-balance';
import { reflectionsRoutes } from './routes/reflections';
import { userRoutes } from './routes/user';
import prisma from './lib/db';

const fastify = Fastify({
  logger: true
});

// Register plugins
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(userRoutes, { prefix: '/api/users' });
fastify.register(goalsRoutes, { prefix: '/api/goals' });
fastify.register(activitiesRoutes, { prefix: '/api/activities' });
fastify.register(lifeBalanceRoutes, { prefix: '/api/life-balance' });
fastify.register(reflectionsRoutes, { prefix: '/api/reflections' });

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);

  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.validation
      }
    });
  }

  if (error.message === 'Unauthorized') {
    return reply.status(401).send({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
  }

  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }
  });
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`🚀 Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  await fastify.close();
  process.exit(0);
});

start();
