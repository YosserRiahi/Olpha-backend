import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import {
  listPendingSellersHandler,
  approveSellerHandler,
  rejectSellerHandler,
  deleteShopAdminHandler,
  listAllSellersHandler,
  listAllShopsHandler,
  listAllUsersHandler,
  getStatsHandler,
} from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authMiddleware, requireRole(UserRole.ADMIN));

// ── Stats ─────────────────────────────────────────────────────────────────────
router.get('/stats',                getStatsHandler);             // GET  /admin/stats

// ── Users ─────────────────────────────────────────────────────────────────────
router.get('/users',                listAllUsersHandler);         // GET  /admin/users

// ── Sellers ───────────────────────────────────────────────────────────────────
router.get('/sellers',              listAllSellersHandler);       // GET  /admin/sellers
router.get('/sellers/pending',      listPendingSellersHandler);   // GET  /admin/sellers/pending
router.put('/sellers/:id/approve',  approveSellerHandler);        // PUT  /admin/sellers/:id/approve
router.put('/sellers/:id/reject',   rejectSellerHandler);         // PUT  /admin/sellers/:id/reject

// ── Shops (no approval — auto-approved on creation) ───────────────────────────
router.get('/shops',                listAllShopsHandler);         // GET  /admin/shops
router.delete('/shops/:id',         deleteShopAdminHandler);      // DELETE /admin/shops/:id

export default router;
