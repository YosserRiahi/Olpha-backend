import { Router } from 'express';
import { registerHandler, loginHandler, refreshHandler, getMeHandler, updateProfileHandler } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerHandler);
router.post('/login',    loginHandler);
router.post('/refresh',  refreshHandler);
router.get('/me',        authMiddleware, getMeHandler);
router.patch('/me',      authMiddleware, updateProfileHandler);

export default router;
