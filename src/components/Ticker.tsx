'use client';

import { useEffect, useState } from 'react';
import TickerItem from './TickerItem';
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
    const [isPaused, setIsPaused] = useState(false);

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

    const handleItemClick = (symbol: string) => {
        setIsPaused(true);
        onSymbolClick(symbol);
        setTimeout(() => setIsPaused(false), 1000);
    };

    if (loading) return <div className="h-64 bg-gray-900/50 animate-pulse w-full my-2" />;

    // Duplicate content for seamless loop
    const content = [...quotes, ...quotes, ...quotes];

    // Dynamic sizing
    const itemGap = `${height * 0.0}vh`; // Gap between ticker items

    return (
        <div
            className="relative flex items-center overflow-hidden w-full bg-black/20 backdrop-blur-sm border-y border-white/5 select-none group"
            style={{ height: `${height}vh` }}
        >
            <div
                className={cn(
                    "flex whitespace-nowrap animate-scroll",
                    direction === 'right' && "animate-scroll-reverse"
                )}
                style={{
                    animationDuration: `${speed}s`,
                    gap: itemGap,
                    animationPlayState: isPaused ? 'paused' : 'running'
                }}
            >
                {content.map((quote, i) => (
                    <TickerItem
                        key={`${quote.symbol}-${i}`}
                        symbol={quote.symbol}
                        price={quote.regularMarketPrice}
                        changePercent={quote.regularMarketChangePercent}
                        onClick={() => handleItemClick(quote.symbol)}
                        height={height}
                    />
                ))}
            </div>

            {/* Gradient masks for smooth fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        </div>
    );
}
