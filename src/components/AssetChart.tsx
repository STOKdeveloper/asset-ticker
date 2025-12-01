'use client';

import { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface HistoricalData {
    date: string; // or Date
    close: number;
}

interface AssetChartProps {
    symbol: string;
    isPaused: boolean;
    onTogglePause: () => void;
    onPause?: () => void;
}

export default function AssetChart({ symbol, isPaused, onTogglePause, onPause }: AssetChartProps) {
    const getDefaultRange = () => {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const hour = now.getHours();

        // Saturday >= 6am
        if (day === 6 && hour >= 6) return '1mo';
        // Sunday (all day)
        if (day === 0) return '1mo';
        // Monday < 6am
        if (day === 1 && hour < 6) return '1mo';

        return '1d';
    };

    const [data, setData] = useState<HistoricalData[]>([]);
    const [range, setRange] = useState<'1d' | '5d' | '1mo' | 'ytd' | '1y'>(getDefaultRange);
    const [loading, setLoading] = useState(false);
    const [assetName, setAssetName] = useState<string>(symbol);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/history?symbol=${symbol}&range=${range}`);
                const json = await res.json();
                if (Array.isArray(json)) {
                    setData(json);
                }
            } catch (error) {
                console.error('Failed to fetch history', error);
            } finally {
                setLoading(false);
            }
        };

        if (symbol) {
            fetchData();
        }
    }, [symbol, range]);

    // Fetch asset name from quote API
    useEffect(() => {
        const fetchAssetName = async () => {
            try {
                const res = await fetch(`/api/quote?symbols=${symbol}`);
                const json = await res.json();
                if (Array.isArray(json) && json.length > 0) {
                    const quote = json[0];
                    setAssetName(quote.shortName || quote.longName || symbol);
                }
            } catch (error) {
                console.error('Failed to fetch asset name', error);
                setAssetName(symbol);
            }
        };

        if (symbol) {
            fetchAssetName();
        }
    }, [symbol]);

    // Track user interaction
    const lastInteractionTime = useRef<number>(Date.now());

    useEffect(() => {
        const updateInteractionTime = () => {
            lastInteractionTime.current = Date.now();
        };

        window.addEventListener('mousemove', updateInteractionTime);
        window.addEventListener('keydown', updateInteractionTime);
        window.addEventListener('click', updateInteractionTime);
        window.addEventListener('scroll', updateInteractionTime);

        return () => {
            window.removeEventListener('mousemove', updateInteractionTime);
            window.removeEventListener('keydown', updateInteractionTime);
            window.removeEventListener('click', updateInteractionTime);
            window.removeEventListener('scroll', updateInteractionTime);
        };
    }, []);

    // Check every hour if we should reset to default
    useEffect(() => {
        const checkInterval = setInterval(() => {
            const now = Date.now();
            const timeSinceInteraction = now - lastInteractionTime.current;
            const thirtyMinutes = 30 * 60 * 1000;

            if (timeSinceInteraction > thirtyMinutes) {
                const newDefault = getDefaultRange();
                setRange(prev => {
                    if (prev !== newDefault) return newDefault;
                    return prev;
                });
            }
        }, 60 * 60 * 1000); // Check every hour

        return () => clearInterval(checkInterval);
    }, []);

    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem);
        if (range === '1d') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (range === '5d' || range === '1mo') return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    };

    const isPositive = data.length > 1 && data[data.length - 1].close >= data[0].close;
    const color = isPositive ? '#00ff9d' : '#ff0055'; // Neon Green / Neon Red

    return (
        <div className="w-full h-full flex flex-col bg-white/5 backdrop-blur-md rounded-3xl py-6 px-12 shadow-2xl">
            <div className="mb-8 grid grid-cols-3 items-center">
                <div className="justify-self-start">
                    <h2 className="text-3xl font-bold text-white tracking-tight ml-8">{assetName}</h2>
                </div>

                <div className="flex gap-4 justify-self-center">
                    {(['1d', '5d', '1mo', 'ytd', '1y'] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => {
                                setRange(r);
                                onPause?.();
                            }}
                            className={cn(
                                "h-12 px-6 text-lg font-medium transition-all flex items-center justify-center rounded-none",
                                range === r
                                    ? "text-blue-500 bg-blue-600/20 border border-blue-600/30 font-bold shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                                    : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                            )}
                            style={range === r ? { color: '#3b82f6', borderColor: 'rgba(37,99,235,0.5)', backgroundColor: 'rgba(37,99,235,0.2)' } : undefined}
                        >
                            {r.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="justify-self-end pr-2">
                    <button
                        onClick={onTogglePause}
                        className="h-12 w-12 flex items-center justify-center rounded-none text-white/60 hover:text-white transition-colors hover:bg-white/5"
                        aria-label={isPaused ? "Play" : "Pause"}
                    >
                        {isPaused ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-[400px] w-full relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 rounded-xl">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                )}

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatXAxis}
                            stroke="rgba(255,255,255,0.2)"
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            stroke="rgba(255,255,255,0.2)"
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `$${val.toFixed(2)}`}
                            width={60}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                        />
                        <Area
                            type="monotone"
                            dataKey="close"
                            stroke={color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div >
    );
}
