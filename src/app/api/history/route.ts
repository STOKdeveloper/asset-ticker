import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const range = searchParams.get('range') || '1mo'; // 1d, 1mo, 1y

    if (!symbol) {
        return NextResponse.json({ error: 'No symbol provided' }, { status: 400 });
    }

    let period1: Date;
    const now = new Date();
    let interval: '1m' | '1d' | '1wk' | '1mo' = '1d';

    switch (range) {
        case '1d':
            period1 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            interval = '1m'; // Intraday needs granular data
            break;
        case '5d':
            period1 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
            interval = '1m'; // Use minute intervals for 5 days
            break;
        case '1mo':
            period1 = new Date(now.setMonth(now.getMonth() - 1));
            interval = '1d';
            break;
        case 'ytd':
            // Year to date - start from January 1st of current year
            period1 = new Date(now.getFullYear(), 0, 1);
            interval = '1d';
            break;
        case '1y':
            period1 = new Date(now.setFullYear(now.getFullYear() - 1));
            interval = '1d'; // or 1wk
            break;
        default:
            period1 = new Date(now.setMonth(now.getMonth() - 1));
    }

    try {


        // yahooFinance.chart is often better for historical data than historical() for charts
        const queryOptions = {
            period1: period1.toISOString().split('T')[0], // YYYY-MM-DD
            interval: interval,
        };
        const result = await yahooFinance.chart(symbol, queryOptions as any);

        // The result structure of chart() is different, usually { meta, quotes }
        // We need to return quotes or map them.
        // Let's return the quotes array directly to match what the frontend expects (array of objects with date/close)
        if (result && result.quotes) {
            return NextResponse.json(result.quotes);
        }
        return NextResponse.json([]);
    } catch (error) {
        console.error('Error fetching history:', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
