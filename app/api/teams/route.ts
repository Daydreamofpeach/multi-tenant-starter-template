import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie, getSession, getUserById, createTeam } from '@/lib/auth/utils';

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getAuthCookie();
    
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

    const { displayName } = await request.json();

    if (!displayName) {
      return NextResponse.json(
        { error: 'Display name is required' },
        { status: 400 }
      );
    }

    const team = await createTeam(displayName, user.id);

    return NextResponse.json({
      success: true,
      team: {
        id: team.id,
        displayName: team.displayName,
        slug: team.slug,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
