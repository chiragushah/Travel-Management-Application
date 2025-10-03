import { NextResponse } from 'next/server';
import { authenticateWithEmailPassword, signJwt } from '@/lib/auth';
import { z } from 'zod';

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function POST(req: Request) {
  const data = await req.json();
  const { email, password } = LoginSchema.parse(data);
  const user = await authenticateWithEmailPassword(email, password);
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = signJwt(user);
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  return res;
}
