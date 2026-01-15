// 卦象数据控制器

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取所有卦象
export const getAllHexagrams = async (_req: Request, res: Response) => {
  try {
    const hexagrams = await prisma.hexagram.findMany();

    // 解析 guidance JSON
    const data = hexagrams.map(h => ({
      ...h,
      guidance: JSON.parse(h.guidance),
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('获取卦象列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取单个卦象
export const getHexagramById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hexagram = await prisma.hexagram.findUnique({ where: { id } });

    if (!hexagram) {
      return res.status(404).json({ success: false, message: '卦象不存在' });
    }

    res.json({
      success: true,
      data: { ...hexagram, guidance: JSON.parse(hexagram.guidance) },
    });
  } catch (error) {
    console.error('获取卦象详情失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 随机获取一个卦象（用于占卜）
export const getRandomHexagram = async (_req: Request, res: Response) => {
  try {
    const count = await prisma.hexagram.count();
    const skip = Math.floor(Math.random() * count);

    const hexagrams = await prisma.hexagram.findMany({
      take: 1,
      skip: skip,
    });

    if (hexagrams.length === 0) {
      return res.status(404).json({ success: false, message: '暂无卦象数据' });
    }

    const hexagram = hexagrams[0];
    res.json({
      success: true,
      data: { ...hexagram, guidance: JSON.parse(hexagram.guidance) },
    });
  } catch (error) {
    console.error('随机获取卦象失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};
