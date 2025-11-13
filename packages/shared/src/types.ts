// User types
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  status: 'active' | 'suspended' | 'deleted';
}

export interface Profile {
  userId: string;
  displayName: string;
  timezone: string;
  language: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  lifeDomains: string[];
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  telegram: boolean;
  dailyCheckIn: boolean;
  weeklyReview: boolean;
  goalReminders: boolean;
}

export interface PrivacySettings {
  shareProfile: boolean;
  sharePeerLearning: boolean;
  dataCollection: boolean;
}

// Goal types
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  domain: LifeDomain;
  timeline: 'short' | 'medium' | 'long';
  targetDate: Date | null;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  progressPercent: number;
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt: Date | null;
}

export type LifeDomain =
  | 'career'
  | 'health'
  | 'relationships'
  | 'personal-growth'
  | 'finances'
  | 'recreation'
  | 'environment'
  | 'contribution';

export const DEFAULT_LIFE_DOMAINS: LifeDomain[] = [
  'career',
  'health',
  'relationships',
  'personal-growth',
  'finances',
  'recreation',
  'environment',
  'contribution'
];

// Activity types
export interface ActivityLog {
  id: string;
  userId: string;
  activityType: string;
  timestamp: Date;
  duration: number; // minutes
  energyDelta: number; // -3 to +3
  flowMetrics: FlowMetrics | null;
  context: ActivityContext;
  notes: string | null;
}

export interface FlowMetrics {
  challengeLevel: number; // 1-10
  skillLevel: number; // 1-10
  engagement: number; // 1-10
}

export interface ActivityContext {
  location?: string;
  people?: string[];
  mood?: string;
  tags: string[];
}

// Life Balance types
export interface LifeBalanceSnapshot {
  id: string;
  userId: string;
  timestamp: Date;
  scores: Record<LifeDomain, number>; // 0-10
  notes: string | null;
}

// Reflection types
export interface Reflection {
  id: string;
  userId: string;
  timestamp: Date;
  promptId: string | null;
  prompt: string | null;
  response: string;
  tags: string[];
  mood: string | null;
}

export interface ReflectionPrompt {
  id: string;
  promptText: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
}

// Authentication types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}
