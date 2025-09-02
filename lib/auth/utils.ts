import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  displayName: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  createdAt: Date;
  user?: {
    id: string;
    email: string;
    displayName: string;
  };
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT utilities
export async function createJWT(payload: { userId: string; sessionId: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<{ userId: string; sessionId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; sessionId: string };
  } catch {
    return null;
  }
}

// Session utilities
export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.execute({
    sql: 'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    args: [sessionId, userId, expiresAt.toISOString()]
  });

  return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM sessions WHERE id = ? AND expires_at > ?',
    args: [sessionId, new Date().toISOString()]
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id as string,
    userId: row.user_id as string,
    expiresAt: new Date(row.expires_at as string),
    createdAt: new Date(row.created_at as string)
  };
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM sessions WHERE id = ?',
    args: [sessionId]
  });
}

export async function deleteAllUserSessions(userId: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM sessions WHERE user_id = ?',
    args: [userId]
  });
}

// User utilities
export async function getUserById(userId: string): Promise<User | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [userId]
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id as string,
    email: row.email as string,
    displayName: row.display_name as string,
    avatarUrl: row.avatar_url as string | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  };
}



export async function createUser(email: string, password: string, displayName: string): Promise<User> {
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  await db.execute({
    sql: 'INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)',
    args: [userId, email, passwordHash, displayName]
  });

  return {
    id: userId,
    email,
    displayName,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Team utilities
export async function getTeamsByUserId(userId: string): Promise<Team[]> {
  const result = await db.execute({
    sql: `
      SELECT t.* FROM teams t
      INNER JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = ?
      ORDER BY t.created_at ASC
    `,
    args: [userId]
  });

  return result.rows.map(row => ({
    id: row.id as string,
    displayName: row.display_name as string,
    slug: row.slug as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  }));
}

export async function getTeamById(teamId: string): Promise<Team | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM teams WHERE id = ?',
    args: [teamId]
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id as string,
    displayName: row.display_name as string,
    slug: row.slug as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  };
}

export async function createTeam(displayName: string, userId: string): Promise<Team> {
  const teamId = crypto.randomUUID();
  let baseSlug = displayName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  
  // Ensure slug is not empty
  if (!baseSlug) {
    baseSlug = 'team';
  }
  
  // Check if slug already exists and make it unique
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existingTeam = await db.execute({
      sql: 'SELECT id FROM teams WHERE slug = ?',
      args: [slug]
    });
    
    if (existingTeam.rows.length === 0) {
      break; // Slug is unique
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  await db.execute({
    sql: 'INSERT INTO teams (id, display_name, slug) VALUES (?, ?, ?)',
    args: [teamId, displayName, slug]
  });

  // Add the creator as the owner
  const memberId = crypto.randomUUID();
  await db.execute({
    sql: 'INSERT INTO team_members (id, team_id, user_id, role) VALUES (?, ?, ?, ?)',
    args: [memberId, teamId, userId, 'owner']
  });

  return {
    id: teamId,
    displayName,
    slug,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM team_members WHERE team_id = ?',
    args: [teamId]
  });

  return result.rows.map(row => ({
    id: row.id as string,
    teamId: row.team_id as string,
    userId: row.user_id as string,
    role: row.role as 'owner' | 'admin' | 'member',
    createdAt: new Date(row.created_at as string)
  }));
}

// Cookie utilities
export async function setAuthCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  });
}

export async function getAuthCookie(request?: any): Promise<string | null> {
  if (request) {
    // For API routes, get cookie from request headers
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;
    
    const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, cookie: string) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    return cookies['auth-token'] || null;
  } else {
    // For server components, use cookies()
    const cookieStore = await cookies();
    return cookieStore.get('auth-token')?.value || null;
  }
}

export async function deleteAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

// Product utilities
export interface Product {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  price?: number;
  sku?: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export async function getProductsByTeamId(teamId: string): Promise<Product[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM products WHERE team_id = ? ORDER BY created_at DESC',
    args: [teamId]
  });

  return result.rows.map(row => ({
    id: row.id as string,
    teamId: row.team_id as string,
    name: row.name as string,
    description: row.description as string | undefined,
    price: row.price ? parseFloat(row.price as string) : undefined,
    sku: row.sku as string | undefined,
    status: row.status as 'active' | 'inactive' | 'draft',
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  }));
}

