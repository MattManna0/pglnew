import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if accessing protected admin routes
  if (request.nextUrl.pathname.startsWith('/admin-home') || 
      request.nextUrl.pathname.startsWith('/general-setup')) {
    // Check for session cookie
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin-home/:path*', '/general-setup/:path*']
};
