import { User, AuthResponse } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (e) {
        // If response is not JSON (e.g., Vercel 500 error page), throw a readable error
        throw new Error(`Server error (${response.status}): The server encountered an issue.`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      return data as AuthResponse;
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server error (${response.status}): The server encountered an issue.`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return data as AuthResponse;
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  },

  logout: async (): Promise<void> => {
    return Promise.resolve();
  }
};