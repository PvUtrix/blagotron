import { FastifyInstance } from 'fastify';
import { createGoalSchema, updateGoalSchema } from '@blagotron/shared';
import prisma from '../lib/db';
import { requireAuth } from '../lib/auth';

export async function goalsRoutes(fastify: FastifyInstance) {
  // List goals
  fastify.get('/', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const query = request.query as any;
    const status = query.status || 'active';
    const domain = query.domain;

    const goals = await prisma.goal.findMany({
      where: {
        userId,
        ...(status && { status }),
        ...(domain && { domain })
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send({
      success: true,
      data: goals
    });
  });

  // Get goal by ID
  fastify.get('/:id', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);
    const { id } = request.params as { id: string };

    const goal = await prisma.goal.findFirst({
      where: { id, userId }
    });

    if (!goal) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Goal not found'
        }
      });
    }

    return reply.send({
      success: true,
      data: goal
    });
  });

  // Create goal
  fastify.post('/', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const body = createGoalSchema.parse(request.body);

    const goal = await prisma.goal.create({
      data: {
        userId,
        title: body.title,
        description: body.description || null,
        domain: body.domain,
        timeline: body.timeline,
        targetDate: body.targetDate ? new Date(body.targetDate) : null,
        milestones: body.milestones || []
      }
    });

    return reply.status(201).send({
      success: true,
      data: goal
    });
  });

  // Update goal
  fastify.patch('/:id', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);
    const { id } = request.params as { id: string };

    const body = updateGoalSchema.parse(request.body);

    // Check if goal belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: { id, userId }
    });

    if (!existingGoal) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Goal not found'
        }
      });
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.domain && { domain: body.domain }),
        ...(body.timeline && { timeline: body.timeline }),
        ...(body.targetDate !== undefined && {
          targetDate: body.targetDate ? new Date(body.targetDate) : null
        }),
        ...(body.status && { status: body.status }),
        ...(body.progressPercent !== undefined && { progressPercent: body.progressPercent }),
        ...(body.milestones && { milestones: body.milestones })
      }
    });

    return reply.send({
      success: true,
      data: goal
    });
  });

  // Delete goal
  fastify.delete('/:id', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);
    const { id } = request.params as { id: string };

    // Check if goal belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: { id, userId }
    });

    if (!existingGoal) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Goal not found'
        }
      });
    }

    await prisma.goal.delete({ where: { id } });

    return reply.send({
      success: true,
      data: { message: 'Goal deleted successfully' }
    });
  });
}
