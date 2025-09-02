# Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Turso Database Configuration
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js Configuration
NODE_ENV=development
```

## Turso Database Setup

1. Install the Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. Create a new database:
   ```bash
   turso db create your-database-name
   ```

3. Get your database URL and auth token:
   ```bash
   turso db show your-database-name
   ```

4. Initialize the database schema:
   ```bash
   turso db shell your-database-name < lib/db/schema.sql
   ```

## Running the Application

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ Custom authentication system with Turso database
- ✅ User registration and login
- ✅ Multi-tenant team management
- ✅ Session management with secure cookies
- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Responsive UI with Tailwind CSS
- ✅ Dark mode support

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user and teams
- `POST /api/teams` - Create a new team

## Database Schema

The application uses the following tables:
- `users` - User accounts
- `teams` - Multi-tenant teams
- `team_members` - Team membership relationships
- `sessions` - User sessions
