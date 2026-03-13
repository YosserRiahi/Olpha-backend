import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as shopService from '../services/shop.service';

// ── Seller: create shop ──────────────────────────────────────────────────────
export async function createShopHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, description, logoUrl, bannerUrl, location, category } = req.body;
    if (!name) { res.status(400).json({ error: 'name is required' }); return; }
    const shop = await shopService.createShop(req.userId!, { name, description, logoUrl, bannerUrl, location, category });
    res.status(201).json(shop);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create shop';
    res.status(400).json({ error: message });
  }
}

// ── Seller: get my shop ──────────────────────────────────────────────────────
export async function getMyShopHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const shop = await shopService.getMyShop(req.userId!);
    res.json(shop);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Not found';
    res.status(404).json({ error: message });
  }
}

// ── Seller: update my shop ───────────────────────────────────────────────────
export async function updateMyShopHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, description, logoUrl, bannerUrl, location, category } = req.body;
    const shop = await shopService.updateMyShop(req.userId!, { name, description, logoUrl, bannerUrl, location, category });
    res.json(shop);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update shop';
    res.status(400).json({ error: message });
  }
}

// ── Public: list approved shops ──────────────────────────────────────────────
export async function listShopsHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const search   = typeof req.query.search   === 'string' ? req.query.search   : undefined;
    const shops = await shopService.listApprovedShops({ category, search });
    res.json(shops);
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
}

// ── Public: get shop by id ───────────────────────────────────────────────────
export async function getShopByIdHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const shop = await shopService.getShopById(req.params.id as string);
    res.json(shop);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Not found';
    res.status(404).json({ error: message });
  }
}

// ── Admin: list all shops ────────────────────────────────────────────────────
export async function listAllShopsAdminHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const shops = await shopService.listAllShopsAdmin();
    res.json(shops);
  } catch {
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
}

// ── Admin: delete shop ───────────────────────────────────────────────────────
export async function deleteShopAdminHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    await shopService.deleteShopAdmin(req.params.id as string);
    res.json({ message: 'Shop deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete shop';
    res.status(400).json({ error: message });
  }
}
