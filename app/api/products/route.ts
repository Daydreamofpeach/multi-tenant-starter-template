import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie, getSession, getUserById, getProductsByTeamId, createProduct } from '@/lib/auth/utils';

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

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    const products = await getProductsByTeamId(teamId);

    return NextResponse.json({
      success: true,
      products: products.map(product => ({
        id: product.id,
        teamId: product.teamId,
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { teamId, name, description, price, sku, status } = await request.json();

    if (!teamId || !name) {
      return NextResponse.json(
        { error: 'Team ID and name are required' },
        { status: 400 }
      );
    }

    const product = await createProduct(
      teamId,
      name,
      description,
      price,
      sku,
      status || 'active'
    );

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        teamId: product.teamId,
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