export async function getProductById(productId: string): Promise<Product | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM products WHERE id = ?',
    args: [productId]
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id as string,
    teamId: row.team_id as string,
    name: row.name as string,
    description: row.description as string | undefined,
    price: row.price ? parseFloat(row.price as string) : undefined,
    sku: row.sku as string | undefined,
    status: row.status as 'active' | 'inactive' | 'draft',
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  };
}

export async function createProduct(
  teamId: string,
  name: string,
  description?: string,
  price?: number,
  sku?: string,
  status: 'active' | 'inactive' | 'draft' = 'active'
): Promise<Product> {
  const productId = crypto.randomUUID();

  await db.execute({
    sql: 'INSERT INTO products (id, team_id, name, description, price, sku, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [productId, teamId, name, description || null, price || null, sku || null, status]
  });

  return {
    id: productId,
    teamId,
    name,
    description,
    price,
    sku,
    status,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export async function updateProduct(
  productId: string,
  updates: {
    name?: string;
    description?: string;
    price?: number;
    sku?: string;
    status?: 'active' | 'inactive' | 'draft';
  }
): Promise<Product | null> {
  const setClause = [];
  const args = [];

  if (updates.name !== undefined) {
    setClause.push('name = ?');
    args.push(updates.name);
  }
  if (updates.description !== undefined) {
    setClause.push('description = ?');
    args.push(updates.description);
  }
  if (updates.price !== undefined) {
    setClause.push('price = ?');
    args.push(updates.price);
  }
  if (updates.sku !== undefined) {
    setClause.push('sku = ?');
    args.push(updates.sku);
  }
  if (updates.status !== undefined) {
    setClause.push('status = ?');
    args.push(updates.status);
  }

  if (setClause.length === 0) {
    return getProductById(productId);
  }

  setClause.push('updated_at = ?');
  args.push(new Date().toISOString());
  args.push(productId);

  await db.execute({
    sql: `UPDATE products SET ${setClause.join(', ')} WHERE id = ?`,
    args
  });

  return getProductById(productId);
}

export async function deleteProduct(productId: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM products WHERE id = ?',
    args: [productId]
  });
}

// Team management utilities
export async function getAllTeams(): Promise<Team[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM teams ORDER BY created_at DESC',
    args: []
  });

  return result.rows.map(row => ({
    id: row.id as string,
    displayName: row.display_name as string,
    slug: row.slug as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  }));
}

export async function updateTeam(
  teamId: string,
  updates: {
    displayName?: string;
    slug?: string;
  }
): Promise<Team | null> {
  const setClause = [];
  const args = [];

  if (updates.displayName !== undefined) {
    setClause.push('display_name = ?');
    args.push(updates.displayName);
  }
  if (updates.slug !== undefined) {
    setClause.push('slug = ?');
    args.push(updates.slug);
  }

  if (setClause.length === 0) {
    return getTeamById(teamId);
  }

  setClause.push('updated_at = ?');
  args.push(new Date().toISOString());
  args.push(teamId);

  await db.execute({
    sql: `UPDATE teams SET ${setClause.join(', ')} WHERE id = ?`,
    args
  });

  return getTeamById(teamId);
}

export async function deleteTeam(teamId: string): Promise<void> {
  // Delete all related data first (products, team members, etc.)
  await db.execute({
    sql: 'DELETE FROM products WHERE team_id = ?',
    args: [teamId]
  });

  await db.execute({
    sql: 'DELETE FROM team_members WHERE team_id = ?',
    args: [teamId]
  });

  // Finally delete the team
  await db.execute({
    sql: 'DELETE FROM teams WHERE id = ?',
    args: [teamId]
  });
}



export async function addTeamMember(teamId: string, userId: string, role: string = 'member'): Promise<void> {
  const memberId = crypto.randomUUID();
  await db.execute({
    sql: 'INSERT INTO team_members (id, team_id, user_id, role) VALUES (?, ?, ?, ?)',
    args: [memberId, teamId, userId, role]
  });
}

export async function removeTeamMember(teamId: string, userId: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM team_members WHERE team_id = ? AND user_id = ?',
    args: [teamId, userId]
  });
}

