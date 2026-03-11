import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as productService from '../services/product.service';

// ── Seller: create ───────────────────────────────────────────────────────────
export async function createProductHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, description, price, imageUrls, stock, category, tags } = req.body;
    if (!name)       { res.status(400).json({ error: 'name is required' });  return; }
    if (price == null) { res.status(400).json({ error: 'price is required' }); return; }

    const product = await productService.createProduct(req.userId!, {
      name,
      description,
      price: Number(price),
      imageUrls,
      stock: stock != null ? Number(stock) : undefined,
      category,
      tags,
    });
    res.status(201).json(product);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create product';
    res.status(400).json({ error: message });
  }
}

// ── Seller: list my products ─────────────────────────────────────────────────
export async function listMyProductsHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const products = await productService.listMyProducts(req.userId!);
    res.json(products);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch products';
    res.status(400).json({ error: message });
  }
}

// ── Seller: update ───────────────────────────────────────────────────────────
export async function updateProductHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, description, price, imageUrls, stock, category, tags } = req.body;
    const updates: Record<string, unknown> = {};
    if (name        !== undefined) updates.name        = name;
    if (description !== undefined) updates.description = description;
    if (price       !== undefined) updates.price       = Number(price);
    if (imageUrls   !== undefined) updates.imageUrls   = imageUrls;
    if (stock       !== undefined) updates.stock       = Number(stock);
    if (category    !== undefined) updates.category    = category;
    if (tags        !== undefined) updates.tags        = tags;

    const product = await productService.updateProduct(
      req.userId!,
      req.params.id as string,
      updates,
    );
    res.json(product);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update product';
    res.status(400).json({ error: message });
  }
}

// ── Seller: delete ───────────────────────────────────────────────────────────
export async function deleteProductHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    await productService.deleteProduct(req.userId!, req.params.id as string);
    res.json({ message: 'Product deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete product';
    res.status(400).json({ error: message });
  }
}

// ── Seller: toggle active / inactive ─────────────────────────────────────────
export async function toggleProductHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const product = await productService.toggleProduct(req.userId!, req.params.id as string);
    res.json(product);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to toggle product';
    res.status(400).json({ error: message });
  }
}

// ── Public: list products by shop ────────────────────────────────────────────
export async function listProductsByShopHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const products = await productService.listProductsByShop(req.params.shopId as string);
    res.json(products);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch products';
    res.status(500).json({ error: message });
  }
}

// ── Public: get single product ────────────────────────────────────────────────
export async function getProductByIdHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const product = await productService.getProductById(req.params.id as string);
    res.json(product);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Not found';
    res.status(404).json({ error: message });
  }
}
