import React, { useMemo } from 'react';
import { Screen } from '../types';
import { getRandomHexagram } from '../constants';
import { numberToChinese } from '../utils';

interface ResultProps {
  onNavigate: (screen: Screen) => void;
  setDetailId: (id: string) => void;
}

// 解析棋子组合字符串，返回上中下各多少颗阳棋
const parseCoinCombination = (description: string): { upper: number; middle: number; lower: number } => {
  const numMap: Record<string, number> = { '一': 1, '二': 2, '三': 3, '四': 4 };
  let upper = 0, middle = 0, lower = 0;

  // 匹配格式如 "一上四中一下" 或 "三中" 或 "纯阴馒"
  const upperMatch = description.match(/([一二三四])上/);
  const middleMatch = description.match(/([一二三四])中/);
  const lowerMatch = description.match(/([一二三四])下/);

  if (upperMatch) upper = numMap[upperMatch[1]] || 0;
  if (middleMatch) middle = numMap[middleMatch[1]] || 0;
  if (lowerMatch) lower = numMap[lowerMatch[1]] || 0;

  return { upper, middle, lower };
};

// 将"第N卦"转换为"第X卦"（X是中文数字）
const convertNumberToChinese = (numberText: string): string => {
  // 匹配"第N卦"格式，提取数字N
  const match = numberText.match(/第(\d+)卦/);
  if (match) {
    const num = parseInt(match[1], 10);
    return `第${numberToChinese(num)}卦`;
  }
  return numberText; // 如果格式不匹配，返回原文本
};

export const Result: React.FC<ResultProps> = ({ onNavigate, setDetailId }) => {
  // 随机获取卦象（使用 useMemo 确保在组件生命周期内保持不变）
  const hexagram = useMemo(() => getRandomHexagram(), []);

  // 解析当前卦象的棋子组合
  const coinCounts = useMemo(() => parseCoinCombination(hexagram.description), [hexagram.description]);

  const handleDetail = () => {
    setDetailId(hexagram.id);
    onNavigate(Screen.DETAIL);
  };

  // 棋子行组件，activeCount 为高亮（阳）棋子数量
  const CoinRow = ({ label, activeCount }: { label: string; activeCount: number }) => (
    <div className="flex flex-col items-center gap-2 w-full animate-[fadeIn_0.5s_ease-out_forwards]">
      <span className="text-xs uppercase tracking-[0.2em] text-primary/60 font-semibold">{label}</span>
      <div className="flex items-center justify-center gap-3 bg-black/20 px-6 py-4 rounded-2xl w-full border border-white/5 shadow-inner">
        {[1, 2, 3, 4].map(i => {
          const isActive = i <= activeCount;
          return (
            <div key={i} className="relative group">
              <span className={`material-symbols-outlined text-3xl transition-all duration-300 ${
                isActive
                  ? 'text-primary shadow-[0_0_15px_rgba(17,180,212,0.5)]'
                  : 'text-slate-600/50'
              }`}>
                {isActive ? 'circle' : 'trip_origin'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col h-full w-full bg-background-dark/50 backdrop-blur-sm">
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow"></div>
      </div>

      <header className="flex items-center justify-center p-4 sticky top-0 z-50">
        <h2 className="text-white text-base font-medium tracking-wide opacity-80">灵棋卦象</h2>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-4 w-full gap-8 z-10 overflow-y-auto no-scrollbar">
        {/* Coins Visual */}
        <div className="w-full flex flex-col gap-6 items-center my-4 max-w-sm">
          <CoinRow label="上位" activeCount={coinCounts.upper} />
          <CoinRow label="中位" activeCount={coinCounts.middle} />
          <CoinRow label="下位" activeCount={coinCounts.lower} />
        </div>

        {/* Result Text */}
        <div className="flex flex-col items-center gap-4 text-center mt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
            <span className="material-symbols-outlined text-primary text-base">auto_awesome</span>
            <span className="text-primary text-sm font-bold tracking-wide">{hexagram.nature}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-slate-400 text-sm tracking-widest uppercase font-medium">{convertNumberToChinese(hexagram.number)}</span>
            <h1 className="text-5xl md:text-6xl font-normal leading-tight font-calligraphy py-2 text-transparent bg-clip-text bg-gradient-to-b from-[#f3e5ab] to-[#d4af37] drop-shadow-sm">
              {hexagram.name}
            </h1>
            <p className="text-[#d4af37]/80 text-lg font-medium tracking-wide">{hexagram.subTitle}</p>
          </div>
        </div>

        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <p className="text-slate-400 text-sm leading-relaxed text-center max-w-xs font-serif italic">
          {hexagram.description}
        </p>
      </main>

      <footer className="p-6 pb-28 flex flex-col gap-3 w-full z-20">
        <button
          onClick={handleDetail}
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative text-background-dark text-lg font-bold tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined">menu_book</span>
            查看解卦
          </span>
        </button>
      </footer>
    </div>
  );
};
