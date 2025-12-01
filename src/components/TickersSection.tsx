'use client';

import Ticker from './Ticker';

interface TickersSectionProps {
    stocks: string[];
    commodities: string[];
    onSymbolClick: (symbol: string) => void;
}

export default function TickersSection({ stocks, commodities, onSymbolClick }: TickersSectionProps) {
    return (
        <>
            <Ticker
                symbols={stocks}
                onSymbolClick={onSymbolClick}
                speed={40}
                height={15}
            />

            <Ticker
                symbols={commodities}
                onSymbolClick={onSymbolClick}
                speed={40}
                height={10}
            />
        </>
    );
}
