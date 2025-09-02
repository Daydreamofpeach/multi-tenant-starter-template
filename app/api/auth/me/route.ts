import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie, getSession, getUserById, getTeamsByUserId } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
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

    const teams = await getTeamsByUserId(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      teams: teams.map(team => ({
        id: team.id,
        displayName: team.displayName,
        slug: team.slug,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
