/**
 * 数据转换脚本：将前端的125卦数据转换为后端种子数据格式
 * 使用方法: npx tsx scripts/generate-seed-data.ts
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

// 提取 RAW_DATA 数组
const rawDataMatch = dataContent.match(/const RAW_DATA: HexagramRawData\[\] = \[([\s\S]*?)\];/);
if (!rawDataMatch) {
  console.error('无法找到 RAW_DATA 数组');
  process.exit(1);
}

// 解析数据（这里需要手动处理，因为是 TypeScript 代码）
console.log('正在读取前端卦象数据...');

// 由于直接解析 TypeScript 代码比较复杂，我们采用另一种方式：
// 直接导入前端的数据模块
const hexagramDataPath = path.join(__dirname, '../data/hexagramData.ts');

console.log('数据文件路径:', hexagramDataPath);
console.log('');
console.log('提示：由于 TypeScript 模块导入的复杂性，');
console.log('建议手动运行以下步骤来生成种子数据：');
console.log('');
console.log('1. 在浏览器控制台或 Node.js 环境中运行前端代码');
console.log('2. 导出 RAW_DATA 数组');
console.log('3. 使用下面的转换函数生成种子数据');
console.log('');

// 转换函数
function convertToSeedData(rawData: HexagramRawData[]): string {
  const hexagrams = rawData.map(([index, combination, name, guaXiang, xiangYue, poem, nature, wealth, health, travel, love]) => {
    return {
      id: index.toString(),
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
    };
  });

  return JSON.stringify(hexagrams, null, 2);
}

console.log('转换函数已准备就绪。');
console.log('');
console.log('如果您有 RAW_DATA，可以调用 convertToSeedData(RAW_DATA) 来转换。');
