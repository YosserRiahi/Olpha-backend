import { prisma } from '../config/database';

export interface ProductData {
  name: string;
  description?: string;
  price: number;
  imageUrls?: string[];
  stock?: number;
  category?: string;
  tags?: string[];
}

// ── Seller: create product in their shop ────────────────────────────────────
export async function createProduct(ownerId: string, data: ProductData) {
  const shop = await prisma.shop.findFirst({ where: { ownerId } });
  if (!shop) throw new Error('You do not have a shop');

  return prisma.product.create({
    data: { shopId: shop.id, ...data },
  });
}

// ── Seller: list own products ────────────────────────────────────────────────
export async function listMyProducts(ownerId: string) {
  const shop = await prisma.shop.findFirst({ where: { ownerId } });
  if (!shop) throw new Error('You do not have a shop');

  return prisma.product.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
  });
}

// ── Seller: update product ───────────────────────────────────────────────────
export async function updateProduct(
  ownerId: string,
  productId: string,
  data: Partial<ProductData>,
) {
  const shop = await prisma.shop.findFirst({ where: { ownerId } });
  if (!shop) throw new Error('You do not have a shop');

  const product = await prisma.product.findFirst({
    where: { id: productId, shopId: shop.id },
  });
  if (!product) throw new Error('Product not found');

  return prisma.product.update({ where: { id: productId }, data });
}

// ── Seller: delete product ───────────────────────────────────────────────────
export async function deleteProduct(ownerId: string, productId: string) {
  const shop = await prisma.shop.findFirst({ where: { ownerId } });
  if (!shop) throw new Error('You do not have a shop');

  const product = await prisma.product.findFirst({
    where: { id: productId, shopId: shop.id },
  });
  if (!product) throw new Error('Product not found');

  return prisma.product.delete({ where: { id: productId } });
}

// ── Seller: toggle active / inactive ────────────────────────────────────────
export async function toggleProduct(ownerId: string, productId: string) {
  const shop = await prisma.shop.findFirst({ where: { ownerId } });
  if (!shop) throw new Error('You do not have a shop');

  const product = await prisma.product.findFirst({
    where: { id: productId, shopId: shop.id },
  });
  if (!product) throw new Error('Product not found');

  return prisma.product.update({
    where: { id: productId },
    data: { isActive: !product.isActive },
  });
}

// ── Public: list active products for a shop ──────────────────────────────────
export async function listProductsByShop(shopId: string) {
  return prisma.product.findMany({
    where: { shopId, isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

// ── Public: get single product ───────────────────────────────────────────────
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error('Product not found');
  return product;
}
