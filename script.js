const chart = LightweightCharts.createChart(document.getElementById('chart'), {
  width: 800,
  height: 500,
  layout: { backgroundColor: '#ffffff', textColor: '#000' },
  grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
});

const candleSeries = chart.addCandlestickSeries();

// Dummy price data
fetch('https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=7')
  .then(res => res.json())
  .then(data => {
    const formatted = data.map(d => ({
      time: d[0] / 1000,
      open: d[1],
      high: d[2],
      low: d[3],
      close: d[4],
    }));
    candleSeries.setData(formatted);
    drawMA(formatted);
  });

function drawMA(data) {
  const maSeries = chart.addLineSeries({ color: 'blue', lineWidth: 2 });
  const maData = data.map((d, i) => {
    if (i < 5) return null;
    const avg = data.slice(i - 5, i).reduce((sum, x) => sum + x.close, 0) / 5;
    return { time: d.time, value: avg };
  }).filter(Boolean);
  maSeries.setData(maData);

  document.getElementById('showMA').addEventListener('change', (e) => {
    maSeries.applyOptions({ visible: e.target.checked });
  });
}
