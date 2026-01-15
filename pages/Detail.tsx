import React from 'react';
import { Screen } from '../types';
import { MOCK_HEXAGRAMS } from '../constants';

interface DetailProps {
  onNavigate: (screen: Screen) => void;
  id: string;
}

export const Detail: React.FC<DetailProps> = ({ onNavigate, id }) => {
  const hexagram = MOCK_HEXAGRAMS[id] || MOCK_HEXAGRAMS['12'];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `灵棋经 - ${hexagram.name}`,
          text: hexagram.description,
          url: window.location.href, // In a real app, this would be a deep link
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback for desktop/unsupported browsers
      alert(`已复制分享内容：\n${hexagram.name}\n${hexagram.description}`);
    }
  };

  const handleSave = () => {
    try {
      // 从localStorage读取现有历史记录
      const existingHistory = localStorage.getItem('lingqi_history');
      const history = existingHistory ? JSON.parse(existingHistory) : [];

      // 生成日期字符串（格式：MM月DD日）
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const dateStr = `${month}月${day}日`;

      // 生成唯一ID
      const newId = `h${Date.now()}`;

      // 创建新的历史记录项
      const newHistoryItem = {
        ...hexagram,
        id: newId,
        hexagramId: hexagram.id, // 保留卦象的原始ID，用于跳转到详情页
        date: dateStr,
        queryType: '占卜记录',
        timestamp: Date.now()
      };

      // 将新记录添加到数组开头（最新的在前面）
      history.unshift(newHistoryItem);

      // 保存到localStorage
      localStorage.setItem('lingqi_history', JSON.stringify(history));

      // 给用户反馈
      alert('卦象已保存到历史记录');

      // 导航到历史记录页面
      onNavigate(Screen.HISTORY);
    } catch (err) {
      console.error('保存失败:', err);
      alert('保存失败，请重试');
    }
  };

  // Helper component for guidance cards
  const GuidanceCard = ({ 
    title, 
    text, 
    icon, 
    bgIcon 
  }: { 
    title: string; 
    text: string; 
    icon: string; 
    bgIcon: string; 
  }) => (
    <div className="relative overflow-hidden rounded-xl bg-[#152023] border border-white/5 p-4 shadow-sm group hover:border-primary/20 transition-colors">
      {/* Background Watermark Icon */}
      <div className="absolute top-1/2 -right-2 -translate-y-1/2 opacity-[0.03] pointer-events-none transition-transform group-hover:scale-110 duration-500">
        <span className="material-symbols-outlined text-[80px]">{bgIcon}</span>
      </div>
      
      <div className="flex gap-4 relative z-10">
        {/* Icon Box */}
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#1a2c30] text-primary shadow-[0_0_10px_rgba(17,180,212,0.1)]">
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        
        {/* Content */}
        <div className="flex flex-col gap-1.5 pt-0.5">
          <h4 className="text-base font-bold text-white tracking-wide">{title}</h4>
          <p className="text-sm text-slate-400 leading-relaxed text-justify font-light">
            {text}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative h-full w-full bg-[#0d1619] text-white font-sans overflow-hidden flex flex-col">
       {/* Background Gradient */}
       <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 right-0 h-[80%] bg-gradient-to-b from-[#101f22] to-[#0d1619]"></div>
       </div>
       
       {/* Header */}
       <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0d1619]/80 backdrop-blur-md">
        <button onClick={() => onNavigate(Screen.RESULT)} className="flex size-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-white text-[24px]">arrow_back_ios_new</span>
        </button>
        <h1 className="text-base font-bold tracking-wide opacity-90">天命启示</h1>
        <button onClick={handleShare} className="flex size-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-[24px]">share</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col px-5 pb-32 gap-8 overflow-y-auto no-scrollbar z-10 pt-4">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center animate-fade-in relative mt-2">
            {/* Hexagram Visual Box */}
            <div className="relative size-40 rounded-2xl bg-black/40 shadow-[0_0_50px_-10px_rgba(17,180,212,0.15)] border border-white/5 flex items-center justify-center overflow-hidden mb-6 group ring-1 ring-white/5">
                {/* Glow behind lines */}
                <div className="absolute inset-0 bg-primary/5 blur-xl"></div>
                
                {/* Simulated Neon Hexagram Lines */}
                <div className="flex flex-col gap-2.5 w-20 z-10 opacity-90">
                     {/* Using CSS to draw the lines to look like the screenshot */}
                     <div className="h-1 w-full bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                     <div className="flex justify-between h-1 w-full gap-2">
                        <div className="w-full bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                        <div className="w-full bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                     </div>
                     <div className="flex justify-between h-1 w-full gap-2">
                        <div className="w-full bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                        <div className="w-full bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                     </div>
                     <div className="h-1 w-full bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                     <div className="h-1 w-full bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                     <div className="h-1 w-full bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                </div>
            </div>

            {/* Titles */}
            <div className="text-center flex flex-col items-center gap-2">
                <h2 className="text-4xl font-serif tracking-[0.1em] text-white drop-shadow-sm">{hexagram.name}</h2>
                <div className="flex flex-col items-center gap-1.5 mt-1">
                    <p className="text-primary text-base font-normal tracking-wider">{hexagram.subTitle}</p>
                    {/* Decorative Underline */}
                    <div className="w-8 h-1 bg-primary/80 rounded-full"></div>
                </div>
            </div>
        </section>

        {/* Interpretation Card - Fixed Content (Non-collapsible) */}
        <section
            className="bg-[#152023] rounded-2xl border border-white/5 shadow-lg relative ring-1 ring-white/5 p-6 flex-shrink-0"
        >
             {/* Watermark Icon */}
             <div className="absolute top-4 right-4 opacity-[0.05] pointer-events-none overflow-hidden">
                <span className="material-symbols-outlined text-[64px]">menu_book</span>
             </div>

            <div className="flex flex-col gap-6 relative z-10">
                {/* Judgment (卦辞) */}
                <div>
                     <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                        <h3 className="text-sm font-bold text-slate-300 tracking-wider">卦辞</h3>
                     </div>
                     <p className="text-white text-[17px] leading-8 tracking-wide font-serif text-justify">
                        {hexagram.description}，{hexagram.subTitle}。
                     </p>
                </div>

                {/* Divider Line */}
                <div className="h-px w-full bg-white/10"></div>

                {/* Image (象曰) */}
                {hexagram.xiang && (
                <div>
                     <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary text-sm">visibility</span>
                        <h3 className="text-sm font-bold text-slate-300 tracking-wider">象曰</h3>
                     </div>
                     <p className="text-slate-200 text-[16px] leading-7 tracking-wide font-serif text-justify opacity-90">
                        {hexagram.xiang}
                     </p>
                </div>
                )}

                {/* Divider Line */}
                <div className="h-px w-full bg-white/10"></div>

                {/* Poem (诗曰) */}
                {hexagram.poem && (
                <div>
                     <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary text-sm">edit_note</span>
                        <h3 className="text-sm font-bold text-slate-300 tracking-wider">诗曰</h3>
                     </div>
                     <p className="text-slate-200 text-[16px] leading-7 tracking-wide font-serif text-justify opacity-90">
                        {hexagram.poem}
                     </p>
                </div>
                )}
            </div>
        </section>

        {/* Guidance Section */}
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-xl font-bold text-white tracking-wide">指引</h3>
                <span className="text-[10px] font-medium text-primary bg-[#1a2c30] px-2 py-1 rounded border border-primary/20 cursor-default">现代解读</span>
            </div>
            
            <div className="flex flex-col gap-3">
                <GuidanceCard 
                    title="财运" 
                    text={hexagram.guidance.wealth} 
                    icon="account_balance_wallet" 
                    bgIcon="paid" 
                />
                <GuidanceCard 
                    title="健康" 
                    text={hexagram.guidance.health} 
                    icon="spa" 
                    bgIcon="monitor_heart" 
                />
                <GuidanceCard 
                    title="出行" 
                    text={hexagram.guidance.travel} 
                    icon="flight" 
                    bgIcon="explore" 
                />
                <GuidanceCard 
                    title="姻缘" 
                    text={hexagram.guidance.love} 
                    icon="diversity_3" 
                    bgIcon="favorite" 
                />
            </div>
        </section>

        {/* Footer Poem/Quote */}
        <section className="flex flex-col items-center justify-center gap-3 py-4 opacity-80">
            <span className="text-primary text-6xl font-serif leading-none">"</span>
            <p className="font-serif italic text-slate-300 text-sm tracking-widest text-center">
                "{hexagram.poem}"
            </p>
        </section>

      </main>

      {/* Floating Action Button (Pill Shape) */}
      <div className="fixed bottom-8 right-6 z-50">
        <button
            onClick={handleSave}
            className="flex h-12 items-center gap-2 rounded-full bg-primary text-[#0d1619] shadow-[0_4px_20px_rgba(17,180,212,0.4)] px-6 hover:bg-primary-dark transition-all active:scale-95"
        >
            <span className="font-bold text-sm tracking-wide">保存卦象</span>
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
        </button>
      </div>
    </div>
  );
};