export async function updateTeamMemberRole(teamId: string, userId: string, role: string): Promise<void> {
  await db.execute({
    sql: 'UPDATE team_members SET role = ? WHERE team_id = ? AND user_id = ?',
    args: [role, teamId, userId]
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id as string,
    email: row.email as string,
    displayName: row.display_name as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  };
}

// Page utilities
export interface Page {
  id: string;
  teamId: string;
  subdomain: string;
  title: string;
  content?: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private';
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getPagesByTeamId(teamId: string): Promise<Page[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM pages WHERE team_id = ? ORDER BY created_at DESC',
    args: [teamId]
  });

  return result.rows.map(row => ({
    id: row.id as string,
    teamId: row.team_id as string,
    subdomain: row.subdomain as string,
    title: row.title as string,
    content: row.content as string | undefined,
    status: row.status as 'draft' | 'published' | 'archived',
    visibility: (row.visibility as 'public' | 'private') || 'public',
    metaTitle: row.meta_title as string | undefined,
    metaDescription: row.meta_description as string | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  }));
}

export async function getPageById(pageId: string): Promise<Page | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM pages WHERE id = ?',
    args: [pageId]
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id as string,
    teamId: row.team_id as string,
    subdomain: row.subdomain as string,
    title: row.title as string,
    content: row.content as string | undefined,
    status: row.status as 'draft' | 'published' | 'archived',
    visibility: (row.visibility as 'public' | 'private') || 'public',
    metaTitle: row.meta_title as string | undefined,
    metaDescription: row.meta_description as string | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  };
}

export async function getPageBySubdomain(subdomain: string): Promise<Page | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM pages WHERE subdomain = ? AND status = ?',
    args: [subdomain, 'published']
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id as string,
    teamId: row.team_id as string,
    subdomain: row.subdomain as string,
    title: row.title as string,
    content: row.content as string | undefined,
    status: row.status as 'draft' | 'published' | 'archived',
    visibility: (row.visibility as 'public' | 'private') || 'public',
    metaTitle: row.meta_title as string | undefined,
    metaDescription: row.meta_description as string | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  };
}

export async function checkUserAccessToPage(pageId: string, userId: string): Promise<boolean> {
  // Check if the user is a member of the team that owns the page
  const result = await db.execute({
    sql: `
      SELECT tm.id 
      FROM team_members tm
      JOIN pages p ON p.team_id = tm.team_id
      WHERE p.id = ? AND tm.user_id = ?
    `,
    args: [pageId, userId]
  });

  return result.rows.length > 0;
}

export async function createPage(
  teamId: string,
  subdomain: string,
  title: string,
  content?: string,
  status: 'draft' | 'published' | 'archived' = 'draft',
  visibility: 'public' | 'private' = 'public',
  metaTitle?: string,
  metaDescription?: string
): Promise<Page> {
  const pageId = crypto.randomUUID();

  await db.execute({
    sql: 'INSERT INTO pages (id, team_id, subdomain, title, content, status, visibility, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    args: [pageId, teamId, subdomain, title, content || null, status, visibility, metaTitle || null, metaDescription || null]
  });

  return {
    id: pageId,
    teamId,
    subdomain,
    title,
    content,
    status,
    visibility,
    metaTitle,
    metaDescription,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export async function updatePage(
  pageId: string,
  updates: {
    subdomain?: string;
    title?: string;
    content?: string;
    status?: 'draft' | 'published' | 'archived';
    visibility?: 'public' | 'private';
    metaTitle?: string;
    metaDescription?: string;
  }
): Promise<Page | null> {
  const setClause = [];
  const args = [];

  if (updates.subdomain !== undefined) {
    setClause.push('subdomain = ?');
    args.push(updates.subdomain);
  }
  if (updates.title !== undefined) {
    setClause.push('title = ?');
    args.push(updates.title);
  }
  if (updates.content !== undefined) {
    setClause.push('content = ?');
    args.push(updates.content);
  }
  if (updates.status !== undefined) {
    setClause.push('status = ?');
    args.push(updates.status);
  }
  if (updates.visibility !== undefined) {
    setClause.push('visibility = ?');
    args.push(updates.visibility);
  }
  if (updates.metaTitle !== undefined) {
    setClause.push('meta_title = ?');
    args.push(updates.metaTitle);
  }
  if (updates.metaDescription !== undefined) {
    setClause.push('meta_description = ?');
    args.push(updates.metaDescription);
  }

  if (setClause.length === 0) {
    return getPageById(pageId);
  }

  setClause.push('updated_at = ?');
  args.push(new Date().toISOString());
  args.push(pageId);

  await db.execute({
    sql: `UPDATE pages SET ${setClause.join(', ')} WHERE id = ?`,
    args
  });

  return getPageById(pageId);
}

export async function deletePage(pageId: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM pages WHERE id = ?',
    args: [pageId]
  });
}
