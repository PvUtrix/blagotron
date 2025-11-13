import bcrypt from 'bcrypt';
import { FastifyRequest } from 'fastify';
import { JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '@blagotron/shared';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getTokenExpiry(seconds: number): Date {
  return new Date(Date.now() + seconds * 1000);
}

export async function getUserFromRequest(request: FastifyRequest): Promise<{ userId: string } | null> {
  try {
    await request.jwtVerify();
    return request.user as { userId: string };
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: FastifyRequest): { userId: string } {
  const user = request.user as { userId: string } | undefined;
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
