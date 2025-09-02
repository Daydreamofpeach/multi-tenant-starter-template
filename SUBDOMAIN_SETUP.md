# Subdomain Pages System

This system allows you to create and manage subdomain pages that are accessible via `subdomain.yourdomain.com` instead of `yourdomain.com/subdomain`.

## Features

- ✅ **Full CRUD operations** for subdomain pages
- ✅ **Subdomain routing** via middleware
- ✅ **SEO optimization** with meta titles and descriptions
- ✅ **Status management** (Draft, Published, Archived)
- ✅ **HTML content support** with rich text styling
- ✅ **Team-scoped pages** (each team has its own pages)

## Database Schema

The system uses a `pages` table with the following structure:

```sql
CREATE TABLE pages (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    subdomain TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    meta_title TEXT,
    meta_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    UNIQUE(team_id, subdomain)
);
```

## How It Works

### 1. Page Creation
- Navigate to your dashboard → Pages
- Click "Add Page" to create a new subdomain page
- Fill in the subdomain (e.g., "my-page"), title, content, and SEO fields
- Set status to "Published" to make it live

### 2. Subdomain Access
- Published pages are accessible at `subdomain.yourdomain.com`
- The middleware automatically detects subdomain requests
- Only published pages are accessible publicly

### 3. Content Management
- Support for HTML content with rich styling
- Meta titles and descriptions for SEO
- Draft/Published/Archived status management

## API Endpoints

### Pages Management
- `GET /api/pages?teamId=xxx` - Get all pages for a team
- `POST /api/pages` - Create a new page
- `GET /api/pages/[id]` - Get a specific page
- `PUT /api/pages/[id]` - Update a page
- `DELETE /api/pages/[id]` - Delete a page

### Public Access
- `GET /api/subdomain/[subdomain]` - Get published page by subdomain

## Production Setup

### 1. DNS Configuration
Configure your DNS to point `*.yourdomain.com` to your server:

```
*.yourdomain.com    A    YOUR_SERVER_IP
yourdomain.com      A    YOUR_SERVER_IP
```

### 2. Server Configuration
Ensure your web server (Nginx/Apache) is configured to handle wildcard subdomains.

### 3. Environment Variables
Update the middleware to use your actual domain:

```typescript
// middleware.ts
if (hostname.includes('localhost') || hostname === 'yourdomain.com') {
  return NextResponse.next();
}
```

## Development Testing

For local development, you can test subdomains by:

1. Adding entries to your `/etc/hosts` file:
```
127.0.0.1 test.localhost
127.0.0.1 my-page.localhost
```

2. Accessing pages at:
- `http://test.localhost:3000`
- `http://my-page.localhost:3000`

## Security Considerations

- Only published pages are accessible publicly
- Pages are scoped to teams (users can only access their team's pages)
- Authentication required for all management operations
- Input validation and sanitization for HTML content

## Styling

The subdomain pages use a minimal, clean design with:
- Responsive layout
- Typography optimized for readability
- Rich text content support
- SEO-friendly structure

## Future Enhancements

Potential improvements:
- Custom CSS per page
- Template system
- Analytics integration
- Custom domain support
- Page versioning
- Collaborative editing
