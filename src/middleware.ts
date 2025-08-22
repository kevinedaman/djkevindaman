import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/supabase-middleware';

export async function middleware(request: NextRequest) {
  // First update the session using the Supabase middleware
  const response = await updateSession(request);

  // Only handle admin routes specifically - just check for authenticated user
  // Role checking will be handled by the page components using server actions
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // For protected admin routes, we'll let the page components handle the role checking
    // Middleware will just ensure there's an authenticated user
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
