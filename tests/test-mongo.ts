import { MongoClient } from 'mongodb';

async function testConnection() {
  console.log('Attempting to connect to MongoDB...');
  
  // Hardcoding the URI directly to rule out .env loading issues
  const uri = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ SUCCESS: Connected to MongoDB!');
    
    const db = client.db('taskdb');
    const collections = await db.collections();
    console.log(`Found ${collections.length} collections.`);
    
  } catch (error) {
    console.error('❌ FAILED to connect:');
    console.error(error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

testConnection();