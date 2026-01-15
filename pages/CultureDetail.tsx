import React from 'react';
import { Screen } from '../types';
import { MOCK_ARTICLES } from '../constants';

interface CultureDetailProps {
  onNavigate: (screen: Screen) => void;
  id: string;
}

export const CultureDetail: React.FC<CultureDetailProps> = ({ onNavigate, id }) => {
  const article = MOCK_ARTICLES[id] || MOCK_ARTICLES['origin'];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `灵棋经 - ${article.title}`,
          text: article.subtitle,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      alert(`已复制：\n${article.title}\n${article.subtitle}`);
    }
  };

  return (
    <div className="relative h-full w-full bg-background-dark text-white font-sans overflow-hidden flex flex-col">
       {/* Hero Background */}
       <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 w-full h-[300px] bg-cover bg-center opacity-30 mask-gradient" style={{ backgroundImage: `url(${article.image})` }}></div>
          <div className="absolute top-0 w-full h-[301px] bg-gradient-to-b from-transparent via-background-dark/80 to-background-dark"></div>
       </div>
       
       <header className="sticky top-0 z-50 flex items-center justify-between p-4 backdrop-blur-sm bg-transparent">
        <button onClick={() => onNavigate(Screen.CULTURE)} className="flex size-10 items-center justify-center rounded-full bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-md border border-white/5">
          <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
        </button>
        <div className="w-10"></div> 
        <div className="w-10 flex justify-end">
            <button onClick={handleShare} className="flex size-10 items-center justify-center rounded-full bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-md border border-white/5">
                <span className="material-symbols-outlined">share</span>
            </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-6 pb-12 overflow-y-auto no-scrollbar z-10 pt-2">
        <div className="flex flex-col gap-4 mb-6">
            <span className="text-primary text-xs font-bold tracking-widest uppercase bg-primary/10 self-start px-2 py-1 rounded border border-primary/20">
                {article.category}
            </span>
            <h1 className="text-3xl font-bold font-serif leading-tight tracking-wide text-white drop-shadow-sm">
                {article.title}
            </h1>
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
            <p className="text-slate-400 text-sm italic font-medium border-l-2 border-slate-700 pl-3">
                {article.subtitle}
            </p>
        </div>

        <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-7 prose-p:text-justify prose-strong:text-white prose-strong:font-bold font-serif">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
        
        <div className="mt-12 flex items-center justify-center opacity-50">
            <span className="text-xs tracking-[0.3em] text-slate-500">灵庐书院 · 珍藏</span>
        </div>
      </main>
    </div>
  );
};