import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { UserRole, SellerStatus } from '@prisma/client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  sellerStatus: SellerStatus | null;
}

function signTokens(userId: string, role: UserRole, sellerStatus: SellerStatus | null): AuthTokens {
  const accessToken = jwt.sign({ userId, role, sellerStatus }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });
  const refreshToken = jwt.sign({ userId }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
  return { accessToken, refreshToken };
}

type DbUser = { id: string; email: string; name: string | null; role: UserRole; sellerStatus: SellerStatus | null };

function toAuthUser(user: DbUser): AuthUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role, sellerStatus: user.sellerStatus };
}

export async function register(
  email: string,
  password: string,
  role: UserRole = UserRole.BUYER,
  name?: string,
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already in use');

  const passwordHash = await bcrypt.hash(password, 12);
  const sellerStatus = role === UserRole.SELLER ? SellerStatus.PENDING : null;
  const user = await prisma.user.create({
    data: { email, passwordHash, name: name ?? null, role, sellerStatus },
  });

  const tokens = signTokens(user.id, user.role, user.sellerStatus);
  return { user: toAuthUser(user), tokens };
}

export async function login(
  email: string,
  password: string,
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  const tokens = signTokens(user.id, user.role, user.sellerStatus);
  return { user: toAuthUser(user), tokens };
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  try {
    const payload = jwt.verify(refreshToken, env.jwt.refreshSecret) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new Error('User not found');
    return signTokens(user.id, user.role, user.sellerStatus);
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
}

export async function getMe(userId: string): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  const tokens = signTokens(user.id, user.role, user.sellerStatus);
  return { user: toAuthUser(user), tokens };
}
