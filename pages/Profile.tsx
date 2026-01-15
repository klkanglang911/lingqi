import React from 'react';
import { Screen } from '../types';

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  return (
    <div className="relative flex h-full w-full flex-col bg-background-dark">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/90 backdrop-blur-md px-4 pt-14 pb-4 border-b border-white/5">
        <div className="w-8"></div> 
        <h2 className="text-lg font-medium tracking-wide text-center flex-1 text-white">个人中心</h2>
        <div className="w-8 flex justify-end">
          <button className="text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
        </div>
      </div>

      <main className="flex-1 flex flex-col gap-8 px-5 pb-32 overflow-y-auto no-scrollbar pt-4">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-5">
            <div className="relative group cursor-pointer">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl opacity-50 scale-110 group-hover:opacity-70 transition-opacity duration-700"></div>
                <div className="relative h-28 w-28 rounded-full p-[3px] bg-gradient-to-b from-primary/40 to-transparent">
                    <div className="h-full w-full rounded-full bg-surface-dark overflow-hidden border-2 border-background-dark">
                        <div className="h-full w-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2pa7mJinOFDE-GTLQF7KbuvfHwDivPG5kb2_PlYOJ4RD-6FplTTcF9HKT-olzI3Ouk5PiiPxFgiyZYVoIlK8q23NWshck_6CYLQIWDKvx1kKZ-OmJCHbsT2mJp-d7P5kYCsj2uG1MkhhglSlon7AvYVzvEKt9wbsjh0b3oByArA4oiLSeiPpSNsM0kLm5TY9ezK2kokxsng_E1Sk-KYoGSsP4Yu7GOPpWW4nV1cukJDATgnKbU8JEgHNSAHFDdtRsut3EgRWUiRmV')"}}></div>
                    </div>
                </div>
            </div>
            <div className="text-center space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-white">问道者</h1>
                <p className="text-sm text-primary font-medium tracking-wide bg-primary/10 px-3 py-0.5 rounded-full inline-block">ID: 8839201</p>
            </div>
        </div>

        {/* Daily Quote Card */}
        <div className="relative w-full rounded-2xl shadow-lg group overflow-hidden min-h-[180px]">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay rounded-2xl" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2l7j5-x260smN67nhI8SaaTEhZxrjxC43PTPWqXtto2dQOeY4JnKYVzDaJ0XtUn8aI_q1gL6Ty8ycbyZswsOKqB0-qUgzlhkdAs3cUN94BH49BINnzA9inGCjrLL-g9Kz5S_W8I_sS2kDGpM32xNdRKMu8DBIhhiYaULHMtbemi2mMAVFo3DgBRwG_wI_ts9fs8BlAb9_-bV16WSPuC6Wslr2_CpFCtjtblMlrjZ9WcIzOdhkpyo1ZsVVxtVaDhNGgH_aLiA6S_je')"}}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#18282b] via-[#152225] to-[#11191b] rounded-2xl"></div>
            <div className="relative p-6 flex flex-col items-start gap-4 z-10">
                <div className="flex w-full items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-primary/80">
                        <span className="material-symbols-outlined text-[16px]">wb_twilight</span>
                        每日一签
                    </span>
                    <span className="h-1 w-12 rounded-full bg-primary/20"></span>
                </div>
                <div className="space-y-3 pt-2 pr-20">
                    <p className="text-xl font-medium leading-loose text-slate-100 font-serif opacity-95 tracking-wide">
                        "合抱之木，生于毫末；<br/>九层之台，起于累土；<br/>千里之行，始于足下。"
                    </p>
                    <p className="text-sm text-slate-400 font-normal text-right w-full">— 《道德经》</p>
                </div>
            </div>
            <div className="absolute -bottom-6 -right-6 text-primary/5 rotate-12 pointer-events-none z-0">
                <span className="material-symbols-outlined text-[120px]">spa</span>
            </div>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-3">
             <MenuButton icon="spa" title="我的收藏" subtitle="灵签珍藏" onClick={() => onNavigate(Screen.COLLECTION)} />
             <MenuButton icon="temple_buddhist" title="文化科普" subtitle="灵棋经之道" onClick={() => onNavigate(Screen.CULTURE)} />
             <MenuButton icon="settings" title="系统设置" subtitle="偏好与配置" onClick={() => onNavigate(Screen.SETTINGS)} />
             <MenuButton icon="edit_square" title="意见反馈" subtitle="分享您的想法" onClick={() => onNavigate(Screen.FEEDBACK)} />
        </div>
      </main>
    </div>
  );
};

const MenuButton = ({ icon, title, subtitle, onClick }: { icon: string, title: string, subtitle: string, onClick: () => void }) => (
    <button onClick={onClick} className="group flex items-center justify-between p-4 pl-3 rounded-xl bg-surface-dark border border-white/5 shadow-sm active:scale-[0.98] transition-all duration-200 hover:shadow-[0_0_15px_rgba(17,180,212,0.15)] hover:border-primary/30">
        <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-background-dark text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className="flex flex-col items-start gap-0.5">
                <span className="text-[15px] font-semibold text-slate-100 group-hover:text-primary transition-colors">{title}</span>
                <span className="text-xs text-slate-400">{subtitle}</span>
            </div>
        </div>
        <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">chevron_right</span>
    </button>
);
