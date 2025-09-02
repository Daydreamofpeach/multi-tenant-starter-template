import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Skip middleware for API routes, static files, and other Next.js internal routes
  if (url.pathname.startsWith('/api') || 
      url.pathname.startsWith('/_next') || 
      url.pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }
  
  // Skip middleware for localhost and main domain (no subdomain)
  if (hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname === 'localhost:3000' ||
      hostname === '127.0.0.1:3000' ||
      !hostname.includes('.')) {
    return NextResponse.next();
  }
  
  // Extract subdomain
  const subdomain = hostname.split('.')[0];
  
  // Skip if it's www or other common prefixes
  if (['www', 'api', 'admin', 'app'].includes(subdomain)) {
    return NextResponse.next();
  }
  
  // Check if this is a subdomain request (has dots and subdomain is different from full hostname)
  if (hostname.includes('.') && subdomain !== hostname) {
    // Rewrite to subdomain page with subdomain parameter
    url.pathname = '/subdomain';
    url.searchParams.set('subdomain', subdomain);
    
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
