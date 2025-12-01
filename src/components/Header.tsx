'use client';

interface HeaderProps {
    title?: string;
    onClick?: () => void;
}

export default function Header({ title = "Asset Ticker", onClick }: HeaderProps) {
    return (
        <h1
            className={`text-center text-2xl font-bold tracking-widest text-white/20 mb-4 uppercase ${onClick ? 'cursor-pointer hover:text-white/30 transition-colors' : ''}`}
            onClick={onClick}
        >
            {title}
        </h1>
    );
}
