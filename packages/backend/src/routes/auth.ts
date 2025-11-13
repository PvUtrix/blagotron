import { FastifyInstance } from 'fastify';
import { registerSchema, loginSchema } from '@blagotron/shared';
import { JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '@blagotron/shared';
import prisma from '../lib/db';
import { hashPassword, verifyPassword, getTokenExpiry } from '../lib/auth';
import { randomBytes } from 'crypto';

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'DUPLICATE',
          message: 'Email already registered'
        }
      });
    }

    // Hash password
    const passwordHash = await hashPassword(body.password);

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        profile: {
          create: {
            displayName: body.displayName,
            preferences: {
              lifeDomains: [
                'career',
                'health',
                'relationships',
                'personal-growth',
                'finances',
                'recreation',
                'environment',
                'contribution'
              ],
              notificationSettings: {
                email: true,
                telegram: false,
                dailyCheckIn: true,
                weeklyReview: true,
                goalReminders: true
              },
              privacySettings: {
                shareProfile: false,
                sharePeerLearning: false,
                dataCollection: true
              }
            }
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Generate tokens
    const accessToken = fastify.jwt.sign(
      { userId: user.id },
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = randomBytes(32).toString('hex');
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: getTokenExpiry(REFRESH_TOKEN_EXPIRES_IN)
      }
    });

    return reply.send({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: JWT_EXPIRES_IN
        }
      }
    });
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: { profile: true }
    });

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password'
        }
      });
    }

    // Verify password
    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password'
        }
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return reply.status(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Account is not active'
        }
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate tokens
    const accessToken = fastify.jwt.sign(
      { userId: user.id },
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = randomBytes(32).toString('hex');
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: getTokenExpiry(REFRESH_TOKEN_EXPIRES_IN)
      }
    });

    return reply.send({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: JWT_EXPIRES_IN
        }
      }
    });
  });

  // Refresh token
  fastify.post('/refresh', async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken: string };

    if (!refreshToken) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Refresh token is required'
        }
      });
    }

    // Find refresh token
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { profile: true } } }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired refresh token'
        }
      });
    }

    // Generate new tokens
    const accessToken = fastify.jwt.sign(
      { userId: storedToken.userId },
      { expiresIn: JWT_EXPIRES_IN }
    );

    const newRefreshToken = randomBytes(32).toString('hex');

    // Delete old token and create new one
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { id: storedToken.id } }),
      prisma.refreshToken.create({
        data: {
          userId: storedToken.userId,
          token: newRefreshToken,
          expiresAt: getTokenExpiry(REFRESH_TOKEN_EXPIRES_IN)
        }
      })
    ]);

    return reply.send({
      success: true,
      data: {
        user: {
          id: storedToken.user.id,
          email: storedToken.user.email,
          profile: storedToken.user.profile
        },
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn: JWT_EXPIRES_IN
        }
      }
    });
  });

  // Logout
  fastify.post('/logout', async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken: string };

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      });
    }

    return reply.send({
      success: true,
      data: { message: 'Logged out successfully' }
    });
  });
}
