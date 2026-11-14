// @/lib/db.ts
import { Pool } from 'pg';
import { MongoClient, Db } from 'mongodb';

// PostgreSQL Connection Pool
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/taskdb'
});

// MongoDB Connection Singleton
let mongoDbInstance: Db | null = null;
export async function getMongoDb(): Promise<Db> {
  if (mongoDbInstance) return mongoDbInstance;
  
  const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017');
  await client.connect();
  mongoDbInstance = client.db('taskdb');
  return mongoDbInstance;
}