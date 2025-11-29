import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get('symbols')?.split(',') || [];

  if (symbols.length === 0) {
    return NextResponse.json({ error: 'No symbols provided' }, { status: 400 });
  }

  try {
    // Try batch fetch first
    const quotes = await yahooFinance.quote(symbols);
    return NextResponse.json(quotes);
  } catch (batchError) {
    console.log('Batch fetch failed, trying individual fetches:', batchError);

    // If batch fails, fetch individually and filter out failures
    const quotePromises = symbols.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        return quote;
      } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}`);
        return null;
      }
    });

    const results = await Promise.all(quotePromises);
    const validQuotes = results.filter((quote) => quote !== null);

    if (validQuotes.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch any quotes' }, { status: 500 });
    }

    return NextResponse.json(validQuotes);
  }
}
