import { Quote } from "yahoo-finance2/modules/quote";

export function quotefix(quote: Quote): string {
    let price = Number(quote.regularMarketPrice);

    // LSE stocks are often in pence, convert to pounds
    if (quote.quoteType === 'EQUITY' && quote.exchange === 'LSE') {
        price = price / 100;
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: quote.currency || 'USD',
    }).format(price);
}