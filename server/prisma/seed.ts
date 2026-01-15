// 数据库种子文件 - 初始化卦象和文章数据

import { PrismaClient } from '@prisma/client';
import { hexagramSeedData } from './hexagram-seed-data.js';

const prisma = new PrismaClient();

// 文章数据
const articles = [
  {
    id: 'origin',
    title: '灵棋经起源',
    subtitle: '灵棋经源于汉魏，盛于隋唐。探寻智慧源头。',
    category: '历史源流',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKjPSX7ePyksgZtB2V0kHSXi75f0yL8paR7UuNpetn7Dw_lN2SA1JqW5hvOvkfQf6jWDKZ__M0wXhMR65Csv8wMKLMm39vdvz7dN2ZzvDv8LHvkTdgQ8yqkdCiPcosNFSmPUdAPvFYJ3hd2d7yrPh_r7oi-MmbirEOJXITyBlASNRE68bdPa0rAwZWIP9L1u-5orhVdc5POVcDi3O2-S3clmZ5Sh6cnw04qFccGsaAsSFu5GW7PSy_ChbWdFvkGb_xNWAeaauA7mNk',
    content: '<p>《灵棋经》是中国古代一种独特的占卜术...</p>'
  },
  {
    id: 'coins',
    title: '十二棋子之义',
    subtitle: '上中下三才，四象十二位。解析棋子背后的宇宙观。',
    category: '器物解析',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2l7j5-x260smN67nhI8SaaTEhZxrjxC43PTPWqXtto2dQOeY4JnKYVzDaJ0XtUn8aI_q1gL6Ty8ycbyZswsOKqB0-qUgzlhkdAs3cUN94BH49BINnzA9inGCjrLL-g9Kz5S_W8I_sS2kDGpM32xNdRKMu8DBIhhiYaULHMtbemi2mMAVFo3DgBRwG_wI_ts9fs8BlAb9_-bV16WSPuC6Wslr2_CpFCtjtblMlrjZ9WcIzOdhkpyo1ZsVVxtVaDhNGgH_aLiA6S_je',
    content: '<p>灵棋经所用的十二枚棋子，并非随意设定...</p>'
  },
  {
    id: 'how_to',
    title: '如何解卦',
    subtitle: '心诚则灵，意动卦成。详解占卜步骤与心态。',
    category: '入门指南',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2pa7mJinOFDE-GTLQF7KbuvfHwDivPG5kb2_PlYOJ4RD-6FplTTcF9HKT-olzI3Ouk5PiiPxFgiyZYVoIlK8q23NWshck_6CYLQIWDKvx1kKZ-OmJCHbsT2mJp-d7P5kYCsj2uG1MkhhglSlon7AvYVzvEKt9wbsjh0b3oByArA4oiLSeiPpSNsM0kLm5TY9ezK2kokxsng_E1Sk-KYoGSsP4Yu7GOPpWW4nV1cukJDATgnKbU8JEgHNSAHFDdtRsut3EgRWUiRmV',
    content: '<p>解卦不仅是技巧，更是一种心境的修炼...</p>'
  },
  {
    id: 'chart',
    title: '百二十五卦图谱',
    subtitle: '完整收录一百二十五卦象，图文并茂。',
    category: '进阶典籍',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBHNrLePV5b_ZmK-JHWMaWQzvzTGugvPRCJ7NnOITDr53WNxz0u9kOp-84zv1YOyaU_arfHIVGG-REKRv6UFkneDQDCiaz5EFN4JlHeg9o4OT2tQYHr9WvRKu1QW24aY81DwDPJANcXrgUca8PjJ2H__kb1ttNb99klTObOnCT-qkodU081unMNfRVbBdxsmszTnk2RWnYOvMC6pMjVn4q4XFuP-R_hXu1HXEinZEw5xz7dkYz1tdNJhWo3O5m4giwOq-KpIymxWwU',
    content: '<p>灵棋经共有一百二十五卦...</p>'
  }
];

async function main() {
  console.log('开始初始化数据库...');

  // 清空现有数据
  await prisma.favorite.deleteMany();
  await prisma.divination.deleteMany();
  await prisma.hexagram.deleteMany();
  await prisma.article.deleteMany();

  // 插入卦象数据（完整的125卦）
  console.log(`准备插入 ${hexagramSeedData.length} 个卦象...`);
  for (const hex of hexagramSeedData) {
    await prisma.hexagram.create({ data: hex });
  }
  console.log(`✓ 已插入 ${hexagramSeedData.length} 个卦象`);

  // 插入文章数据
  for (const article of articles) {
    await prisma.article.create({ data: article });
  }
  console.log(`✓ 已插入 ${articles.length} 篇文章`);

  console.log('数据库初始化完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
