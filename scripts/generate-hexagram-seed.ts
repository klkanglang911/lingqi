/**
 * 生成卦象种子数据
 * 使用方法: npx tsx scripts/generate-hexagram-seed.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 直接从前端导入数据
import { getAllHexagrams } from '../data/hexagramData.js';

async function main() {
  console.log('开始生成卦象种子数据...');

  // 获取所有卦象数据
  const hexagrams = getAllHexagrams();
  console.log(`获取到 ${hexagrams.length} 个卦象`);

  // 转换为后端格式
  const seedData = hexagrams.map(hex => ({
    id: hex.id,
    number: hex.number,
    name: hex.name,
    nature: hex.nature,
    subTitle: hex.subTitle,
    description: hex.description,
    xiang: hex.xiang || '',
    poem: hex.poem,
    guidance: JSON.stringify(hex.guidance)
  }));

  // 生成 TypeScript 代码
  const output = `// 自动生成的卦象数据 - 请勿手动编辑
// 生成时间: ${new Date().toISOString()}

export const hexagramSeedData = ${JSON.stringify(seedData, null, 2)};
`;

  // 写入文件
  const outputPath = path.join(__dirname, '../server/prisma/hexagram-seed-data.ts');
  fs.writeFileSync(outputPath, output, 'utf-8');

  console.log(`✓ 成功生成 ${seedData.length} 个卦象数据`);
  console.log(`✓ 输出文件: ${outputPath}`);
}

main().catch(console.error);
