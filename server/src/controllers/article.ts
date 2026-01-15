// 文章控制器

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取所有文章
export const getAllArticles = async (_req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany();
    res.json({ success: true, data: articles });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取单篇文章
export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }

    res.json({ success: true, data: article });
  } catch (error) {
    console.error('获取文章详情失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};
