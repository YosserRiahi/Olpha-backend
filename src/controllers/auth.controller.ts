import { Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export async function registerHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }
    const validRoles = [UserRole.BUYER, UserRole.SELLER];
    const userRole: UserRole = validRoles.includes(role) ? role : UserRole.BUYER;

    console.log(`[AUTH] register attempt  → email: ${email}  role: ${userRole}`);

    const result = await authService.register(email, password, userRole, name);

    console.log(`[AUTH] register success  → id: ${result.user.id}  email: ${email}  role: ${result.user.role}`);

    res.status(201).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    console.log(`[AUTH] register failed   → ${message}`);
    res.status(400).json({ error: message });
  }
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }

    console.log(`[AUTH] login attempt     → email: ${email}`);

    const result = await authService.login(email, password);

    console.log(`[AUTH] login success     → id: ${result.user.id}  email: ${email}  role: ${result.user.role}`);

    res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    console.log(`[AUTH] login failed      → ${message}`);
    res.status(401).json({ error: message });
  }
}

export async function refreshHandler(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: 'refreshToken is required' });
      return;
    }
    const tokens = await authService.refreshTokens(refreshToken);
    res.status(200).json(tokens);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Token refresh failed';
    res.status(401).json({ error: message });
  }
}

// GET /auth/me — returns fresh user data + new tokens (used by "Check Status" on pending screen)
export async function getMeHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const result = await authService.getMe(req.userId!);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get user';
    res.status(404).json({ error: message });
  }
}
