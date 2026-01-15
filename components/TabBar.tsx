import React from 'react';
import { Screen } from '../types';

interface TabBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentScreen, onNavigate }) => {
  const isTabActive = (tab: Screen) => {
    // Group related screens under tabs
    if (tab === Screen.HOME) return [Screen.HOME, Screen.RITUAL, Screen.DETAIL].includes(currentScreen);
    if (tab === Screen.HISTORY) return [Screen.HISTORY, Screen.COLLECTION].includes(currentScreen);
    if (tab === Screen.PROFILE) return [Screen.PROFILE, Screen.SETTINGS, Screen.FEEDBACK].includes(currentScreen);
    return currentScreen === tab;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#152225]/95 backdrop-blur-xl border-t border-white/5 px-6 pb-8 pt-4 flex justify-around items-end z-40">
      <button 
        onClick={() => onNavigate(Screen.CULTURE)}
        className={`flex flex-col items-center gap-1.5 group w-16 transition-colors ${isTabActive(Screen.CULTURE) ? 'text-primary' : 'text-slate-400'}`}
      >
        <span className="material-symbols-outlined">temple_hindu</span>
        <span className="text-[11px] font-medium">文化</span>
      </button>

      <button 
        onClick={() => onNavigate(Screen.HOME)}
        className="flex flex-col items-center gap-1.5 group w-16 -mt-6"
      >
        <div className={`h-14 w-14 rounded-full border border-white/10 flex items-center justify-center shadow-lg transition-transform active:scale-95 ${isTabActive(Screen.HOME) ? 'bg-primary text-white shadow-[0_0_15px_rgba(17,180,212,0.4)]' : 'bg-surface-dark text-slate-200'}`}>
          <span className="material-symbols-outlined text-[28px]">balance</span>
        </div>
        <span className={`text-[11px] font-medium ${isTabActive(Screen.HOME) ? 'text-primary' : 'text-slate-400'}`}>卜卦</span>
      </button>

      <button 
        onClick={() => onNavigate(Screen.PROFILE)}
        className={`flex flex-col items-center gap-1.5 group w-16 transition-colors ${isTabActive(Screen.PROFILE) ? 'text-primary' : 'text-slate-400'}`}
      >
        <span className={`material-symbols-outlined ${isTabActive(Screen.PROFILE) ? 'fill-1' : ''}`}>person</span>
        <span className="text-[11px] font-medium">我的</span>
      </button>
    </div>
  );
};
