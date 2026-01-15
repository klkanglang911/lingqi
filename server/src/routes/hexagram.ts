// 卦象路由

import { Router } from 'express';
import { getAllHexagrams, getHexagramById, getRandomHexagram } from '../controllers/hexagram.js';

const router = Router();

router.get('/', getAllHexagrams);
router.get('/random', getRandomHexagram);
router.get('/:id', getHexagramById);

export default router;
