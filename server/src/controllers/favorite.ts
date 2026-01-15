// 收藏控制器

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取收藏列表
export const getFavorites = async (req: Request, res: Response) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.userId },
      include: { hexagram: true },
      orderBy: { createdAt: 'desc' },
    });

    const data = favorites.map(f => ({
      ...f,
      hexagram: { ...f.hexagram, guidance: JSON.parse(f.hexagram.guidance) },
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 添加收藏
export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { hexagramId } = req.body;

    const favorite = await prisma.favorite.create({
      data: { userId: req.user!.userId, hexagramId },
      include: { hexagram: true },
    });

    res.status(201).json({
      success: true,
      data: {
        ...favorite,
        hexagram: { ...favorite.hexagram, guidance: JSON.parse(favorite.hexagram.guidance) },
      },
    });
  } catch (error) {
    console.error('添加收藏失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 取消收藏
export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.favorite.deleteMany({
      where: { id, userId: req.user!.userId },
    });

    res.json({ success: true, message: '取消收藏成功' });
  } catch (error) {
    console.error('取消收藏失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};
