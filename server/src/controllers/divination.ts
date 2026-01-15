// 占卜历史控制器

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取用户占卜历史
export const getDivinations = async (req: Request, res: Response) => {
  try {
    const divinations = await prisma.divination.findMany({
      where: { userId: req.user!.userId },
      include: { hexagram: true },
      orderBy: { createdAt: 'desc' },
    });

    const data = divinations.map(d => ({
      ...d,
      hexagram: { ...d.hexagram, guidance: JSON.parse(d.hexagram.guidance) },
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('获取占卜历史失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 创建占卜记录
export const createDivination = async (req: Request, res: Response) => {
  try {
    const { hexagramId, queryType, question } = req.body;

    const divination = await prisma.divination.create({
      data: {
        userId: req.user!.userId,
        hexagramId,
        queryType,
        question,
      },
      include: { hexagram: true },
    });

    res.status(201).json({
      success: true,
      data: {
        ...divination,
        hexagram: { ...divination.hexagram, guidance: JSON.parse(divination.hexagram.guidance) },
      },
    });
  } catch (error) {
    console.error('创建占卜记录失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 删除占卜记录
export const deleteDivination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.divination.deleteMany({
      where: { id, userId: req.user!.userId },
    });

    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除占卜记录失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};
