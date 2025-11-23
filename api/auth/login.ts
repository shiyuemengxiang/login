import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';
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

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

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
    let result;
    try {
      result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
    } catch (error: any) {
      // Error code 42P01 means "undefined_table"
      if (error.code === '42P01') {
        console.log('Table "users" does not exist. Creating it now...');
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        // Retry the query
        result = await client.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
        );
      } else {
        throw error;
      }
    }

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