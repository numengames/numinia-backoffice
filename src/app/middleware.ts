import { NextResponse, NextRequest } from 'next/server';
import { validateToken } from './api/login/validate-token';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token || !validateToken(token)) {
    console.error('Token inválido o expirado');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Permitir todas las rutas de /metrics
export const config = {
  matcher: ['/metrics/:path*'],
};