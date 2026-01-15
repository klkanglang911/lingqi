import React from 'react';
import { Screen } from '../types';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      {/* Background with Ink Wash effect */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay grayscale contrast-125 transition-transform duration-[20s] hover:scale-105" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKjPSX7ePyksgZtB2V0kHSXi75f0yL8paR7UuNpetn7Dw_lN2SA1JqW5hvOvkfQf6jWDKZ__M0wXhMR65Csv8wMKLMm39vdvz7dN2ZzvDv8LHvkTdgQ8yqkdCiPcosNFSmPUdAPvFYJ3hd2d7yrPh_r7oi-MmbirEOJXITyBlASNRE68bdPa0rAwZWIP9L1u-5orhVdc5POVcDi3O2-S3clmZ5Sh6cnw04qFccGsaAsSFu5GW7PSy_ChbWdFvkGb_xNWAeaauA7mNk')" }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background-dark/60 to-background-dark"></div>

      <div className="relative z-20 flex flex-1 flex-col items-center justify-between px-6 pt-20 pb-12 h-full">
        {/* Top Decor */}
        <div className="flex-1 w-full flex flex-col items-center justify-start opacity-60">
          <span className="material-symbols-outlined text-white/40 text-3xl mb-4 font-light animate-pulse">balance</span>
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/40 to-transparent"></div>
        </div>

        {/* Title Area */}
        <div className="flex-grow-[2] flex flex-col items-center justify-center gap-8 transform translate-y-[-10%]">
          <div className="relative group cursor-default">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-64 bg-primary/10 blur-[60px] rounded-full"></div>
            <h1 className="writing-vertical text-7xl md:text-8xl font-calligraphy font-normal tracking-[0.1em] text-white/95 drop-shadow-2xl select-none group-hover:scale-105 transition-transform duration-700">
              灵棋经
            </h1>
          </div>
          <div className="flex flex-col items-center gap-2 mt-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-white/20"></div>
              <p className="text-[#9db4b9] text-sm tracking-[0.3em] font-light">东方古老智慧</p>
              <div className="h-[1px] w-8 bg-white/20"></div>
            </div>
            <p className="text-white/30 text-xs tracking-[0.2em] font-light">灵庐书院</p>
          </div>
        </div>

        {/* Seal Button */}
        <div className="flex flex-col items-center justify-end gap-12 w-full max-w-md pb-8">
          <button 
            onClick={() => onNavigate(Screen.RITUAL)}
            className="group relative flex items-center justify-center w-28 h-28 bg-seal-red hover:bg-[#a51919] transition-all duration-500 ease-out rounded-xl shadow-[0_0_30px_rgba(185,28,28,0.3)] border-2 border-red-900/50 active:scale-95 active:shadow-none"
          >
            {/* Seal Internal Borders */}
            <div className="absolute inset-1 border border-white/20 rounded-lg"></div>
            <div className="absolute inset-2 border-[0.5px] border-white/10 rounded-md"></div>
            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/40 rounded-tl-sm"></div>
            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/40 rounded-tr-sm"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/40 rounded-bl-sm"></div>
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/40 rounded-br-sm"></div>

            <div className="flex flex-col items-center justify-center text-white font-serif leading-tight z-10">
              <span className="text-2xl font-black tracking-widest mb-0.5 group-hover:text-white/90 transition-colors">开始</span>
              <span className="text-2xl font-black tracking-widest group-hover:text-white/90 transition-colors">起卦</span>
            </div>
          </button>
          <p className="text-white/30 text-[11px] tracking-[0.2em] font-light animate-pulse">点击印章开启</p>
        </div>

        {/* Quick Links */}
        <div className="w-full max-w-[320px] rounded-full bg-black/40 backdrop-blur-md border border-white/5 px-6 py-4">
          <nav className="flex justify-between items-center px-4">
            <button onClick={() => onNavigate(Screen.HISTORY)} className="group flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[24px] font-light group-hover:text-primary transition-colors">history_edu</span>
              <span className="text-[11px] tracking-widest font-medium">历史</span>
            </button>
            <button className="group flex flex-col items-center gap-1.5 opacity-100 text-white cursor-default">
              <div className="relative">
                <span className="material-symbols-outlined text-[24px] text-primary drop-shadow-[0_0_8px_rgba(17,180,212,0.5)]">auto_stories</span>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              </div>
              <span className="text-[11px] tracking-widest font-medium text-white">指引</span>
            </button>
            <button onClick={() => onNavigate(Screen.SETTINGS)} className="group flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[24px] font-light group-hover:text-primary transition-colors">tune</span>
              <span className="text-[11px] tracking-widest font-medium">设置</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};