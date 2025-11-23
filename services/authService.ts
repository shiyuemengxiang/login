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
        console.error("Failed to parse server response:", text);
        throw new Error(`Server error (${response.status}). Check console for details.`);
      }

      if (!response.ok) {
        if (data.debug) {
            console.log("Server Debug Info:", data.debug);
        }
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
        console.error("Failed to parse server response:", text);
        throw new Error(`Server error (${response.status}). Check console for details.`);
      }

      if (!response.ok) {
        if (data.debug) {
            console.log("Server Debug Info:", data.debug);
        }
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