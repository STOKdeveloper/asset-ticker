# Asset Ticker

A real-time financial market display application built with Next.js, featuring live stock and commodity price tickers with interactive charts. Designed for kiosk mode deployment on large displays.

## Overview

Asset Ticker is a full-screen financial dashboard that displays:
- **Dual scrolling tickers** showing real-time stock and commodity prices
- **Interactive price charts** with historical data visualization
- **Asset Board** grid view for a comprehensive market overview
- **Auto-rotating display** that cycles through different assets
- **Kiosk mode support** for dedicated display setups

### Key Features

- 📊 **Real-time Data**: Live price updates from Yahoo Finance API
- 📱 **Asset Board**: Grid view showing all tracked assets with price changes and trends
- 🎨 **Dynamic Scaling**: Tickers automatically scale based on configurable height parameters
- 🔄 **Auto-refresh**: Price data updates every 60 seconds
- 📈 **Historical Charts**: Interactive charts with multiple time ranges (1D, 1W, 1M, 3M, 1Y, YTD, 5Y)
- 🎯 **Click-to-focus**: Click any ticker symbol to view its detailed chart
- 🖥️ **Kiosk Mode**: Full-screen browser mode for dedicated displays
- 🎭 **Visual Indicators**: Color-coded arrows (▲ green, ▼ red) for price movements

### Tracked Assets

Assets are configured in `src/data/symbols.json`:

- **Stocks**: Major tech and market leaders (AAPL, MSFT, NVDA, etc.)
- **Commodities**: Gold, Silver
- **Crypto**: ETH-GBP, BTC-GBP, etc.
- **Indices**: FTSE 100, S&P 500, Dow Jones, NASDAQ
- **SIPP**: Personal pension tracking assets

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Launch in kiosk mode (Windows)
npm run kiosk
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Kiosk Mode

The application includes scripts for launching in full-screen kiosk mode:

```bash
npm run kiosk
```

This will automatically open Chrome or Edge in kiosk mode, ideal for dedicated display setups.

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Charts**: Recharts
- **Data Source**: yahoo-finance2
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── quote/route.ts      # Real-time price data API
│   │   └── history/route.ts    # Historical chart data API
│   ├── page.tsx                 # Main dashboard page
│   └── globals.css              # Global styles
├── components/
│   ├── Ticker.tsx               # Scrolling ticker component
│   ├── AssetChart.tsx           # Interactive chart component
│   └── AssetBoard.tsx           # Grid view component
└── data/
    ├── symbols.json             # Asset configuration
    └── tickers.json             # Ticker grouping configuration
```

## Configuration

### Ticker Height

Ticker heights can be adjusted in `src/components/TickersSection.tsx`:

```typescript
<Ticker symbols={ticker1Symbols} height={15} />  // 15vh
<Ticker symbols={ticker2Symbols} height={10} />  // 10vh
```

### Symbols

Edit the symbol groups in `src/data/symbols.json`:

```json
{
  "symbolGroups": [
    {
      "label": "Stocks",
      "symbols": ["AAPL", "MSFT", "GOOGL"]
    },
    ...
  ]
}
```

### Auto-rotation Speed

Adjust chart auto-rotation in `src/app/page.tsx`:

```typescript
const interval = setInterval(() => {
  // Rotate symbols
}, 12000); // 12 seconds
```

## API Routes

### GET /api/quote
Fetches current price data for specified symbols.

**Query Parameters:**
- `symbols`: Comma-separated list of ticker symbols

**Response:**
```json
[
  {
    "symbol": "AAPL",
    "regularMarketPrice": 150.25,
    "regularMarketChangePercent": 1.5
  }
]
```

### GET /api/history
Fetches historical price data for charting.

**Query Parameters:**
- `symbol`: Ticker symbol
- `range`: Time range (1d, 1wk, 1mo, 3mo, 1y, ytd, 5y)

## Error Handling

The application implements robust error handling:
- **Batch fetching** with automatic fallback to individual symbol requests
- **Graceful degradation** when some symbols fail to load
- **Partial data display** showing successfully loaded symbols even if others fail

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Browser Compatibility

Optimized for:
- Chrome/Edge (recommended for kiosk mode)
- Firefox
- Safari

## License

This project is private and proprietary.

## Acknowledgments

- Market data provided by Yahoo Finance
- Built with Next.js and React
- UI components styled with Tailwind CSS
