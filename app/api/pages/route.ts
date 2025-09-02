import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie, getSession, getUserById, getPagesByTeamId, createPage } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    const sessionId = await getAuthCookie(request);
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    const pages = await getPagesByTeamId(teamId);

    return NextResponse.json({
      success: true,
      pages: pages.map(page => ({
        id: page.id,
        teamId: page.teamId,
        subdomain: page.subdomain,
        title: page.title,
        content: page.content,
        status: page.status,
        visibility: page.visibility,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get pages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getAuthCookie(request);
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { teamId, subdomain, title, content, status, visibility, metaTitle, metaDescription } = await request.json();

    if (!teamId || !subdomain || !title) {
      return NextResponse.json(
        { error: 'Team ID, subdomain, and title are required' },
        { status: 400 }
      );
    }

    const page = await createPage(
      teamId,
      subdomain,
      title,
      content,
      status || 'draft',
      visibility || 'public',
      metaTitle,
      metaDescription
    );

    return NextResponse.json({
      success: true,
      page: {
        id: page.id,
        teamId: page.teamId,
        subdomain: page.subdomain,
        title: page.title,
        content: page.content,
        status: page.status,
        visibility: page.visibility,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
