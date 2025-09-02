import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie, deleteSession, deleteAuthCookie } from '@/lib/auth/utils';

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getAuthCookie();
    
    if (sessionId) {
      await deleteSession(sessionId);
    }
    
    await deleteAuthCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
