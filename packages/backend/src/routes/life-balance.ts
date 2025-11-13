import { FastifyInstance } from 'fastify';
import { lifeBalanceSnapshotSchema } from '@blagotron/shared';
import prisma from '../lib/db';
import { requireAuth } from '../lib/auth';

export async function lifeBalanceRoutes(fastify: FastifyInstance) {
  // Get latest snapshot
  fastify.get('/latest', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const snapshot = await prisma.lifeBalanceSnapshot.findFirst({
      where: { userId },
      orderBy: { timestamp: 'desc' }
    });

    return reply.send({
      success: true,
      data: snapshot
    });
  });

  // Get snapshot history
  fastify.get('/history', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const snapshots = await prisma.lifeBalanceSnapshot.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50 // Last 50 snapshots
    });

    return reply.send({
      success: true,
      data: snapshots
    });
  });

  // Create snapshot
  fastify.post('/snapshots', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);

    const body = lifeBalanceSnapshotSchema.parse(request.body);

    const snapshot = await prisma.lifeBalanceSnapshot.create({
      data: {
        userId,
        scores: body.scores,
        notes: body.notes || null
      }
    });

    return reply.status(201).send({
      success: true,
      data: snapshot
    });
  });

  // Get specific snapshot
  fastify.get('/snapshots/:id', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);
    const { id } = request.params as { id: string };

    const snapshot = await prisma.lifeBalanceSnapshot.findFirst({
      where: { id, userId }
    });

    if (!snapshot) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Snapshot not found'
        }
      });
    }

    return reply.send({
      success: true,
      data: snapshot
    });
  });

  // Delete snapshot
  fastify.delete('/snapshots/:id', async (request, reply) => {
    await request.jwtVerify();
    const { userId } = requireAuth(request);
    const { id } = request.params as { id: string };

    const existing = await prisma.lifeBalanceSnapshot.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Snapshot not found'
        }
      });
    }

    await prisma.lifeBalanceSnapshot.delete({ where: { id } });

    return reply.send({
      success: true,
      data: { message: 'Snapshot deleted successfully' }
    });
  });
}
