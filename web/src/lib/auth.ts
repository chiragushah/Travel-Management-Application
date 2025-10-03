import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

export type SessionUser = { id: string; email: string; role: 'ADMIN' | 'CUSTOMER' };

export async function authenticateWithEmailPassword(email: string, password: string): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive || !user.hashedPassword) return null;
  const ok = await bcrypt.compare(password, user.hashedPassword);
  if (!ok) return null;
  return { id: user.id, email: user.email, role: user.role as any };
}

export function signJwt(user: SessionUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwt(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}
