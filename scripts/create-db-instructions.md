# Database Creation Instructions

## Option 1: Using Turso CLI (Recommended)

1. **Install Turso CLI:**
   ```bash
   # On Windows (PowerShell)
   irm get.tur.so/install.ps1 | iex
   
   # Or using npm
   npm install -g @libsql/cli
   ```

2. **Login to Turso:**
   ```bash
   turso auth login
   ```

3. **Create Database:**
   ```bash
   turso db create multi-tenant-app
   ```

4. **Get Database Credentials:**
   ```bash
   turso db show multi-tenant-app
   ```

5. **Create .env.local file with the credentials:**
   ```env
   TURSO_DATABASE_URL=libsql://multi-tenant-app-[your-org].turso.io
   TURSO_AUTH_TOKEN=[your-auth-token]
   JWT_SECRET=9b2fb20b20a4df805435306c7cb70ba354d64ae07d0d8ce8c95a19f8f30f339430a92ff37e642c9767e4ffeceab80c9e7227fdc21b6b58c66f71d7d3484000e9
   NODE_ENV=development
   ```

## Option 2: Using Turso Dashboard

1. Go to [https://turso.tech](https://turso.tech)
2. Sign up/Login
3. Create a new database named `multi-tenant-app`
4. Copy the database URL and auth token
5. Create `.env.local` file with the credentials

## After Creating Database

Run the setup script:
```bash
bun run setup-db
```

This will initialize the database schema and verify everything is working.
