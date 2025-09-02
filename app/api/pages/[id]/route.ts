import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie, getSession, getUserById, getPageById, updatePage, deletePage, getTeamsByUserId } from '@/lib/auth/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const page = await getPageById(params.id);
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

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
    console.error('Get page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if the page exists and user has access to it
    const existingPage = await getPageById(params.id);
    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Check if user is a member of the team that owns this page
    const userTeams = await getTeamsByUserId(user.id);
    const hasAccess = userTeams.some(team => team.id === existingPage.teamId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const requestData = await request.json();
    
    // Filter out teamId and other non-updatable fields
    const { teamId, ...updates } = requestData;
    
    const page = await updatePage(params.id, updates);

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

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
    console.error('Update page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if the page exists and user has access to it
    const existingPage = await getPageById(params.id);
    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Check if user is a member of the team that owns this page
    const userTeams = await getTeamsByUserId(user.id);
    const hasAccess = userTeams.some(team => team.id === existingPage.teamId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    await deletePage(params.id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Delete page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
