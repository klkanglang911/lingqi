// 数据库种子文件 - 初始化卦象和文章数据

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 卦象数据
const hexagrams = [
  {
    id: '12',
    number: '第十二卦',
    name: '大安卦',
    nature: '上吉',
    subTitle: '万事大吉',
    description: '身不动，无磨难。事事安稳，静待时机。平安即是福，宜静不宜动。',
    xiang: '风吹杨柳，而且安稳。君子以居安思危。',
    poem: '日新其德，是为大宝。',
    guidance: JSON.stringify({
      wealth: '积蓄力量，时机成熟。适合储蓄和长期投资，不宜铺张浪费。耐心等待将有丰厚回报。',
      health: '注意修养生息。内在调理和呼吸吐纳最为有益。避免过度劳累，保持精力充沛。',
      travel: '可能会有短暂延误，但这正是准备的好时机。出发前做足功课，目的地值得等待。',
      love: '稳固的情感纽带正在形成。共同的价值观和相互尊重是基础。多花时间深入了解彼此。'
    })
  },
  {
    id: '26',
    number: '第二十六卦',
    name: '大畜卦',
    nature: '上吉',
    subTitle: '山天大畜',
    description: '大畜：利贞。不家食，吉。利涉大川。',
    xiang: '天在山中，大畜；君子以多识前言往行，以畜其德。',
    poem: '日新其德，是为大宝。',
    guidance: JSON.stringify({
      wealth: '积蓄力量，时机成熟。适合储蓄和长期投资。',
      health: '注意修养生息。',
      travel: '利涉大川，出行顺利。',
      love: '情感深厚，积淀良缘。'
    })
  }
];

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

  // 插入卦象数据
  for (const hex of hexagrams) {
    await prisma.hexagram.create({ data: hex });
  }
  console.log(`已插入 ${hexagrams.length} 个卦象`);

  // 插入文章数据
  for (const article of articles) {
    await prisma.article.create({ data: article });
  }
  console.log(`已插入 ${articles.length} 篇文章`);

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
