import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import {
  createShopHandler,
  getMyShopHandler,
  updateMyShopHandler,
  listShopsHandler,
  getShopByIdHandler,
  listPendingShopsHandler,
  approveShopHandler,
  rejectShopHandler,
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
router.get('/admin/pending',      authMiddleware, requireRole(UserRole.ADMIN), listPendingShopsHandler);     // GET  /shops/admin/pending
router.put('/admin/:id/approve',  authMiddleware, requireRole(UserRole.ADMIN), approveShopHandler);          // PUT  /shops/admin/:id/approve
router.delete('/admin/:id/reject',authMiddleware, requireRole(UserRole.ADMIN), rejectShopHandler);           // DELETE /shops/admin/:id/reject

export default router;
