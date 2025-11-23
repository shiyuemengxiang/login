import { sql } from '@vercel/postgres';
import { compare } from 'bcryptjs';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ error: 'Missing email or password' });
  }

  try {
    // Find user
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (result.rowCount === 0) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const passwordValid = await compare(password, user.password);

    if (!passwordValid) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    return response.status(200).json({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token: 'demo-token-' + Date.now() // In a real app, use jsonwebtoken here
    });

  } catch (error: any) {
    console.error(error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}