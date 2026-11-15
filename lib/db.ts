// @/lib/db.ts
import { Pool } from 'pg';
import { MongoClient, Db } from 'mongodb';

export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5433/taskdb'
});

let mongoClientInstance: MongoClient | null = null;
let mongoDbInstance: Db | null = null;

export async function getMongoDb(): Promise<Db> {
  if (mongoDbInstance) return mongoDbInstance;
  
 mongoClientInstance = new MongoClient(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000');
  await mongoClientInstance.connect();
  mongoDbInstance = mongoClientInstance.db('taskdb');
  return mongoDbInstance;
}

export async function closeMongoDb() {
  if (mongoClientInstance) {
    await mongoClientInstance.close();
    mongoClientInstance = null;
    mongoDbInstance = null;
  }
}