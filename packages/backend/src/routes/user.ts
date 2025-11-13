import { FastifyInstance } from 'fastify';
import prisma from '../lib/db';
import { requireAuth } from '../lib/auth';

export async function userRoutes(fastify: FastifyInstance) {
  // Get current user
  fastify.get('/me', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    return reply.send({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        profile: user.profile
      }
    });
  });

  // Update profile
  fastify.patch('/me', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const body = request.body as any;

    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        ...(body.displayName && { displayName: body.displayName }),
        ...(body.timezone && { timezone: body.timezone }),
        ...(body.language && { language: body.language }),
        ...(body.preferences && { preferences: body.preferences })
      }
    });

    return reply.send({
      success: true,
      data: profile
    });
  });

  // Export user data
  fastify.get('/me/export', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const [user, goals, activities, lifeBalance, reflections] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      }),
      prisma.goal.findMany({ where: { userId } }),
      prisma.activityLog.findMany({ where: { userId } }),
      prisma.lifeBalanceSnapshot.findMany({ where: { userId } }),
      prisma.reflection.findMany({ where: { userId } })
    ]);

    return reply.send({
      success: true,
      data: {
        user,
        goals,
        activities,
        lifeBalance,
        reflections,
        exportedAt: new Date().toISOString()
      }
    });
  });

  // Delete account
  fastify.delete('/me', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    await prisma.user.update({
      where: { id: userId },
      data: { status: 'deleted' }
    });

    return reply.send({
      success: true,
      data: { message: 'Account deleted successfully' }
    });
  });
}
