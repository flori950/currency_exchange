import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ArrowRightLeft, Calculator as CalculatorIcon, TrendingUp, Settings, Sun, Moon, Palette, Info, Paintbrush, RotateCcw } from 'lucide-react';
import type { Currency, HistoricalRate, ChartTimePeriod } from './types';
import { ALL_CURRENCIES, POPULAR_CURRENCIES, CHART_TIME_PERIODS } from './constants/currencies';
import { exchangeRateService } from './services/exchangeRateService';
import { useToast } from './hooks/useToast';
import { useTheme } from './hooks/useTheme';
import { useDesign } from './hooks/useDesign';
import { CurrencySelector } from './components/CurrencySelector';
import { Calculator } from './components/Calculator';
import { CurrencyChart } from './components/CurrencyChart';
import { ToastContainer } from './components/Toast';
import './styles/global.css';
import './App.css';

function App() {
  const [fromCurrency, setFromCurrency] = useState<Currency>(POPULAR_CURRENCIES[0]); // USD
  const [toCurrency, setToCurrency] = useState<Currency>(POPULAR_CURRENCIES[1]); // EUR
  const [amount, setAmount] = useState<string>('1');
  const [convertedAmount, setConvertedAmount] = useState<string>('0');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [historicalData, setHistoricalData] = useState<HistoricalRate[]>([]);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [selectedChartPeriod, setSelectedChartPeriod] = useState<ChartTimePeriod>('1m');
  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(false);

  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;
  const { theme, toggleTheme } = useTheme();
  const { designSettings, updateDesignSetting, setDesignStyle, resetToDefault } = useDesign();

  const convertCurrency = useCallback(async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setConvertedAmount('0');
      return;
    }

    setIsLoading(true);
    try {
      const response = await exchangeRateService.getExchangeRates(
        fromCurrency.code,
        [toCurrency.code]
      );

      const rate = response.rates[toCurrency.code];
      if (rate) {
        setExchangeRate(rate);
        const result = parseFloat(amount) * rate;
        setConvertedAmount(result.toFixed(4));
        setLastUpdateTime(new Date());
        
        // Show success toast for real-time rates
        if (response.success && response.timestamp > Date.now() - 120000) {
          toastRef.current.success(`Converted ${amount} ${fromCurrency.code} to ${toCurrency.code}`);
        }
      } else {
        throw new Error('Exchange rate not found');
      }
    } catch (error) {
      console.error('Currency conversion failed:', error);
      
      // No fallback rates - show clear error message
      toastRef.current.error('Failed to fetch current exchange rates. Please check your internet connection and try again.');
      setConvertedAmount('0');
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromCurrency.code, toCurrency.code]);

  const loadHistoricalData = useCallback(async () => {
    setIsLoadingChart(true);
    try {
      const periodOption = CHART_TIME_PERIODS.find(p => p.value === selectedChartPeriod);
      const days = periodOption?.days || 30;
      
      const data = await exchangeRateService.getHistoricalRates(
        fromCurrency.code,
        toCurrency.code,
        days
      );
      setHistoricalData(data);
    } catch (error) {
      console.error('Failed to load historical data:', error);
      setHistoricalData([]);
      throw error; // Re-throw to handle toast outside
    } finally {
      setIsLoadingChart(false);
    }
  }, [fromCurrency.code, toCurrency.code, selectedChartPeriod]);

  // Handle historical data loading with error toast
  const handleLoadHistoricalData = useCallback(async () => {
    try {
      await loadHistoricalData();
    } catch (error) {
      toastRef.current.error('Failed to load chart data');
    }
  }, [loadHistoricalData]);

  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    toastRef.current.info('Currencies swapped');
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (value: string) => {
    // Allow empty string, numbers, and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleCalculatorResult = (value: number) => {
    setAmount(value.toString());
    setShowCalculator(false);
    toast.success('Calculator result applied');
  };

  const clearCache = () => {
    exchangeRateService.clearCache();
    toast.success('Cache cleared successfully');
  };

  // Auto-convert when amount or currencies change
  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      const timeoutId = setTimeout(() => {
        convertCurrency();
      }, 500); // Debounce API calls

      return () => clearTimeout(timeoutId);
    }
  }, [amount, fromCurrency, toCurrency, convertCurrency]);

  // Load historical data when currencies change
  useEffect(() => {
    if (showChart) {
      handleLoadHistoricalData();
    }
  }, [showChart, handleLoadHistoricalData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC to close panels
      if (event.key === 'Escape') {
        if (showCalculator) setShowCalculator(false);
        if (showChart) setShowChart(false);
        if (showSettings) setShowSettings(false);
      }
      
      // Ctrl/Cmd + K for calculator
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowCalculator(!showCalculator);
      }
      
      // Ctrl/Cmd + H for chart
      if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
        event.preventDefault();
        setShowChart(!showChart);
      }
      
      // Ctrl/Cmd + T for theme toggle
      if ((event.ctrlKey || event.metaKey) && event.key === 't') {
        event.preventDefault();
        toggleTheme();
      }
      
      // Ctrl/Cmd + S for swap currencies
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        swapCurrencies();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCalculator, showChart, showSettings, toggleTheme, swapCurrencies]);

  return (
    <HelmetProvider>
      <div className="app">
        <Helmet>
          <title>Currency Converter - Real-time Exchange Rates</title>
          <meta name="description" content="Convert currencies with real-time exchange rates. Features include historical charts, calculator, dark mode, and support for 150+ currencies." />
          <meta name="keywords" content="currency converter, exchange rates, forex, money converter, real-time rates" />
          <meta name="author" content="Currency Converter App" />
          <meta property="og:title" content="Currency Converter - Real-time Exchange Rates" />
          <meta property="og:description" content="Convert currencies with real-time exchange rates and historical charts" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Currency Converter - Real-time Exchange Rates" />
          <meta name="twitter:description" content="Convert currencies with real-time exchange rates and historical charts" />
        </Helmet>

        <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

        <header className="app-header">
          <div className="app-header-content">
            <h1 className="app-title">Currency Converter</h1>
            <div className="app-header-actions">
              <button
                className="action-button"
                onClick={() => setShowCalculator(!showCalculator)}
                title="Toggle Calculator (Ctrl+K)"
              >
                <CalculatorIcon size={20} />
              </button>
              <button
                className="action-button"
                onClick={() => setShowChart(!showChart)}
                title="Toggle Chart (Ctrl+H)"
              >
                <TrendingUp size={20} />
              </button>
              <div className="settings-dropdown">
                <button
                  className="action-button"
                  onClick={() => setShowSettings(!showSettings)}
                  title="Settings"
                >
                  <Settings size={20} />
                </button>
                {showSettings && (
                  <div className="settings-menu apple-glass">
                    <div className="settings-header">
                      <h4>Settings</h4>
                    </div>
                    
                    <div className="settings-section">
                      <h5>Appearance</h5>
                      <button className="settings-item" onClick={toggleTheme}>
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        <kbd>Ctrl+T</kbd>
                      </button>
                    </div>

                    <div className="settings-section">
                      <h5>Design Style</h5>
                      <div className="design-options">
                        <button 
                          className={`design-option ${designSettings.style === 'glass' ? 'active' : ''}`}
                          onClick={() => setDesignStyle('glass')}
                        >
                          <Paintbrush size={16} />
                          <span>Glass</span>
                        </button>
                        <button 
                          className={`design-option ${designSettings.style === 'minimal' ? 'active' : ''}`}
                          onClick={() => setDesignStyle('minimal')}
                        >
                          <Palette size={16} />
                          <span>Minimal</span>
                        </button>
                        <button 
                          className={`design-option ${designSettings.style === 'classic' ? 'active' : ''}`}
                          onClick={() => setDesignStyle('classic')}
                        >
                          <Info size={16} />
                          <span>Classic</span>
                        </button>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h5>Glass Intensity</h5>
                      <div className="slider-container">
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={designSettings.glassmorphismIntensity}
                          onChange={(e) => updateDesignSetting('glassmorphismIntensity', parseFloat(e.target.value))}
                          className="glass-slider"
                        />
                        <span className="slider-value">{Math.round(designSettings.glassmorphismIntensity * 100)}%</span>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h5>Border Radius</h5>
                      <div className="slider-container">
                        <input
                          type="range"
                          min="4"
                          max="32"
                          step="2"
                          value={designSettings.borderRadius}
                          onChange={(e) => updateDesignSetting('borderRadius', parseInt(e.target.value))}
                          className="glass-slider"
                        />
                        <span className="slider-value">{designSettings.borderRadius}px</span>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h5>Shadow Intensity</h5>
                      <div className="slider-container">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={designSettings.shadowIntensity}
                          onChange={(e) => updateDesignSetting('shadowIntensity', parseFloat(e.target.value))}
                          className="glass-slider"
                        />
                        <span className="slider-value">{Math.round(designSettings.shadowIntensity * 100)}%</span>
                      </div>
                    </div>

                    <div className="settings-separator"></div>

                    <div className="settings-section">
                      <h5>Actions</h5>
                      <button className="settings-item" onClick={clearCache}>
                        <Palette size={16} />
                        <span>Clear Cache</span>
                      </button>
                      <button className="settings-item" onClick={resetToDefault}>
                        <RotateCcw size={16} />
                        <span>Reset Design</span>
                      </button>
                    </div>

                    <div className="settings-item-info">
                      <Info size={16} />
                      <div>
                        <span>Cache: {exchangeRateService.getCacheSize()} entries</span>
                        {lastUpdateTime && (
                          <small>Last update: {lastUpdateTime.toLocaleTimeString()}</small>
                        )}
                      </div>
                    </div>

                    <div className="settings-separator"></div>
                    
                    <div className="settings-help">
                      <h6>Keyboard Shortcuts</h6>
                      <div className="shortcut-list">
                        <div className="shortcut-item">
                          <kbd>Ctrl+K</kbd><span>Calculator</span>
                        </div>
                        <div className="shortcut-item">
                          <kbd>Ctrl+H</kbd><span>Chart</span>
                        </div>
                        <div className="shortcut-item">
                          <kbd>Ctrl+T</kbd><span>Theme</span>
                        </div>
                        <div className="shortcut-item">
                          <kbd>Ctrl+S</kbd><span>Swap</span>
                        </div>
                        <div className="shortcut-item">
                          <kbd>ESC</kbd><span>Close panels</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="app-main">
          <div className="converter-container">
            <div className="converter-section">
              <div className="currency-input-group">
                <CurrencySelector
                  currencies={ALL_CURRENCIES}
                  selectedCurrency={fromCurrency}
                  onCurrencyChange={setFromCurrency}
                  label="From"
                />
                <div className="amount-input-container">
                  <label className="amount-label">Amount</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="Enter amount"
                    className="amount-input"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="swap-container">
                <button
                  className="swap-button"
                  onClick={swapCurrencies}
                  disabled={isLoading}
                  title="Swap currencies (Ctrl+S)"
                >
                  <ArrowRightLeft size={24} />
                </button>
              </div>

              <div className="currency-input-group">
                <CurrencySelector
                  currencies={ALL_CURRENCIES}
                  selectedCurrency={toCurrency}
                  onCurrencyChange={setToCurrency}
                  label="To"
                />
                <div className="amount-input-container">
                  <label className="amount-label">Converted Amount</label>
                  <div className="converted-amount-display">
                    {isLoading ? (
                      <div className="loading-spinner" />
                    ) : (
                      <span className="converted-amount">{convertedAmount}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {exchangeRate > 0 && (
              <div className="exchange-rate-info">
                <p>
                  1 {fromCurrency.code} = {exchangeRate.toFixed(4)} {toCurrency.code}
                </p>
              </div>
            )}
          </div>

          {showCalculator && (
            <div className="side-panel calculator-panel">
              <div className="panel-header">
                <h3>Calculator</h3>
                <button 
                  className="close-button"
                  onClick={() => setShowCalculator(false)}
                  title="Close Calculator"
                >
                  ×
                </button>
              </div>
              <Calculator onUseResult={handleCalculatorResult} />
            </div>
          )}

          {showChart && (
            <div className="side-panel chart-panel">
              <div className="panel-header">
                <h3>Historical Chart</h3>
                <button 
                  className="close-button"
                  onClick={() => setShowChart(false)}
                  title="Close Chart"
                >
                  ×
                </button>
              </div>
              <CurrencyChart
                data={historicalData}
                fromCurrency={fromCurrency.code}
                toCurrency={toCurrency.code}
                theme={theme}
                selectedPeriod={selectedChartPeriod}
                onPeriodChange={setSelectedChartPeriod}
                isLoading={isLoadingChart}
              />
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>
            Exchange rates provided by{' '}
            <a href="https://exchangerate.host" target="_blank" rel="noopener noreferrer">
              exchangerate.host
            </a>
          </p>
        </footer>
      </div>
    </HelmetProvider>
  );
}

export default App;
