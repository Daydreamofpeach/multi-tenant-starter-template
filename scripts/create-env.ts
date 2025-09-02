import fs from 'fs';
import path from 'path';

const envContent = `# Turso Database Configuration
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# JWT Secret (already generated for you)
JWT_SECRET=9b2fb20b20a4df805435306c7cb70ba354d64ae07d0d8ce8c95a19f8f30f339430a92ff37e642c9767e4ffeceab80c9e7227fdc21b6b58c66f71d7d3484000e9

# Next.js Configuration
NODE_ENV=development
`;

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists');
  console.log('   Please update it with your Turso database credentials');
} else {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('📝 Please update it with your Turso database credentials:');
  console.log('   - TURSO_DATABASE_URL');
  console.log('   - TURSO_AUTH_TOKEN');
}

console.log('');
console.log('🔗 To get your Turso credentials:');
console.log('   1. Go to https://turso.tech and create an account');
console.log('   2. Create a new database');
console.log('   3. Copy the database URL and auth token');
console.log('   4. Update your .env.local file');
console.log('');
console.log('🚀 Then run: bun run setup-db');
