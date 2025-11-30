'use client';

import { useState, useEffect } from 'react';
import Ticker from '@/components/Ticker';
import AssetChart from '@/components/AssetChart';

// Sample data - in a real app these might come from a config or user input
const STOCKS = ['AGNC', 'ORC', 'SEIT', 'MNG.L', 'PHNX.L', 'RIO.L', 'TW.L', 'SUPR.L', 'AGNC.L', 'ABDN.L', 'EMG.L', 'ENOG.L', 'LGEN.L', 'ORIT.L', 'DUKE.L'];
const COMMODITIES = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'AVGO', 'META', 'GC=F', 'SI=F', 'ETH-GBP', 'BTC-GBP'];

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;

    const allSymbols = [...STOCKS, ...COMMODITIES];
    const interval = setInterval(() => {
      setSelectedSymbol((prev) => {
        const currentIndex = allSymbols.indexOf(prev);
        const nextIndex = (currentIndex + 1) % allSymbols.length;
        return allSymbols[nextIndex];
      });
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol);
    setIsPaused(true);
  };

  return (
    <main className="h-screen bg-[#050505] flex flex-col relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Tickers */}
      <div className="z-10 flex flex-col gap-1 pt-4 shrink-0">
        <h1 className="text-center text-2xl font-bold tracking-widest text-white/20 mb-4 uppercase">Asset Ticker</h1>

        <Ticker
          symbols={STOCKS}
          onSymbolClick={handleSymbolClick}
          speed={40}
          height={15}
        />

        <Ticker
          symbols={COMMODITIES}
          onSymbolClick={handleSymbolClick}
          speed={40}
          height={10}
        />
      </div>

      {/* Spacer for 10px gap */}
      <div className="h-[10px] shrink-0" />

      {/* Main Content Area */}
      <div className="flex-1 container mx-auto px-4 pb-4 z-10 flex flex-col items-center min-h-0">
        <div className="w-full max-w-5xl h-full">
          <AssetChart
            symbol={selectedSymbol}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(!isPaused)}
            onPause={() => setIsPaused(true)}
          />
        </div>
      </div>
    </main>
  );
}
