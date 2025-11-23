import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/postgres';
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

  const client = createClient();

  try {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL environment variable is not defined.');
    }

    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: 'Missing email or password' });
    }

    await client.connect();

    // Find user
    const result = await client.sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (result.rowCount === 0) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    return response.status(200).json({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      },
      token: 'demo-token-' + Date.now()
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return response.status(500).json({ 
      error: error.message || 'Internal server error',
      debug: envDebug
    });
  } finally {
    await client.end();
  }
}