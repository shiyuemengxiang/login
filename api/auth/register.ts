import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Content-Type', 'application/json');

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const envDebug = {
    POSTGRES_URL_EXISTS: !!process.env.POSTGRES_URL,
  };

  try {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL environment variable is not defined.');
    }

    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUser.rowCount > 0) {
      return response.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email, created_at
    `;

    const user = result.rows[0];

    return response.status(201).json({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      },
      token: 'demo-token-' + Date.now()
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return response.status(500).json({ 
      error: error.message || 'Internal server error',
      debug: envDebug
    });
  }
}