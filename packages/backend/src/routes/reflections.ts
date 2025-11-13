import { FastifyInstance } from 'fastify';
import { createReflectionSchema, paginationSchema, dateRangeSchema } from '@blagotron/shared';
import prisma from '../lib/db';
import { requireAuth } from '../lib/auth';

export async function reflectionsRoutes(fastify: FastifyInstance) {
  // List reflections
  fastify.get('/', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const query = request.query as any;
    const pagination = paginationSchema.parse(query);
    const dateRange = dateRangeSchema.parse(query);
    const tag = query.tag;

    const where = {
      userId,
      ...(dateRange.startDate || dateRange.endDate
        ? {
            timestamp: {
              ...(dateRange.startDate && { gte: new Date(dateRange.startDate) }),
              ...(dateRange.endDate && { lte: new Date(dateRange.endDate) })
            }
          }
        : {}),
      ...(tag && { tags: { has: tag } })
    };

    const [reflections, totalCount] = await Promise.all([
      prisma.reflection.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize
      }),
      prisma.reflection.count({ where })
    ]);

    return reply.send({
      success: true,
      data: reflections,
      meta: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pagination.pageSize)
      }
    });
  });

  // Get reflection by ID
  fastify.get('/:id', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);
    const { id } = request.params as { id: string };

    const reflection = await prisma.reflection.findFirst({
      where: { id, userId }
    });

    if (!reflection) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Reflection not found'
        }
      });
    }

    return reply.send({
      success: true,
      data: reflection
    });
  });

  // Create reflection
  fastify.post('/', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const body = createReflectionSchema.parse(request.body);

    const reflection = await prisma.reflection.create({
      data: {
        userId,
        promptId: body.promptId || null,
        prompt: body.prompt || null,
        response: body.response,
        tags: body.tags || [],
        mood: body.mood || null
      }
    });

    return reply.status(201).send({
      success: true,
      data: reflection
    });
  });

  // Update reflection
  fastify.patch('/:id', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);
    const { id } = request.params as { id: string };

    const body = request.body as any;

    const existing = await prisma.reflection.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Reflection not found'
        }
      });
    }

    const reflection = await prisma.reflection.update({
      where: { id },
      data: {
        ...(body.response && { response: body.response }),
        ...(body.tags && { tags: body.tags }),
        ...(body.mood !== undefined && { mood: body.mood })
      }
    });

    return reply.send({
      success: true,
      data: reflection
    });
  });

  // Delete reflection
  fastify.delete('/:id', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);
    const { id } = request.params as { id: string };

    const existing = await prisma.reflection.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Reflection not found'
        }
      });
    }

    await prisma.reflection.delete({ where: { id } });

    return reply.send({
      success: true,
      data: { message: 'Reflection deleted successfully' }
    });
  });

  // Search reflections
  fastify.get('/search', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const query = request.query as any;
    const searchQuery = query.q || '';
    const pagination = paginationSchema.parse(query);

    if (!searchQuery) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Search query is required'
        }
      });
    }

    const [reflections, totalCount] = await Promise.all([
      prisma.reflection.findMany({
        where: {
          userId,
          OR: [
            { response: { contains: searchQuery, mode: 'insensitive' } },
            { prompt: { contains: searchQuery, mode: 'insensitive' } }
          ]
        },
        orderBy: { timestamp: 'desc' },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize
      }),
      prisma.reflection.count({
        where: {
          userId,
          OR: [
            { response: { contains: searchQuery, mode: 'insensitive' } },
            { prompt: { contains: searchQuery, mode: 'insensitive' } }
          ]
        }
      })
    ]);

    return reply.send({
      success: true,
      data: reflections,
      meta: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pagination.pageSize)
      }
    });
  });

  // Get daily prompt
  fastify.get('/prompts/daily', async (request, reply) => {
    const prompts = await prisma.reflectionPrompt.findMany({
      where: {
        frequency: 'daily',
        active: true
      }
    });

    if (prompts.length === 0) {
      return reply.send({
        success: true,
        data: null
      });
    }

    // Return random prompt
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    return reply.send({
      success: true,
      data: randomPrompt
    });
  });
}
