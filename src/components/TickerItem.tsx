'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TickerItemProps {
    symbol: string;
    price: number;
    changePercent: number;
    onClick: () => void;
    height: number;
}

export default function TickerItem({ symbol, price, changePercent, onClick, height }: TickerItemProps) {
    // Dynamic sizing
    const symbolSize = `${height * 0.4}vh`;
    const priceSize = `${height * 0.25}vh`;
    const percentSize = `${height * 0.15}vh`;
    const contentGap = `${height * 0.1}vh`; // Gap inside the button
    const symbolGap = `${height * 0.04}vh`; // Gap between arrow and symbol
    const priceGap = `${height * 0.07}vh`; // Gap between price and percentage
    const cardPadding = `${height * 0.2}vh`; // Horizontal padding

    return (
        <button
            onClick={onClick}
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
                <span className={changePercent >= 0 ? "text-neon-green" : "text-neon-red"}>
                    {changePercent >= 0 ? '▲' : '▼'}
                </span>
                {symbol}
            </span>
            <div
                className={cn(
                    "flex items-center font-mono",
                    changePercent >= 0 ? "text-neon-green" : "text-neon-red"
                )}
                style={{ fontSize: priceSize }}
            >
                {price?.toFixed(2)}
                <span
                    className="opacity-80"
                    style={{ fontSize: percentSize, marginLeft: priceGap }}
                >
                    ({Math.abs(changePercent)?.toFixed(2)}%)
                </span>
            </div>
        </button>
    );
}
