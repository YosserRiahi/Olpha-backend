import { Response } from 'express';
import { SellerStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';

// ── GET /admin/sellers/pending ───────────────────────────────────────────────
export async function listPendingSellersHandler(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const sellers = await prisma.user.findMany({
      where: { sellerStatus: SellerStatus.PENDING },
      select: { id: true, email: true, name: true, role: true, sellerStatus: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(sellers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch pending sellers' });
  }
}

// ── PUT /admin/sellers/:id/approve ───────────────────────────────────────────
export async function approveSellerHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id as string },
      data: { sellerStatus: SellerStatus.APPROVED },
      select: { id: true, email: true, name: true, role: true, sellerStatus: true },
    });
    console.log(`[ADMIN] seller approved → id: ${user.id}  email: ${user.email}`);
    res.json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to approve seller';
    res.status(400).json({ error: message });
  }
}

// ── PUT /admin/sellers/:id/reject ────────────────────────────────────────────
export async function rejectSellerHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id as string },
      data: { sellerStatus: SellerStatus.REJECTED },
      select: { id: true, email: true, name: true, role: true, sellerStatus: true },
    });
    console.log(`[ADMIN] seller rejected → id: ${user.id}  email: ${user.email}`);
    res.json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reject seller';
    res.status(400).json({ error: message });
  }
}

// ── GET /admin/shops/pending (moved from shop.routes.ts) ─────────────────────
export async function listPendingShopsAdminHandler(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const shops = await prisma.shop.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'asc' },
    });
    res.json(shops);
  } catch {
    res.status(500).json({ error: 'Failed to fetch pending shops' });
  }
}

// ── PUT /admin/shops/:id/approve ─────────────────────────────────────────────
export async function approveShopAdminHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const shop = await prisma.shop.update({
      where: { id: req.params.id as string },
      data: { isApproved: true },
    });
    console.log(`[ADMIN] shop approved → id: ${shop.id}  name: ${shop.name}`);
    res.json(shop);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to approve shop';
    res.status(400).json({ error: message });
  }
}

// ── DELETE /admin/shops/:id/reject ───────────────────────────────────────────
export async function rejectShopAdminHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    await prisma.shop.delete({ where: { id: req.params.id as string } });
    console.log(`[ADMIN] shop rejected/deleted → id: ${req.params.id}`);
    res.json({ message: 'Shop rejected and removed' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reject shop';
    res.status(400).json({ error: message });
  }
}

// ── GET /admin/sellers (all sellers) ─────────────────────────────────────────
export async function listAllSellersHandler(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const sellers = await prisma.user.findMany({
      where: { role: 'SELLER' },
      select: { id: true, email: true, name: true, role: true, sellerStatus: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(sellers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch sellers' });
  }
}

// ── GET /admin/shops (all shops) ──────────────────────────────────────────────
export async function listAllShopsHandler(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const shops = await prisma.shop.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(shops);
  } catch {
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
}

// ── GET /admin/users (all users) ──────────────────────────────────────────────
export async function listAllUsersHandler(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, sellerStatus: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

// ── GET /admin/stats ──────────────────────────────────────────────────────────
export async function getStatsHandler(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const [totalUsers, totalSellers, totalBuyers, pendingSellers, totalShops, approvedShops, pendingShops] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'SELLER' } }),
        prisma.user.count({ where: { role: 'BUYER' } }),
        prisma.user.count({ where: { sellerStatus: SellerStatus.PENDING } }),
        prisma.shop.count(),
        prisma.shop.count({ where: { isApproved: true } }),
        prisma.shop.count({ where: { isApproved: false } }),
      ]);
    res.json({ totalUsers, totalSellers, totalBuyers, pendingSellers, totalShops, approvedShops, pendingShops });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
