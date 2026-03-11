import { Router } from 'express';
import { registerHandler, loginHandler, refreshHandler, getMeHandler } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerHandler);
router.post('/login',    loginHandler);
router.post('/refresh',  refreshHandler);
router.get('/me',        authMiddleware, getMeHandler);

export default router;
