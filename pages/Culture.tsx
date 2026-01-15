import React from 'react';
import { Screen } from '../types';

interface CultureProps {
  onNavigate: (screen: Screen) => void;
  setArticleId: (id: string) => void;
}

export const Culture: React.FC<CultureProps> = ({ onNavigate, setArticleId }) => {
  const handleItemClick = (id: string) => {
    setArticleId(id);
    onNavigate(Screen.CULTURE_DETAIL);
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-background-dark">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/90 backdrop-blur-md px-4 pt-14 pb-4 border-b border-white/5">
         <div className="w-8">
            <button onClick={() => onNavigate(Screen.HOME)} className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors -ml-2">
                <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
            </button>
         </div>
         <h2 className="text-lg font-medium tracking-wide text-center flex-1 text-white">文化科普</h2>
         <div className="w-8 flex justify-end">
            <span className="material-symbols-outlined text-slate-400">search</span>
         </div>
      </div>

      <main className="flex-1 flex flex-col gap-6 px-5 pb-32 overflow-y-auto no-scrollbar pt-4">
         {/* Hero Card */}
         <div className="relative w-full rounded-2xl overflow-hidden shadow-lg group shrink-0 h-48">
            <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2l7j5-x260smN67nhI8SaaTEhZxrjxC43PTPWqXtto2dQOeY4JnKYVzDaJ0XtUn8aI_q1gL6Ty8ycbyZswsOKqB0-qUgzlhkdAs3cUN94BH49BINnzA9inGCjrLL-g9Kz5S_W8I_sS2kDGpM32xNdRKMu8DBIhhiYaULHMtbemi2mMAVFo3DgBRwG_wI_ts9fs8BlAb9_-bV16WSPuC6Wslr2_CpFCtjtblMlrjZ9WcIzOdhkpyo1ZsVVxtVaDhNGgH_aLiA6S_je')"}}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#18282b] via-[#152225]/80 to-transparent"></div>
            <div className="relative p-6 flex flex-col h-full justify-center items-start gap-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-primary/90 bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
                    <span className="material-symbols-outlined text-[14px]">school</span>
                    灵棋之道
                </div>
                <h1 className="text-2xl font-bold leading-tight text-slate-100 font-serif tracking-wide">
                    探寻古老智慧<br/>感悟天地哲理
                </h1>
                <p className="text-sm text-slate-300 font-normal max-w-[80%] leading-relaxed">
                    从历史源流到卦象解读，带您深入了解灵棋经的奥秘。
                </p>
            </div>
         </div>

         <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2 px-1 pb-1">
                 <div className="h-4 w-1 bg-primary rounded-full"></div>
                 <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">精选专题</h3>
             </div>
             
             <CultureItem 
                onClick={() => handleItemClick('origin')}
                icon="history_edu" 
                title="灵棋经起源" 
                desc="灵棋经源于汉魏，盛于隋唐。探寻智慧源头。" 
                color="amber" 
             />
             <CultureItem 
                onClick={() => handleItemClick('coins')}
                icon="trip_origin" 
                title="十二棋子之义" 
                desc="上中下三才，四象十二位。解析棋子背后的宇宙观。" 
                color="primary" 
             />
             <CultureItem 
                onClick={() => handleItemClick('how_to')}
                icon="psychology" 
                title="如何解卦" 
                desc="心诚则灵，意动卦成。详解占卜步骤与心态。" 
                color="emerald" 
             />
             <CultureItem 
                onClick={() => handleItemClick('chart')}
                icon="grid_view" 
                title="一百二十五卦图谱" 
                desc="完整收录一百二十五卦象，图文并茂。" 
                color="indigo" 
             />
         </div>
      </main>
    </div>
  );
};

const CultureItem = ({ icon, title, desc, color, onClick }: { icon: string, title: string, desc: string, color: string, onClick: () => void }) => {
    const getColorClass = (c: string) => {
        if (c === 'amber') return 'text-amber-400 bg-amber-500/10 group-hover:bg-amber-500/20';
        if (c === 'emerald') return 'text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20';
        if (c === 'indigo') return 'text-indigo-400 bg-indigo-500/10 group-hover:bg-indigo-500/20';
        return 'text-primary bg-primary/10 group-hover:bg-primary/20';
    };

    return (
        <button onClick={onClick} className="group flex flex-col gap-3 p-5 rounded-2xl bg-surface-dark border border-white/5 shadow-sm active:scale-[0.99] transition-all duration-200 hover:shadow-glow hover:border-primary/30 text-left">
            <div className="flex items-start justify-between w-full">
                <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${getColorClass(color)}`}>
                        <span className="material-symbols-outlined text-[28px]">{icon}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                        <span className="text-[17px] font-bold text-slate-100 font-serif tracking-wide group-hover:text-primary transition-colors">{title}</span>
                        <p className="text-[13px] leading-relaxed text-slate-400 line-clamp-2">
                            {desc}
                        </p>
                    </div>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors mt-1">chevron_right</span>
            </div>
        </button>
    );
};