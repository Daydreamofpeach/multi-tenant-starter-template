import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Database configuration
const DB_NAME = 'multi-tenant-app';
const DB_URL = `libsql://${DB_NAME}.turso.io`;

async function createDatabase() {
  console.log('🚀 Setting up Turso database...');
  
  // Check if we have the required environment variables
  const dbUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!dbUrl || !authToken) {
    console.error('❌ Missing required environment variables:');
    console.error('   TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
    console.error('');
    console.error('📝 Please create a .env.local file with:');
    console.error('   TURSO_DATABASE_URL=libsql://your-database-name.turso.io');
    console.error('   TURSO_AUTH_TOKEN=your-turso-auth-token');
    console.error('   JWT_SECRET=your-jwt-secret');
    process.exit(1);
  }

  try {
    // Create database client
    const client = createClient({
      url: dbUrl,
      authToken: authToken,
    });

    console.log('✅ Connected to Turso database');

    // Read and execute the schema
    const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    console.log('📄 Reading database schema...');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    console.log(`🔧 Executing ${statements.length} SQL statements...`);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.execute(statement.trim());
        } catch (error) {
          // Ignore "table already exists" errors
          if (!error.message.includes('already exists')) {
            throw error;
          }
        }
      }
    }
    
    console.log('✅ Database schema initialized successfully!');
    
    // Test the connection by querying the users table
    const result = await client.execute('SELECT name FROM sqlite_master WHERE type="table"');
    const tables = result.rows.map(row => row.name as string);
    
    console.log('📊 Created tables:', tables.join(', '));
    
    console.log('');
    console.log('🎉 Database setup complete!');
    console.log('   You can now start your application with: bun run dev');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('');
    console.error('💡 Make sure you have:');
    console.error('   1. Created a Turso database');
    console.error('   2. Set the correct TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
    console.error('   3. Your database is accessible');
    process.exit(1);
  }
}

// Run the setup
createDatabase();
