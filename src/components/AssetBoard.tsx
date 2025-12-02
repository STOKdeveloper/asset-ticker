'use client';

import { useEffect, useState, useRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { quotefix } from '../utils/prices';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Quote {
    symbol: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
    shortName?: string;
    currency?: string;
    exchange?: string;
    quoteType?: string;
}

interface SymbolGroup {
    label: string;
    symbols: string[];
}

interface AssetBoardProps {
    symbolGroups: SymbolGroup[];
    onAssetClick?: (symbol: string) => void;
}

export default function AssetBoard({ symbolGroups, onAssetClick }: AssetBoardProps) {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [changedSymbols, setChangedSymbols] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const previousPricesRef = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        const fetchQuotes = async () => {
            const allSymbols = symbolGroups.flatMap(group => group.symbols);
            try {
                const res = await fetch(`/api/quote?symbols=${allSymbols.join(',')}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Track which symbols changed
                    const newChangedSymbols = new Set<string>();

                    data.forEach((quote: Quote) => {
                        const prevPrice = previousPricesRef.current.get(quote.symbol);
                        if (prevPrice !== undefined && prevPrice !== quote.regularMarketPrice) {
                            newChangedSymbols.add(quote.symbol);
                        }
                        previousPricesRef.current.set(quote.symbol, quote.regularMarketPrice);
                    });

                    setChangedSymbols(newChangedSymbols);
                    setQuotes(data);
                }
            } catch (error) {
                console.error('Failed to fetch quotes', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
        const interval = setInterval(fetchQuotes, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [symbolGroups]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-auto p-8">
            {symbolGroups.map((group, groupIndex) => {
                const groupQuotes = quotes.filter(q => group.symbols.includes(q.symbol));

                return (
                    <div key={group.label} className={groupIndex > 0 ? "mt-8" : ""}>
                        <h2 className="text-2xl font-bold text-white/60 mb-2 uppercase tracking-wider">
                            {group.label}
                        </h2>
                        <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-4">
                            {groupQuotes.map((quote) => {
                                const hasChanged = changedSymbols.has(quote.symbol);
                                return (
                                    <div
                                        key={quote.symbol}
                                        onClick={() => onAssetClick?.(quote.symbol)}
                                        style={{
                                            backgroundColor: hasChanged ? 'rgba(55, 65, 81, 0.5)' : 'rgba(55, 65, 81, 0.2)'
                                        }}
                                        className={cn(
                                            "rounded-xl p-4",
                                            "transition-transform hover:bg-white/10 hover:scale-105 cursor-pointer",
                                            "flex flex-col gap-3"
                                        )}
                                    >
                                        <div className="text-white/90 font-bold text-lg truncate">
                                            {quote.symbol}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="text-white font-mono text-xl">
                                                {quotefix(quote as any)}
                                            </div>
                                            <div
                                                className={cn(
                                                    "font-mono text-sm font-bold",
                                                    quote.regularMarketChangePercent >= 0 ? "text-neon-green" : "text-neon-red"
                                                )}
                                            >
                                                {quote.regularMarketChangePercent >= 0 ? '▲' : '▼'}{' '}
                                                {Math.abs(quote.regularMarketChangePercent)?.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
