// 认证路由

import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

export default router;
