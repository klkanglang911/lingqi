
import { HexagramData, ArticleData } from './types';
import { HEXAGRAM_DATA, getHexagramById, getRandomHexagram } from './data/hexagramData';

// 导出完整的125卦数据
export const MOCK_HEXAGRAMS: Record<string, HexagramData> = HEXAGRAM_DATA;

// 重新导出便捷函数
export { getHexagramById, getRandomHexagram };

export const MOCK_HISTORY = [
  {
    ...MOCK_HEXAGRAMS['26'],
    id: 'h1',
    date: '10月24日',
    queryType: '事业问卜',
    timestamp: Date.now() - 100000
  },
  {
    ...MOCK_HEXAGRAMS['12'],
    id: 'h2',
    date: '09月15日',
    queryType: '财运问卜',
    timestamp: Date.now() - 2000000
  }
];

export const MOCK_ARTICLES: Record<string, ArticleData> = {
  'origin': {
    id: 'origin',
    title: '灵棋经起源',
    subtitle: '灵棋经源于汉魏，盛于隋唐。探寻智慧源头。',
    category: '历史源流',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKjPSX7ePyksgZtB2V0kHSXi75f0yL8paR7UuNpetn7Dw_lN2SA1JqW5hvOvkfQf6jWDKZ__M0wXhMR65Csv8wMKLMm39vdvz7dN2ZzvDv8LHvkTdgQ8yqkdCiPcosNFSmPUdAPvFYJ3hd2d7yrPh_r7oi-MmbirEOJXITyBlASNRE68bdPa0rAwZWIP9L1u-5orhVdc5POVcDi3O2-S3clmZ5Sh6cnw04qFccGsaAsSFu5GW7PSy_ChbWdFvkGb_xNWAeaauA7mNk',
    content: `
      <p>《灵棋经》是中国古代一种独特的占卜术，相传由黄石公传授给张良，后经东方朔等人流传，至隋唐时期逐渐完善。它不同于《周易》的蓍草占卜或铜钱六爻，而是使用十二枚特制的棋子进行占卜。</p>
      <br/>
      <p><strong>一、成书背景</strong></p>
      <p>灵棋经的出现，反映了古代人们对于未知的探索以及对于天人合一思想的追求。它结合了阴阳五行学说，通过棋子的排列组合，模拟宇宙万物的变化规律，从而推断人事的吉凶祸福。</p>
      <br/>
      <p><strong>二、历史传承</strong></p>
      <p>历代对于《灵棋经》多有注疏，其中以明代刘基（刘伯温）的注本最为流行。刘基认为灵棋经“非圣人不能作”，对其推崇备至。在民间，灵棋经也因其操作简便、断语直观而广为流传。</p>
      <br/>
      <p><strong>三、现代价值</strong></p>
      <p>今天我们研习《灵棋经》，更多的是从文化和心理的角度去理解古人的智慧，将其视为一种修身养性、启迪思维的工具，而非迷信盲从。</p>
    `
  },
  'coins': {
    id: 'coins',
    title: '十二棋子之义',
    subtitle: '上中下三才，四象十二位。解析棋子背后的宇宙观。',
    category: '器物解析',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2l7j5-x260smN67nhI8SaaTEhZxrjxC43PTPWqXtto2dQOeY4JnKYVzDaJ0XtUn8aI_q1gL6Ty8ycbyZswsOKqB0-qUgzlhkdAs3cUN94BH49BINnzA9inGCjrLL-g9Kz5S_W8I_sS2kDGpM32xNdRKMu8DBIhhiYaULHMtbemi2mMAVFo3DgBRwG_wI_ts9fs8BlAb9_-bV16WSPuC6Wslr2_CpFCtjtblMlrjZ9WcIzOdhkpyo1ZsVVxtVaDhNGgH_aLiA6S_je',
    content: `
      <p>灵棋经所用的十二枚棋子，并非随意设定，而是有着深刻的象征意义。</p>
      <br/>
      <p><strong>上四子：</strong>代表天，象征天道运行，主宰万物。通常刻有“上”字。</p>
      <p><strong>中四子：</strong>代表得，象征人伦道德，社会秩序。通常刻有“中”字。</p>
      <p><strong>下四子：</strong>代表地，象征大地承载，厚德载物。通常刻有“下”字。</p>
      <br/>
      <p>这三组棋子分别对应“三才”——天、地、人。在占卜时，通过投掷这十二枚棋子，观察其正反面的组合（阳为显，阴为藏），从而得出卦象。</p>
    `
  },
  'how_to': {
    id: 'how_to',
    title: '如何解卦',
    subtitle: '心诚则灵，意动卦成。详解占卜步骤与心态。',
    category: '入门指南',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2pa7mJinOFDE-GTLQF7KbuvfHwDivPG5kb2_PlYOJ4RD-6FplTTcF9HKT-olzI3Ouk5PiiPxFgiyZYVoIlK8q23NWshck_6CYLQIWDKvx1kKZ-OmJCHbsT2mJp-d7P5kYCsj2uG1MkhhglSlon7AvYVzvEKt9wbsjh0b3oByArA4oiLSeiPpSNsM0kLm5TY9ezK2kokxsng_E1Sk-KYoGSsP4Yu7GOPpWW4nV1cukJDATgnKbU8JEgHNSAHFDdtRsut3EgRWUiRmV',
    content: `
      <p>解卦不仅是技巧，更是一种心境的修炼。</p>
      <br/>
      <p><strong>1. 净手焚香</strong></p>
      <p>以示诚敬。环境宜安静，避免嘈杂干扰。</p>
      <br/>
      <p><strong>2. 默念所求</strong></p>
      <p>心中专注于所问之事，问题宜具体明确，不可含糊其辞，亦不可心存恶念。</p>
      <br/>
      <p><strong>3. 掷棋成卦</strong></p>
      <p>双手合扣棋子，摇动数次后掷于盘中。根据棋子的正反情况（有字为阳，无字为阴）记录结果。</p>
      <br/>
      <p><strong>4. 查阅卦辞</strong></p>
      <p>根据得出的上、中、下三组数字组合，查阅《灵棋经》中对应的卦辞。结合当下的处境，体悟卦辞中的哲理指引。</p>
    `
  },
  'chart': {
    id: 'chart',
    title: '一百二十五卦图谱',
    subtitle: '完整收录一百二十五卦象，图文并茂。',
    category: '进阶典籍',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBHNrLePV5b_ZmK-JHWMaWQzvzTGugvPRCJ7NnOITDr53WNxz0u9kOp-84zv1YOyaU_arfHIVGG-REKRv6UFkneDQDCiaz5EFN4JlHeg9o4OT2tQYHr9WvRKu1QW24aY81DwDPJANcXrgUca8PjJ2H__kb1ttNb99klTObOnCT-qkodU081unMNfRVbBdxsmszTnk2RWnYOvMC6pMjVn4q4XFuP-R_hXu1HXEinZEw5xz7dkYz1tdNJhWo3O5m4giwOq-KpIymxWwU',
    content: `
      <p>灵棋经共有一百二十五卦，每一卦都有其独特的名称、卦象和断语。这125卦涵盖了人生的方方面面，从生活琐事到国家大事，皆可从中寻找启示。</p>
      <br/>
      <p><strong>一、卦象结构</strong></p>
      <p>灵棋经使用十二枚棋子进行占卜，分为上、中、下三位，每位四枚棋子。棋子分阴阳两面，阳面为圆点，阴面为空白。根据三位中阳棋的数量组合，共形成125种不同的卦象。</p>
      <br/>
      <p><strong>二、卦象分类</strong></p>
      <p>125卦按吉凶性质可分为：</p>
      <p>• 上吉卦：大吉大利，诸事亨通</p>
      <p>• 中吉卦：吉中带平，稳中求进</p>
      <p>• 平卦：不吉不凶，守成为宜</p>
      <p>• 凶卦：需谨慎行事，化解不利</p>
      <br/>
      <p><strong>三、如何使用图谱</strong></p>
      <p>1. 根据占卜结果，记录上、中、下三位的阳棋数量</p>
      <p>2. 在图谱中查找对应的卦象编号</p>
      <p>3. 阅读卦名、卦辞、象曰、诗曰等内容</p>
      <p>4. 结合具体问题，领悟卦象指引</p>
      <br/>
      <p><strong>四、经典卦象示例</strong></p>
      <p>• 第1卦"大通卦"（一上一中一下）：升腾之象，从小至大，自下升高</p>
      <p>• 第91卦"攸叙卦"（三中三下）：保宁之象，凤凰衔珠，福为我致</p>
      <p>• 第125卦"纯阴卦"（纯阴）：静待之象，阴极阳生，守静待时</p>
      <br/>
      <p><strong>五、查找技巧</strong></p>
      <p>初学者可先熟悉常见卦象，如纯阳卦、纯阴卦、平衡卦等。随着经验积累，逐渐掌握全部125卦的含义和应用场景。建议配合实际占卜练习，加深理解。</p>
    `
  }
};
