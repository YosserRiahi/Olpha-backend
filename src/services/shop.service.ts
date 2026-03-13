import { prisma } from '../config/database';

export interface ShopData {
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  location?: string;
  category?: string;
}

// ── Create shop (seller only, one shop per seller) ──────────────────────────
export async function createShop(ownerId: string, data: ShopData) {
  const existing = await prisma.shop.findFirst({ where: { ownerId } });
  if (existing) throw new Error('You already have a shop');

  return prisma.shop.create({
    data: { ownerId, ...data },
  });
}

// ── Get my shop ─────────────────────────────────────────────────────────────
export async function getMyShop(ownerId: string) {
  const shop = await prisma.shop.findFirst({ where: { ownerId } });
  if (!shop) throw new Error('Shop not found');
  return shop;
}

// ── Update my shop ──────────────────────────────────────────────────────────
export async function updateMyShop(ownerId: string, data: Partial<ShopData>) {
  const shop = await prisma.shop.findFirst({ where: { ownerId } });
  if (!shop) throw new Error('Shop not found');

  return prisma.shop.update({
    where: { id: shop.id },
    data,
  });
}

// ── List all shops (public) ──────────────────────────────────────────────────
export async function listApprovedShops(opts?: { category?: string; search?: string }) {
  return prisma.shop.findMany({
    where: {
      ...(opts?.category ? { category: opts.category } : {}),
      ...(opts?.search
        ? { name: { contains: opts.search, mode: 'insensitive' } }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ── Get single shop by id (public) ──────────────────────────────────────────
export async function getShopById(id: string) {
  const shop = await prisma.shop.findUnique({ where: { id } });
  if (!shop) throw new Error('Shop not found');
  return shop;
}

// ── ADMIN: list all shops ────────────────────────────────────────────────────
export async function listAllShopsAdmin() {
  return prisma.shop.findMany({ orderBy: { createdAt: 'desc' } });
}

// ── ADMIN: delete shop ───────────────────────────────────────────────────────
export async function deleteShopAdmin(id: string) {
  return prisma.shop.delete({ where: { id } });
}
