import { Router } from 'express';
import authRoutes from './auth.routes';
import shopRoutes from './shop.routes';

const router = Router();

router.use('/auth',  authRoutes);
router.use('/shops', shopRoutes);

export default router;
