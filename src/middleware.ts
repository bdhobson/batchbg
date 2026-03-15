import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public routes that don't require auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/pricing(.*)',
  '/api/webhooks/stripe(.*)',
  '/opengraph-image(.*)',
  '/sitemap.xml',
  '/robots.txt',
]);

export default clerkMiddleware(async (auth, req) => {
  // Redirect /upload to /new
  if (req.nextUrl.pathname === '/upload') {
    return NextResponse.redirect(new URL('/new', req.url));
  }

  // All non-public routes require sign-in
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
