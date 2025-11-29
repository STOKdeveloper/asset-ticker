'use client';

import { useEffect, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Quote {
    symbol: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
    shortName?: string;
}

interface TickerProps {
    symbols: string[];
    onSymbolClick: (symbol: string) => void;
    speed?: number; // duration in seconds
    direction?: 'left' | 'right';
    height?: number; // height in vh
}

export default function Ticker({ symbols, onSymbolClick, speed = 20, direction = 'left', height = 24 }: TickerProps) {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const res = await fetch(`/api/quote?symbols=${symbols.join(',')}`);
                const data = await res.json();
                if (Array.isArray(data)) {
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
    }, [symbols]);

    if (loading) return <div className="h-64 bg-gray-900/50 animate-pulse w-full my-2" />;

    // Duplicate content for seamless loop
    const content = [...quotes, ...quotes, ...quotes];

    // Dynamic sizing
    const symbolSize = `${height * 0.4}vh`;
    const priceSize = `${height * 0.25}vh`;
    const percentSize = `${height * 0.15}vh`;
    const itemGap = `${height * 0.0}vh`; // Gap between ticker items
    const contentGap = `${height * 0.1}vh`; // Gap inside the button
    const symbolGap = `${height * 0.04}vh`; // Gap between arrow and symbol
    const priceGap = `${height * 0.07}vh`; // Gap between price and percentage
    const cardPadding = `${height * 0.2}vh`; // Horizontal padding

    return (
        <div
            className="relative flex items-center overflow-hidden w-full bg-black/20 backdrop-blur-sm border-y border-white/5 select-none group"
            style={{ height: `${height}vh` }}
        >
            <div
                className={cn(
                    "flex whitespace-nowrap animate-scroll hover:pause",
                    direction === 'right' && "animate-scroll-reverse"
                )}
                style={{
                    animationDuration: `${speed}s`,
                    gap: itemGap,
                }}
            >
                {content.map((quote, i) => (
                    <button
                        key={`${quote.symbol}-${i}`}
                        onClick={() => onSymbolClick(quote.symbol)}
                        className="flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
                        style={{
                            gap: contentGap,
                            paddingLeft: cardPadding,
                            paddingRight: cardPadding
                        }}
                    >
                        <span
                            className="font-bold text-white/90 flex items-center"
                            style={{ fontSize: symbolSize, gap: symbolGap }}
                        >
                            <span className={quote.regularMarketChangePercent >= 0 ? "text-neon-green" : "text-neon-red"}>
                                {quote.regularMarketChangePercent >= 0 ? '▲' : '▼'}
                            </span>
                            {quote.symbol}
                        </span>
                        <div
                            className={cn(
                                "flex items-center font-mono",
                                quote.regularMarketChangePercent >= 0 ? "text-neon-green" : "text-neon-red"
                            )}
                            style={{ fontSize: priceSize }}
                        >
                            {quote.regularMarketPrice?.toFixed(2)}
                            <span
                                className="opacity-80"
                                style={{ fontSize: percentSize, marginLeft: priceGap }}
                            >
                                ({Math.abs(quote.regularMarketChangePercent)?.toFixed(2)}%)
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Gradient masks for smooth fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        </div>
    );
}
