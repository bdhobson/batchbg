import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/pricing(.*)',
  '/amazon-fba(.*)',
  '/ebay-sellers(.*)',
  '/poshmark(.*)',
  '/etsy-sellers(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/api/jobs/(.*)/image/(.*)',
  '/api/webhooks/stripe(.*)',
  '/opengraph-image(.*)',
  '/sitemap.xml',
  '/robots.txt',
]);

export default clerkMiddleware(async (auth, req) => {
  // Dev bypass — skip all auth checks, let every route through
  if (process.env.CLERK_BYPASS === 'true') return NextResponse.next();

  if (req.nextUrl.pathname === '/upload') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
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
