import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher('/admin(.*)');
const isSuperAdminRoute = createRouteMatcher('/superadmin(.*)');

export default clerkMiddleware(async (auth, req) => {
  const userRole = (await auth()).sessionClaims?.metadata?.role;

  if (isAdminRoute(req) && userRole !== 'admin') {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  if (isSuperAdminRoute(req) && userRole !== 'superadmin') {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
