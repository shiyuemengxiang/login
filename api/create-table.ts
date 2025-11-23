import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // Using snake_case for column names is standard in Postgres and avoids quoting issues
    const result = await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return response.status(200).json({ result });
  } catch (error: any) {
    console.error('Create Table Error:', error);
    return response.status(500).json({ 
      error: error.message, 
      hint: "Ensure you have created a Postgres database in Vercel Storage and connected it to this project." 
    });
  }
}