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

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/',     listShopsHandler);          // GET  /shops
router.get('/:id',  getShopByIdHandler);        // GET  /shops/:id

// ── Seller ───────────────────────────────────────────────────────────────────
router.post('/',    authMiddleware, requireRole(UserRole.SELLER), createShopHandler);   // POST /shops
router.get('/me',   authMiddleware, requireRole(UserRole.SELLER), getMyShopHandler);    // GET  /shops/me
router.put('/me',   authMiddleware, requireRole(UserRole.SELLER), updateMyShopHandler); // PUT  /shops/me

// ── Admin ────────────────────────────────────────────────────────────────────
router.get('/admin/all',       authMiddleware, requireRole(UserRole.ADMIN), listAllShopsAdminHandler);  // GET    /shops/admin/all
router.delete('/admin/:id',    authMiddleware, requireRole(UserRole.ADMIN), deleteShopAdminHandler);    // DELETE /shops/admin/:id

export default router;
