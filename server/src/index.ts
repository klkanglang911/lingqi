// 服务器入口文件

import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';

// 路由导入
import authRoutes from './routes/auth.js';
import hexagramRoutes from './routes/hexagram.js';
import divinationRoutes from './routes/divination.js';
import articleRoutes from './routes/article.js';
import favoriteRoutes from './routes/favorite.js';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由注册
app.use('/api/auth', authRoutes);
app.use('/api/hexagrams', hexagramRoutes);
app.use('/api/divinations', divinationRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/favorites', favoriteRoutes);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(config.port, () => {
  console.log(`服务器运行在 http://localhost:${config.port}`);
});
