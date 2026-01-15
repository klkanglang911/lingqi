// 收藏路由

import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favorite.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:id', removeFavorite);

export default router;
