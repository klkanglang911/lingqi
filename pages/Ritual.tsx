import React, { useState, useEffect } from 'react';
import { Screen, Coin } from '../types';

interface RitualProps {
  onNavigate: (screen: Screen) => void;
}

export const Ritual: React.FC<RitualProps> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'IDLE' | 'TOSSING' | 'LANDED'>('IDLE');
  const [coins, setCoins] = useState<Coin[]>([]);

  // Initialize random coin positions (clustered in center for start)
  useEffect(() => {
    const initialCoins: Coin[] = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      type: i < 4 ? 'UPPER' : i < 8 ? 'MIDDLE' : 'LOWER',
      label: i < 4 ? '上' : i < 8 ? '中' : '下',
      rotation: Math.random() * 360,
      x: 42 + Math.random() * 16, 
      y: 42 + Math.random() * 16,
    }));
    setCoins(initialCoins);
  }, []);

  const handleToss = () => {
    if (status !== 'IDLE') return;
    setStatus('TOSSING');

    // Phase 1: Toss (Jump up and jumble)
    // Randomize slightly during the toss to simulate motion blur/chaos
    setCoins(prev => prev.map(c => ({
        ...c,
        rotation: c.rotation + 180 + Math.random() * 180,
        x: 40 + Math.random() * 20,
        y: 40 + Math.random() * 20,
    })));

    // Phase 2: Land and Scatter
    setTimeout(() => {
      setStatus('LANDED');
      setCoins(prev => prev.map(c => ({
        ...c,
        rotation: Math.random() * 360,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
      })));
      
      // Navigate
      setTimeout(() => {
        onNavigate(Screen.RESULT);
      }, 1500);
    }, 400); // Flight time
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center bg-background-dark overflow-hidden">
      {/* Header */}
      <div className="flex items-center w-full p-4 z-10">
        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="text-white/80 hover:text-primary flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
        </button>
        <h2 className="text-white text-lg font-medium leading-tight tracking-wide flex-1 text-center opacity-90">灵棋起卦</h2>
        <button 
          onClick={() => onNavigate(Screen.CULTURE)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full text-white/80 hover:text-primary hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">help</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full px-6 py-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Tray */}
        <div 
          onClick={handleToss}
          className={`relative w-[320px] h-[320px] rounded-full shadow-[0_20px_40px_-5px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.8)] border-[12px] border-[#4e342e] flex items-center justify-center group cursor-pointer transition-transform duration-300
            ${status === 'TOSSING' ? 'scale-95 translate-y-2' : 'hover:scale-[1.01]'}
            ${status === 'LANDED' ? 'scale-100' : ''}
          `}
          style={{ background: 'radial-gradient(circle at 30% 30%, #5d4037, #3e2723)' }}
        >
          <div className="absolute inset-2 rounded-full border border-white/5 opacity-50 pointer-events-none"></div>
          <div className="wood-grain absolute inset-0 rounded-full opacity-30 pointer-events-none"></div>
          
          {/* Coins */}
          <div className="relative w-full h-full">
            {coins.map((coin) => (
              <div
                key={coin.id}
                className={`absolute w-12 h-12 rounded-full bg-[#e3c099] border-2 border-[#8d6e63] flex items-center justify-center
                   transition-all ease-out
                   ${status === 'TOSSING' ? 'duration-300 scale-125 shadow-[0_15px_20px_rgba(0,0,0,0.5)] z-20' : 'duration-700 scale-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4)] z-10'}
                `}
                style={{
                  top: `${coin.y}%`,
                  left: `${coin.x}%`,
                  transform: `translate(-50%, -50%) rotate(${coin.rotation}deg)`
                }}
              >
                <span className="text-[#3e2723] font-serif font-bold text-lg opacity-80">{coin.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Prompt */}
        <div className="mt-12 text-center flex flex-col items-center gap-4">
          <div className={`flex items-center gap-2 text-primary ${status === 'IDLE' ? 'animate-pulse' : ''}`}>
            <span className="material-symbols-outlined text-xl">
                {status === 'IDLE' ? 'touch_app' : status === 'TOSSING' ? 'flight' : 'check_circle'}
            </span>
            <h3 className="tracking-[0.15em] text-xl font-light leading-tight uppercase font-display">
              {status === 'IDLE' ? '点击起卦' : status === 'TOSSING' ? '掷棋中...' : '卦象已成'}
            </h3>
          </div>
          <p className="text-white/40 text-sm font-light tracking-wide max-w-[240px] font-display">
            {status === 'LANDED' ? '正在解析天机...' : '心中默念所求之事，诚心掷棋。'}
          </p>
        </div>
      </div>
    </div>
  );
};