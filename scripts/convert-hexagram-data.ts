/**
 * 数据转换脚本：将前端的125卦数据转换为后端种子数据格式
 * 使用方法: npx tsx scripts/convert-hexagram-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// 卦象原始数据类型
type HexagramRawData = [
  number,   // 卦序
  string,   // 棋子组合
  string,   // 卦名
  string,   // 卦象
  string,   // 象曰
  string,   // 诗曰
  string,   // 吉凶
  string,   // 财运
  string,   // 健康
  string,   // 出行
  string    // 姻缘
];

// 读取前端数据文件
const dataFilePath = path.join(__dirname, '../data/hexagramData.ts');
const dataContent = fs.readFileSync(dataFilePath, 'utf-8');

// 提取 RAW_DATA 数组内容
const rawDataMatch = dataContent.match(/const RAW_DATA: HexagramRawData\[\] = \[([\s\S]*?)\];/);
if (!rawDataMatch) {
  console.error('无法找到 RAW_DATA 数组');
  process.exit(1);
}

// 手动解析数据（因为是 TypeScript 代码，需要特殊处理）
const rawDataString = rawDataMatch[1];

// 使用正则表达式提取每个卦象的数据
const hexagramPattern = /\[(\d+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*\n\s*'([^']+)',\s*\n\s*'([^']+)',\s*\n\s*'([^']+)',\s*\n\s*'([^']+)',\s*\n\s*'([^']+)',\s*\n\s*'([^']+)',\s*\n\s*'([^']+)'\]/g;

const hexagrams: any[] = [];
let match;

while ((match = hexagramPattern.exec(rawDataString)) !== null) {
  const [_, index, combination, name, guaXiang, xiangYue, poem, nature, wealth, health, travel, love] = match;

  hexagrams.push({
    id: index,
    number: `第${index}卦`,
    name: `${name}卦`,
    nature,
    subTitle: guaXiang,
    description: combination,
    xiang: xiangYue,
    poem,
    guidance: JSON.stringify({
      wealth,
      health,
      travel,
      love
    })
  });
}

console.log(`成功转换 ${hexagrams.length} 个卦象数据`);

// 生成 TypeScript 代码格式的数组
const outputLines: string[] = [];
outputLines.push('// 卦象数据 - 完整的125卦');
outputLines.push('const hexagrams = [');

hexagrams.forEach((hex, index) => {
  outputLines.push('  {');
  outputLines.push(`    id: '${hex.id}',`);
  outputLines.push(`    number: '${hex.number}',`);
  outputLines.push(`    name: '${hex.name}',`);
  outputLines.push(`    nature: '${hex.nature}',`);
  outputLines.push(`    subTitle: '${hex.subTitle}',`);
  outputLines.push(`    description: '${hex.description}',`);
  outputLines.push(`    xiang: '${hex.xiang}',`);
  outputLines.push(`    poem: '${hex.poem}',`);
  outputLines.push(`    guidance: JSON.stringify(${hex.guidance})`);
  outputLines.push(`  }${index < hexagrams.length - 1 ? ',' : ''}`);
});

outputLines.push('];');

// 输出到文件
const outputPath = path.join(__dirname, '../server/prisma/hexagram-data.ts');
fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf-8');

console.log(`数据已输出到: ${outputPath}`);
console.log('请将此文件的内容复制到 seed.ts 中的 hexagrams 数组');
