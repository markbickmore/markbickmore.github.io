# Crypto Chart Trainer

An interactive single-page workspace for practicing candlestick reading skills with real cryptocurrency data. The app pulls OHLC candles straight from CoinGecko, renders them with Lightweight Charts, and layers optional training aids like moving averages and volume overlays.

## Features

- **Live markets** – switch between Bitcoin, Ethereum, Litecoin, and XRP without leaving the page.
- **Flexible history windows** – 1, 7, 30, and 90 day presets with instant refetch.
- **Moving average overlay** – toggle on/off and adjust the window from 3–20 candles.
- **Volume histogram** – optional sub-chart using the same timestamps as the candles.
- **Session insights** – running totals for candle count, most recent close, highs/lows, volume, and MA value.
- **Responsive layout** – accessible controls, a11y skip link, and auto-resizing chart panel.

## Development

No build step is required. Just open `index.html` in a modern browser with network access so the CoinGecko requests succeed.

Key files:

- `index.html` – markup and Lightweight Charts loader.
- `style.css` – layout and visual design.
- `script.js` – data fetching, indicator calculations, and chart wiring.

CoinGecko rate-limits anonymous requests, so if data fetching fails just wait a few seconds before retrying.
