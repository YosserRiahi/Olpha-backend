import { Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import * as authService from '../services/auth.service';

export async function registerHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }
    const validRoles = [UserRole.BUYER, UserRole.SELLER];
    const userRole: UserRole = validRoles.includes(role) ? role : UserRole.BUYER;
    const result = await authService.register(email, password, userRole, name);
    res.status(201).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
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
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
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
