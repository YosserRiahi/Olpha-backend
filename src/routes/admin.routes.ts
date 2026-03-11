import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import {
  listPendingSellersHandler,
  approveSellerHandler,
  rejectSellerHandler,
  listPendingShopsAdminHandler,
  approveShopAdminHandler,
  rejectShopAdminHandler,
} from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authMiddleware, requireRole(UserRole.ADMIN));

// ── Seller approval ──────────────────────────────────────────────────────────
router.get('/sellers/pending',      listPendingSellersHandler);   // GET  /admin/sellers/pending
router.put('/sellers/:id/approve',  approveSellerHandler);        // PUT  /admin/sellers/:id/approve
router.put('/sellers/:id/reject',   rejectSellerHandler);         // PUT  /admin/sellers/:id/reject

// ── Shop approval ────────────────────────────────────────────────────────────
router.get('/shops/pending',        listPendingShopsAdminHandler);// GET  /admin/shops/pending
router.put('/shops/:id/approve',    approveShopAdminHandler);     // PUT  /admin/shops/:id/approve
router.delete('/shops/:id/reject',  rejectShopAdminHandler);      // DELETE /admin/shops/:id/reject

export default router;
