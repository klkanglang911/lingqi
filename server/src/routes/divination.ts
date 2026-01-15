// 占卜历史路由

import { Router } from 'express';
import { getDivinations, createDivination, deleteDivination } from '../controllers/divination.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getDivinations);
router.post('/', createDivination);
router.delete('/:id', deleteDivination);

export default router;
