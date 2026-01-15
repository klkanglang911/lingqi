import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { MOCK_HISTORY } from '../constants';

interface HistoryProps {
  onNavigate: (screen: Screen) => void;
  setDetailId: (id: string) => void;
}

export const History: React.FC<HistoryProps> = ({ onNavigate, setDetailId }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  useEffect(() => {
    // 从localStorage读取历史记录
    const savedHistory = localStorage.getItem('lingqi_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      // 如果没有保存的历史记录，使用默认的MOCK_HISTORY
      setHistory(MOCK_HISTORY);
    }
  }, []);

  // 搜索过滤逻辑
  const filteredHistory = history.filter(item => {
    if (!searchKeyword.trim()) return true;

    const keyword = searchKeyword.toLowerCase();
    return (
      item.name?.toLowerCase().includes(keyword) ||
      item.description?.toLowerCase().includes(keyword) ||
      item.queryType?.toLowerCase().includes(keyword) ||
      item.subTitle?.toLowerCase().includes(keyword) ||
      item.nature?.toLowerCase().includes(keyword)
    );
  });

  // 获取当前年份
  const currentYear = new Date().getFullYear();

  // 点击历史记录卡片，跳转到详情页
  const handleItemClick = (item: any) => {
    // 使用hexagramId（新保存的记录）或id（MOCK_HISTORY的记录）
    const hexagramId = item.hexagramId || item.id;
    setDetailId(hexagramId);
    onNavigate(Screen.DETAIL);
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-background-dark">
      <div className="sticky top-0 z-10 bg-background-dark/95 backdrop-blur-md px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate(Screen.HOME)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight text-center flex-1 pr-10 text-white">占卜历史</h2>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex w-full items-center rounded-xl bg-[#1a2629] border border-gray-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm h-12 transition-all">
          <div className="flex items-center justify-center pl-4 pr-2">
            <span className="material-symbols-outlined text-[#9db4b9]">search</span>
          </div>
          <input
            className="flex w-full bg-transparent border-none text-base font-normal text-white placeholder:text-[#9db4b9] focus:ring-0 focus:outline-none h-full"
            placeholder="搜索关键词（如：'财运'）"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col pb-24 overflow-y-auto no-scrollbar">
        <div className="pt-6 pb-2 px-4 flex items-center gap-2">
            <h3 className="text-gray-100 tracking-tight text-xl font-bold leading-tight">{currentYear}年</h3>
            <div className="h-px bg-gray-700 flex-1 ml-2"></div>
        </div>

        {filteredHistory.map((item) => (
            <div key={item.id} className="px-4 py-2">
                <div
                    className="flex flex-col bg-[#1a2629] rounded-xl p-4 shadow-sm border border-gray-800 hover:border-primary/50 transition-colors cursor-pointer group"
                    onClick={() => handleItemClick(item)}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{item.queryType}</span>
                                <span className="text-xs text-gray-400">{item.date}</span>
                            </div>
                            <h4 className="text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors">{item.number}: {item.name}</h4>
                            <p className="text-[#9db4b9] text-sm font-normal leading-relaxed line-clamp-2">
                                {item.description}
                            </p>
                        </div>
                        <div className="relative shrink-0 size-16 rounded-lg overflow-hidden bg-[#131c1e] border border-gray-700 flex items-center justify-center">
                            <span className="material-symbols-outlined relative z-10 text-white drop-shadow-md" style={{fontSize: '32px'}}>toll</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
