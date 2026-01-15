// 文章路由

import { Router } from 'express';
import { getAllArticles, getArticleById } from '../controllers/article.js';

const router = Router();

router.get('/', getAllArticles);
router.get('/:id', getArticleById);

export default router;
