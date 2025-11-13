import { FastifyInstance } from 'fastify';
import { logActivitySchema, paginationSchema, dateRangeSchema } from '@blagotron/shared';
import prisma from '../lib/db';
import { requireAuth } from '../lib/auth';

export async function activitiesRoutes(fastify: FastifyInstance) {
  // List activities
  fastify.get('/', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const query = request.query as any;
    const pagination = paginationSchema.parse(query);
    const dateRange = dateRangeSchema.parse(query);

    const where = {
      userId,
      ...(dateRange.startDate || dateRange.endDate
        ? {
            timestamp: {
              ...(dateRange.startDate && { gte: new Date(dateRange.startDate) }),
              ...(dateRange.endDate && { lte: new Date(dateRange.endDate) })
            }
          }
        : {})
    };

    const [activities, totalCount] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize
      }),
      prisma.activityLog.count({ where })
    ]);

    return reply.send({
      success: true,
      data: activities,
      meta: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pagination.pageSize)
      }
    });
  });

  // Log activity
  fastify.post('/log', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const body = logActivitySchema.parse(request.body);

    const activity = await prisma.activityLog.create({
      data: {
        userId,
        activityType: body.activityType,
        timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
        duration: body.duration,
        energyDelta: body.energyDelta,
        flowMetrics: body.flowMetrics || null,
        context: body.context || {},
        notes: body.notes || null
      }
    });

    return reply.status(201).send({
      success: true,
      data: activity
    });
  });

  // Get activity by ID
  fastify.get('/:id', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);
    const { id } = request.params as { id: string };

    const activity = await prisma.activityLog.findFirst({
      where: { id, userId }
    });

    if (!activity) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Activity not found'
        }
      });
    }

    return reply.send({
      success: true,
      data: activity
    });
  });

  // Update activity
  fastify.patch('/:id', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);
    const { id } = request.params as { id: string };

    const body = request.body as any;

    // Check if activity belongs to user
    const existing = await prisma.activityLog.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Activity not found'
        }
      });
    }

    const activity = await prisma.activityLog.update({
      where: { id },
      data: {
        ...(body.activityType && { activityType: body.activityType }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.energyDelta !== undefined && { energyDelta: body.energyDelta }),
        ...(body.flowMetrics !== undefined && { flowMetrics: body.flowMetrics }),
        ...(body.context && { context: body.context }),
        ...(body.notes !== undefined && { notes: body.notes })
      }
    });

    return reply.send({
      success: true,
      data: activity
    });
  });

  // Delete activity
  fastify.delete('/:id', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);
    const { id } = request.params as { id: string };

    const existing = await prisma.activityLog.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Activity not found'
        }
      });
    }

    await prisma.activityLog.delete({ where: { id } });

    return reply.send({
      success: true,
      data: { message: 'Activity deleted successfully' }
    });
  });

  // Get energy patterns
  fastify.get('/patterns/energy', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const query = request.query as any;
    const dateRange = dateRangeSchema.parse(query);

    const where = {
      userId,
      ...(dateRange.startDate || dateRange.endDate
        ? {
            timestamp: {
              ...(dateRange.startDate && { gte: new Date(dateRange.startDate) }),
              ...(dateRange.endDate && { lte: new Date(dateRange.endDate) })
            }
          }
        : {})
    };

    const activities = await prisma.activityLog.findMany({
      where,
      orderBy: { timestamp: 'asc' },
      select: {
        timestamp: true,
        energyDelta: true,
        activityType: true
      }
    });

    // Calculate average energy by hour of day
    const energyByHour: { [hour: number]: { sum: number; count: number } } = {};
    activities.forEach((activity) => {
      const hour = activity.timestamp.getHours();
      if (!energyByHour[hour]) {
        energyByHour[hour] = { sum: 0, count: 0 };
      }
      energyByHour[hour].sum += activity.energyDelta;
      energyByHour[hour].count += 1;
    });

    const patterns = Object.entries(energyByHour).map(([hour, data]) => ({
      hour: parseInt(hour),
      averageEnergy: data.sum / data.count
    }));

    return reply.send({
      success: true,
      data: {
        patterns: patterns.sort((a, b) => a.hour - b.hour),
        totalActivities: activities.length
      }
    });
  });
}
