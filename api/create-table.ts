import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/postgres';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Debug object to check if variables exist (without exposing full secrets)
  const envDebug = {
    POSTGRES_URL_EXISTS: !!process.env.POSTGRES_URL,
    POSTGRES_USER_EXISTS: !!process.env.POSTGRES_USER,
    POSTGRES_HOST_EXISTS: !!process.env.POSTGRES_HOST,
    POSTGRES_PASSWORD_EXISTS: !!process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE_EXISTS: !!process.env.POSTGRES_DATABASE,
    // Show the first few characters of URL if it exists to verify format
    URL_PREFIX: process.env.POSTGRES_URL ? process.env.POSTGRES_URL.substring(0, 15) + '...' : 'N/A'
  };

  console.log('API Debug Info:', JSON.stringify(envDebug, null, 2));

  const client = createClient();

  try {
    if (!process.env.POSTGRES_URL) {
      return response.status(500).json({
        error: 'POSTGRES_URL environment variable is missing',
        debug: envDebug,
        hint: "Please go to Vercel Dashboard -> Settings -> Environment Variables and ensure POSTGRES_URL is added."
      });
    }

    await client.connect();

    // Using snake_case for column names is standard in Postgres and avoids quoting issues
    const result = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return response.status(200).json({ 
      message: "Table created successfully (or already exists)",
      result, 
      debug: envDebug 
    });
  } catch (error: any) {
    console.error('Create Table Error:', error);
    return response.status(500).json({ 
      error: error.message, 
      stack: error.stack,
      debug: envDebug
    });
  } finally {
    await client.end();
  }
}