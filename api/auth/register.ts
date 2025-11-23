import { sql } from '@vercel/postgres';
import { hash } from 'bcryptjs';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUser.rowCount > 0) {
      return response.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Insert new user
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email, "createdAt"
    `;

    const user = result.rows[0];

    return response.status(201).json({
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
    return response.status(500).json({ error: error.message });
  }
}