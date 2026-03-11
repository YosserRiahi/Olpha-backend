import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole, SellerStatus } from '@prisma/client';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
  userSellerStatus?: SellerStatus | null;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.jwt.secret) as { userId: string; role?: UserRole; sellerStatus?: SellerStatus | null };
    req.userId = payload.userId;
    req.userRole = payload.role;
    req.userSellerStatus = payload.sellerStatus ?? null;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({ error: 'Forbidden: insufficient permissions' });
      return;
    }
    next();
  };
}
