import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import {
  createShopHandler,
  getMyShopHandler,
  updateMyShopHandler,
  listShopsHandler,
  getShopByIdHandler,
  listAllShopsAdminHandler,
  deleteShopAdminHandler,
} from '../controllers/shop.controller';

const router = Router();

// ── Seller (before /:id wildcard) ────────────────────────────────────────────
router.get('/me',   authMiddleware, requireRole(UserRole.SELLER), getMyShopHandler);    // GET  /shops/me
router.put('/me',   authMiddleware, requireRole(UserRole.SELLER), updateMyShopHandler); // PUT  /shops/me
router.post('/',    authMiddleware, requireRole(UserRole.SELLER), createShopHandler);   // POST /shops

// ── Admin (before /:id wildcard) ─────────────────────────────────────────────
router.get('/admin/all',    authMiddleware, requireRole(UserRole.ADMIN), listAllShopsAdminHandler); // GET    /shops/admin/all
router.delete('/admin/:id', authMiddleware, requireRole(UserRole.ADMIN), deleteShopAdminHandler);  // DELETE /shops/admin/:id

// ── Public (wildcard last) ────────────────────────────────────────────────────
router.get('/',    listShopsHandler);   // GET /shops
router.get('/:id', getShopByIdHandler); // GET /shops/:id

export default router;
