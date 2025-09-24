(() => {
  const API_ROOT = 'https://api.coingecko.com/api/v3';
  const DEFAULT_RANGE = 7;
  const DEFAULT_MARKET = 'bitcoin';

  const chartContainer = document.getElementById('chart');
  if (!chartContainer || !window.LightweightCharts) {
    console.error('Chart container or LightweightCharts not available.');
    return;
  }

  const statusEl = document.getElementById('status');
  const lastUpdatedEl = document.getElementById('last-updated');
  const marketSelect = document.getElementById('market');
  const rangeButtons = Array.from(document.querySelectorAll('[data-range]'));
  const maToggle = document.getElementById('ma-toggle');
  const maSlider = document.getElementById('ma-window');
  const maOutput = document.getElementById('ma-window-output');
  const volumeToggle = document.getElementById('volume-toggle');
  const refreshButton = document.getElementById('refresh');

  const statClose = document.getElementById('stat-close');
  const statHigh = document.getElementById('stat-high');
  const statLow = document.getElementById('stat-low');
  const statVolume = document.getElementById('stat-volume');
  const statMA = document.getElementById('stat-ma');
  const statCount = document.getElementById('stat-count');

  if (statusEl) {
    statusEl.dataset.tone = 'info';
  }

  const chart = LightweightCharts.createChart(chartContainer, {
    layout: {
      background: { type: 'solid', color: '#ffffff' },
      textColor: '#1f2937',
    },
    grid: {
      vertLines: { color: '#eef2ff' },
      horzLines: { color: '#eef2ff' },
    },
    timeScale: {
      borderVisible: false,
    },
    rightPriceScale: {
      borderVisible: false,
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    },
    localization: {
      priceFormatter: (value) => formatCurrency(value),
    },
  });

  const candleSeries = chart.addCandlestickSeries({
    upColor: '#16a34a',
    downColor: '#dc2626',
    wickUpColor: '#16a34a',
    wickDownColor: '#dc2626',
    borderUpColor: '#16a34a',
    borderDownColor: '#dc2626',
  });

  const maSeries = chart.addLineSeries({
    color: '#0e7490',
    lineWidth: 2,
    priceLineVisible: false,
    lastValueVisible: true,
  });

  const volumeSeries = chart.addHistogramSeries({
    priceScaleId: '',
    color: 'rgba(59, 130, 246, 0.45)',
    priceFormat: { type: 'volume' },
    scaleMargins: { top: 0.8, bottom: 0 },
  });

  const state = {
    market: DEFAULT_MARKET,
    range: DEFAULT_RANGE,
    maWindow: Number(maSlider?.value) || 8,
    showMA: Boolean(maToggle?.checked),
    showVolume: Boolean(volumeToggle?.checked),
    candles: [],
    volumes: [],
  };

  maSeries.applyOptions({ visible: state.showMA });
  volumeSeries.applyOptions({ visible: state.showVolume });

  function formatCurrency(value) {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value ?? 0);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: value < 100 ? 2 : 0,
    }).format(value ?? 0);
  }

  function setStatus(message, tone = 'info') {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.tone = tone;
  }

  function setLastUpdated(date = new Date()) {
    if (!lastUpdatedEl) return;
    const time = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
    lastUpdatedEl.textContent = `Updated ${time}`;
  }

  async function fetchOhlc(market, range) {
    const response = await fetch(`${API_ROOT}/coins/${market}/ohlc?vs_currency=usd&days=${range}`);
    if (!response.ok) {
      throw new Error(`OHLC request failed: ${response.status}`);
    }
    return response.json();
  }

  async function fetchVolume(market, range) {
    const response = await fetch(`${API_ROOT}/coins/${market}/market_chart?vs_currency=usd&days=${range}`);
    if (!response.ok) {
      throw new Error(`Volume request failed: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data?.total_volumes) ? data.total_volumes : [];
  }

  function toCandles(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map((point) => ({
      time: Math.floor(point[0] / 1000),
      open: point[1],
      high: point[2],
      low: point[3],
      close: point[4],
    }));
  }

  function toVolumePoints(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
      .map((point) => ({ time: Math.floor(point[0] / 1000), value: point[1] }))
      .sort((a, b) => a.time - b.time);
  }

  function mapVolumesToCandles(candles, volumePoints) {
    if (!candles.length || !volumePoints.length) return [];
    const result = [];
    let pointer = 0;
    for (const candle of candles) {
      while (
        pointer + 1 < volumePoints.length &&
        Math.abs(volumePoints[pointer + 1].time - candle.time) <= Math.abs(volumePoints[pointer].time - candle.time)
      ) {
        pointer += 1;
      }
      const volume = volumePoints[pointer]?.value ?? 0;
      result.push({ time: candle.time, value: volume });
    }
    return result;
  }

  function computeMovingAverage(candles, windowSize) {
    if (!candles.length) return [];
    const size = Math.max(2, windowSize);
    const values = [];
    let sum = 0;
    const closes = candles.map((candle) => candle.close);
    for (let i = 0; i < closes.length; i += 1) {
      sum += closes[i];
      if (i >= size) {
        sum -= closes[i - size];
      }
      if (i >= size - 1) {
        const average = sum / size;
        values.push({ time: candles[i].time, value: average });
      }
    }
    return values;
  }

  function updateStats(candles, volumes) {
    if (!candles.length) {
      statClose.textContent = '–';
      statHigh.textContent = '–';
      statLow.textContent = '–';
      statVolume.textContent = '–';
      statMA.textContent = state.showMA ? '–' : 'off';
      statCount.textContent = '0';
      return;
    }

    const lastCandle = candles[candles.length - 1];
    const highs = candles.map((candle) => candle.high);
    const lows = candles.map((candle) => candle.low);
    const maValues = computeMovingAverage(candles, state.maWindow);

    statClose.textContent = formatCurrency(lastCandle.close);
    statHigh.textContent = formatCurrency(Math.max(...highs));
    statLow.textContent = formatCurrency(Math.min(...lows));

    if (volumes.length) {
      const lastVolume = volumes[volumes.length - 1];
      statVolume.textContent = `${formatNumber(lastVolume.value)} USD`;
    } else {
      statVolume.textContent = '–';
    }

    if (state.showMA && maValues.length) {
      statMA.textContent = formatCurrency(maValues[maValues.length - 1].value);
    } else {
      statMA.textContent = 'off';
    }

    statCount.textContent = String(candles.length);
  }

  async function loadData() {
    setStatus('Fetching market data…');
    try {
      const [rawCandles, rawVolumes] = await Promise.all([
        fetchOhlc(state.market, state.range),
        fetchVolume(state.market, state.range),
      ]);

      const candles = toCandles(rawCandles);
      const volumePoints = toVolumePoints(rawVolumes);
      const volumes = mapVolumesToCandles(candles, volumePoints);

      state.candles = candles;
      state.volumes = volumes;

      candleSeries.setData(candles);

      const maValues = computeMovingAverage(candles, state.maWindow);
      maSeries.setData(maValues);
      maSeries.applyOptions({ visible: state.showMA });

      volumeSeries.setData(volumes);
      volumeSeries.applyOptions({ visible: state.showVolume });

      chart.timeScale().fitContent();

      updateStats(candles, volumes);
      const marketLabel = marketSelect?.selectedOptions?.[0]?.textContent || state.market;
      setStatus(`Loaded ${candles.length} candles for ${marketLabel}.`);
      setLastUpdated();
    } catch (error) {
      console.error(error);
      setStatus('Unable to load market data right now. Please try again shortly.', 'error');
    }
  }

  function handleRangeChange(nextRange) {
    state.range = nextRange;
    rangeButtons.forEach((button) => {
      const pressed = Number(button.dataset.range) === nextRange;
      button.setAttribute('aria-pressed', String(pressed));
    });
    loadData();
  }

  function handleMarketChange(event) {
    state.market = event.target.value;
    loadData();
  }

  function handleMaToggle(event) {
    state.showMA = event.target.checked;
    if (maSlider) {
      maSlider.disabled = !state.showMA;
      maOutput.textContent = String(state.maWindow);
    }
    maSeries.applyOptions({ visible: state.showMA });
    updateStats(state.candles, state.volumes);
  }

  function handleMaWindow(event) {
    const value = Number(event.target.value);
    state.maWindow = value;
    if (maOutput) {
      maOutput.textContent = String(value);
    }
    const maValues = computeMovingAverage(state.candles, state.maWindow);
    maSeries.setData(maValues);
    updateStats(state.candles, state.volumes);
  }

  function handleVolumeToggle(event) {
    state.showVolume = event.target.checked;
    volumeSeries.applyOptions({ visible: state.showVolume });
    updateStats(state.candles, state.volumes);
  }

  rangeButtons.forEach((button) => {
    button.addEventListener('click', () => handleRangeChange(Number(button.dataset.range)));
  });

  marketSelect?.addEventListener('change', handleMarketChange);
  maToggle?.addEventListener('change', handleMaToggle);
  maSlider?.addEventListener('input', handleMaWindow);
  volumeToggle?.addEventListener('change', handleVolumeToggle);
  refreshButton?.addEventListener('click', loadData);

  if (maSlider) {
    maSlider.disabled = !state.showMA;
  }

  if (maOutput) {
    maOutput.textContent = String(state.maWindow);
  }

  const observer = new ResizeObserver(() => {
    const { width, height } = chartContainer.getBoundingClientRect();
    chart.resize(width, height);
  });
  observer.observe(chartContainer);

  loadData();
})();
