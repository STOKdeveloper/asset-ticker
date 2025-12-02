'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import TickersSection from '@/components/TickersSection';
import AssetChart from '@/components/AssetChart';
import AssetBoard from '@/components/AssetBoard';
import symbolsData from '@/data/symbols.json';
import tickersData from '@/data/tickers.json';

export default function Home() {
  // Helper function to resolve ticker symbols from group names
  const getTickerSymbols = (groupNames: string[]): string[] => {
    return groupNames.flatMap(name => {
      const group = symbolsData.symbolGroups.find(g => g.label === name);
      return group?.symbols || [];
    });
  };

  // Resolve ticker symbols from tickers.json configuration
  const ticker1Symbols = useMemo(() => getTickerSymbols(tickersData.tickerGroups[0].symbols), []);
  const ticker2Symbols = useMemo(() => getTickerSymbols(tickersData.tickerGroups[1].symbols), []);
  const allSymbols = useMemo(() => symbolsData.symbolGroups.flatMap(g => g.symbols), []);

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
    }, 12000); // 12 seconds bewteen chart updates

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
            ticker1Symbols={ticker1Symbols}
            ticker2Symbols={ticker2Symbols}
            onSymbolClick={handleSymbolClick}
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 container mx-auto px-4 pb-4 z-10 flex flex-col items-center min-h-0">
        <div className="w-full max-w-5xl h-full">
          {showBoard ? (
            <AssetBoard
              symbolGroups={symbolsData.symbolGroups}
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
