import { NextRequest, NextResponse } from 'next/server';
import { getPageBySubdomain } from '@/lib/auth/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  try {
    const page = await getPageBySubdomain(params.subdomain);
    
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
        subdomain: page.subdomain,
        title: page.title,
        content: page.content,
        visibility: page.visibility,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get subdomain page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
