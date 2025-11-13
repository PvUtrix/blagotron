export const LIFE_DOMAIN_LABELS: Record<string, string> = {
  'career': 'Career',
  'health': 'Health',
  'relationships': 'Relationships',
  'personal-growth': 'Personal Growth',
  'finances': 'Finances',
  'recreation': 'Recreation',
  'environment': 'Environment',
  'contribution': 'Contribution'
};

export const LIFE_DOMAIN_COLORS: Record<string, string> = {
  'career': '#3B82F6', // blue
  'health': '#10B981', // green
  'relationships': '#EC4899', // pink
  'personal-growth': '#8B5CF6', // purple
  'finances': '#F59E0B', // amber
  'recreation': '#06B6D4', // cyan
  'environment': '#84CC16', // lime
  'contribution': '#EF4444'  // red
};

export const TIMELINE_LABELS: Record<string, string> = {
  'short': 'Short-term (< 3 months)',
  'medium': 'Medium-term (3-12 months)',
  'long': 'Long-term (> 12 months)'
};

export const ENERGY_LABELS: Record<number, string> = {
  '-3': 'Very draining',
  '-2': 'Draining',
  '-1': 'Slightly draining',
  '0': 'Neutral',
  '1': 'Slightly energizing',
  '2': 'Energizing',
  '3': 'Very energizing'
};

export const DEFAULT_REFLECTION_PROMPTS = [
  'What gave you the most energy today?',
  'What are you grateful for?',
  'What would you do differently?',
  'What did you learn about yourself?',
  'What progress did you make toward your goals?',
  'How did you contribute to others today?',
  'What challenged you and how did you respond?',
  'What brought you joy?'
];

export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  DUPLICATE: 'DUPLICATE'
} as const;

export const JWT_EXPIRES_IN = 15 * 60; // 15 minutes
export const REFRESH_TOKEN_EXPIRES_IN = 30 * 24 * 60 * 60; // 30 days
