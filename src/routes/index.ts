import { Router } from 'express';
import authRoutes    from './auth.routes';
import shopRoutes    from './shop.routes';
import adminRoutes   from './admin.routes';
import productRoutes from './product.routes';

const router = Router();

router.use('/auth',     authRoutes);
router.use('/shops',    shopRoutes);
router.use('/admin',    adminRoutes);
router.use('/products', productRoutes);

export default router;
