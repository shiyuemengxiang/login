import { User, AuthResponse } from '../types';

/**
 * NOTE FOR DEVELOPER:
 * This service currently mocks the backend behavior using localStorage to allow the UI 
 * to be fully functional immediately. 
 * 
 * To connect this to a real Vercel Postgres database:
 * 1. Create API routes (e.g., /api/auth/register, /api/auth/login) in your framework (Next.js, etc.).
 * 2. Use '@vercel/postgres' in those API routes to query your DB.
 * 3. Replace the contents of login() and register() below with standard fetch() calls to your API.
 * 
 * Example Vercel Postgres Query (Server-side):
 * import { sql } from '@vercel/postgres';
 * await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hash});`;
 */

const DELAY_MS = 800;

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usersJson = localStorage.getItem('vercel_demo_users');
        const users: any[] = usersJson ? JSON.parse(usersJson) : [];
        
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          const { password: _, ...userWithoutPass } = user;
          resolve({
            user: userWithoutPass as User,
            token: 'mock-jwt-token-' + Date.now()
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, DELAY_MS);
    });
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usersJson = localStorage.getItem('vercel_demo_users');
        const users: any[] = usersJson ? JSON.parse(usersJson) : [];

        if (users.find(u => u.email === email)) {
          reject(new Error('User with this email already exists'));
          return;
        }

        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          password, // In a real app, never store plain text passwords!
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('vercel_demo_users', JSON.stringify(users));

        const { password: _, ...userWithoutPass } = newUser;
        resolve({
          user: userWithoutPass as User,
          token: 'mock-jwt-token-' + Date.now()
        });
      }, DELAY_MS);
    });
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  }
};