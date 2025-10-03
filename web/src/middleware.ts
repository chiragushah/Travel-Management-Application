import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSecureHeaders } from 'next-secure-headers';
import { verifyJwt } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const secureHeaders = createSecureHeaders({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com', 'https://www.paypal.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", 'https://api.stripe.com'],
        frameSrc: ['https://js.stripe.com', 'https://www.paypal.com'],
      },
    },
    frameGuard: 'deny',
    noopen: 'noopen',
    referrerPolicy: 'strict-origin-when-cross-origin',
    forceHTTPSRedirect: true,
    // permissionsPolicy is not in next-secure-headers types; omit for type-safety
  });
  for (const h of secureHeaders) {
    res.headers.set(h.key, h.value);
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const token = req.cookies.get('session')?.value;
    const session = token ? verifyJwt(token) : null;
    if (!session || session.role !== 'ADMIN') {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};
