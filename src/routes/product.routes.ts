import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import {
  createProductHandler,
  listMyProductsHandler,
  updateProductHandler,
  deleteProductHandler,
  toggleProductHandler,
  listProductsByShopHandler,
  getProductByIdHandler,
} from '../controllers/product.controller';

const router = Router();

// ── Seller (specific paths must come before /:id to avoid conflicts) ─────────
router.get(
  '/me',
  authMiddleware,
  requireRole(UserRole.SELLER),
  listMyProductsHandler,
);                                                      // GET    /products/me

router.post(
  '/',
  authMiddleware,
  requireRole(UserRole.SELLER),
  createProductHandler,
);                                                      // POST   /products

router.put(
  '/:id',
  authMiddleware,
  requireRole(UserRole.SELLER),
  updateProductHandler,
);                                                      // PUT    /products/:id

router.delete(
  '/:id',
  authMiddleware,
  requireRole(UserRole.SELLER),
  deleteProductHandler,
);                                                      // DELETE /products/:id

router.patch(
  '/:id/toggle',
  authMiddleware,
  requireRole(UserRole.SELLER),
  toggleProductHandler,
);                                                      // PATCH  /products/:id/toggle

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/shop/:shopId', listProductsByShopHandler); // GET    /products/shop/:shopId
router.get('/:id',          getProductByIdHandler);    // GET    /products/:id

export default router;
