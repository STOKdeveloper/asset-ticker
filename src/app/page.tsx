'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TickersSection from '@/components/TickersSection';
import AssetChart from '@/components/AssetChart';
import AssetBoard from '@/components/AssetBoard';
import symbolsData from '@/data/symbols.json';

export default function Home() {
  // Extract symbol arrays from JSON data
  const stocks = symbolsData.symbolGroups.find(g => g.label === 'Stocks')?.symbols || [];
  const commodities = symbolsData.symbolGroups.find(g => g.label === 'Commodities')?.symbols || [];
  const allSymbols = symbolsData.symbolGroups.flatMap(g => g.symbols);

  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showBoard, setShowBoard] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;

    // allSymbols is now defined at component level
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
    setShowBoard(false); // Switch to chart view when asset is clicked
  };

  const toggleView = () => {
    setShowBoard(!showBoard);
  };

  // allSymbols is now defined at component level

  return (
    <main className="h-dvh bg-[#050505] flex flex-col relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Tickers */}
      <div className="z-10 flex flex-col gap-1 pt-4 shrink-0">
        <Header onClick={toggleView} />

        {!showBoard && (
          <TickersSection
            stocks={stocks}
            commodities={commodities}
            onSymbolClick={handleSymbolClick}
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 container mx-auto px-4 pb-4 z-10 flex flex-col items-center min-h-0">
        <div className="w-full max-w-5xl h-full">
          {showBoard ? (
            <AssetBoard
              symbolGroups={[
                ...symbolsData.symbolGroups
              ]}
              onAssetClick={handleSymbolClick}
            />
          ) : (
            <AssetChart
              symbol={selectedSymbol}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused(!isPaused)}
              onPause={() => setIsPaused(true)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
