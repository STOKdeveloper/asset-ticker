'use client';

import Ticker from './Ticker';

interface TickersSectionProps {
    ticker1Symbols: string[];
    ticker2Symbols: string[];
    onSymbolClick: (symbol: string) => void;
}

export default function TickersSection({ ticker1Symbols, ticker2Symbols, onSymbolClick }: TickersSectionProps) {
    return (
        <>
            <Ticker
                symbols={ticker1Symbols}
                onSymbolClick={onSymbolClick}
                speed={60}
                height={15}
            />

            <Ticker
                symbols={ticker2Symbols}
                onSymbolClick={onSymbolClick}
                speed={40}
                height={10}
            />
        </>
    );
}
