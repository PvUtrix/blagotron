import { z } from 'zod';

// User validators
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Goal validators
export const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  domain: z.enum([
    'career',
    'health',
    'relationships',
    'personal-growth',
    'finances',
    'recreation',
    'environment',
    'contribution'
  ]),
  timeline: z.enum(['short', 'medium', 'long']),
  targetDate: z.string().datetime().optional().nullable(),
  milestones: z.array(z.object({
    title: z.string().min(1).max(200)
  })).optional()
});

export const updateGoalSchema = createGoalSchema.partial().extend({
  status: z.enum(['active', 'paused', 'completed', 'abandoned']).optional(),
  progressPercent: z.number().min(0).max(100).optional()
});

// Activity validators
export const logActivitySchema = z.object({
  activityType: z.string().min(1, 'Activity type is required'),
  timestamp: z.string().datetime().optional(),
  duration: z.number().min(0).max(1440), // max 24 hours in minutes
  energyDelta: z.number().min(-3).max(3),
  flowMetrics: z.object({
    challengeLevel: z.number().min(1).max(10),
    skillLevel: z.number().min(1).max(10),
    engagement: z.number().min(1).max(10)
  }).optional().nullable(),
  context: z.object({
    location: z.string().optional(),
    people: z.array(z.string()).optional(),
    mood: z.string().optional(),
    tags: z.array(z.string()).default([])
  }).optional(),
  notes: z.string().max(1000).optional().nullable()
});

// Life Balance validators
export const lifeBalanceSnapshotSchema = z.object({
  scores: z.record(
    z.enum([
      'career',
      'health',
      'relationships',
      'personal-growth',
      'finances',
      'recreation',
      'environment',
      'contribution'
    ]),
    z.number().min(0).max(10)
  ),
  notes: z.string().max(1000).optional().nullable()
});

// Reflection validators
export const createReflectionSchema = z.object({
  promptId: z.string().uuid().optional().nullable(),
  prompt: z.string().optional().nullable(),
  response: z.string().min(1, 'Response is required'),
  tags: z.array(z.string()).default([]),
  mood: z.string().optional().nullable()
});

// Query validators
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20)
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});
