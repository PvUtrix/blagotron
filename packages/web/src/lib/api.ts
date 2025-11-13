import { ApiResponse } from '@blagotron/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  }

  // Auth methods
  async register(email: string, password: string, displayName: string) {
    return this.request<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
  }

  async login(email: string, password: string) {
    return this.request<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(refreshToken: string) {
    return this.request('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // User methods
  async getCurrentUser() {
    return this.request<any>('/api/users/me');
  }

  async updateProfile(data: any) {
    return this.request<any>('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Goals methods
  async getGoals(filters?: { status?: string; domain?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request<any>(`/api/goals?${params}`);
  }

  async getGoal(id: string) {
    return this.request<any>(`/api/goals/${id}`);
  }

  async createGoal(data: any) {
    return this.request<any>('/api/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGoal(id: string, data: any) {
    return this.request<any>(`/api/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteGoal(id: string) {
    return this.request<any>(`/api/goals/${id}`, {
      method: 'DELETE',
    });
  }

  // Activities methods
  async getActivities(params?: { page?: number; pageSize?: number }) {
    const searchParams = new URLSearchParams(params as any);
    return this.request<any>(`/api/activities?${searchParams}`);
  }

  async logActivity(data: any) {
    return this.request<any>('/api/activities/log', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEnergyPatterns(params?: { startDate?: string; endDate?: string }) {
    const searchParams = new URLSearchParams(params as any);
    return this.request<any>(`/api/activities/patterns/energy?${searchParams}`);
  }

  // Life Balance methods
  async getLatestLifeBalance() {
    return this.request<any>('/api/life-balance/latest');
  }

  async getLifeBalanceHistory() {
    return this.request<any>('/api/life-balance/history');
  }

  async createLifeBalanceSnapshot(data: any) {
    return this.request<any>('/api/life-balance/snapshots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Reflections methods
  async getReflections(params?: { page?: number; pageSize?: number; tag?: string }) {
    const searchParams = new URLSearchParams(params as any);
    return this.request<any>(`/api/reflections?${searchParams}`);
  }

  async createReflection(data: any) {
    return this.request<any>('/api/reflections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDailyPrompt() {
    return this.request<any>('/api/reflections/prompts/daily');
  }
}

export const api = new ApiClient(API_URL);
