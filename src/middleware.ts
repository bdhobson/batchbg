import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const IS_DEV_BYPASS = process.env.CLERK_BYPASS === 'true';

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

// Dev bypass — skip Clerk entirely, inject fake userId header
if (IS_DEV_BYPASS) {
  module.exports = {
    default: (_req: Request) => {
      const res = NextResponse.next();
      return res;
    },
    config: {
      matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
      ],
    },
  };
} else {
  module.exports = {
    default: clerkMiddleware(async (auth, req) => {
      if (req.nextUrl.pathname === '/upload') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      if (!isPublicRoute(req)) {
        await auth.protect();
      }
    }),
    config: {
      matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
      ],
    },
  };
}
