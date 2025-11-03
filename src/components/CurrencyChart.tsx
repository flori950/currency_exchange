import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Calendar, TrendingUp } from 'lucide-react';
import type { HistoricalRate, ChartTimePeriod } from '../types';
import { CHART_TIME_PERIODS } from '../constants/currencies';
import '../styles/CurrencyChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CurrencyChartProps {
  data: HistoricalRate[];
  fromCurrency: string;
  toCurrency: string;
  theme: 'light' | 'dark';
  selectedPeriod: ChartTimePeriod;
  onPeriodChange: (period: ChartTimePeriod) => void;
  isLoading?: boolean;
}

export const CurrencyChart: React.FC<CurrencyChartProps> = ({
  data,
  fromCurrency,
  toCurrency,
  theme,
  selectedPeriod,
  onPeriodChange,
  isLoading = false,
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const [showPeriodSelector, setShowPeriodSelector] = useState(false);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.update();
    }
  }, [theme]);

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">
            <TrendingUp size={20} />
            <h3>{fromCurrency} to {toCurrency} Exchange Rate</h3>
          </div>
          
          <div className="chart-period-selector">
            <button
              className="period-selector-button"
              onClick={() => setShowPeriodSelector(!showPeriodSelector)}
            >
              <Calendar size={16} />
              <span>{CHART_TIME_PERIODS.find(p => p.value === selectedPeriod)?.label || '1 Month'}</span>
            </button>
            
            {showPeriodSelector && (
              <div className="period-selector-dropdown">
                {CHART_TIME_PERIODS.map((period) => (
                  <button
                    key={period.value}
                    className={`period-option ${selectedPeriod === period.value ? 'active' : ''}`}
                    onClick={() => {
                      onPeriodChange(period.value);
                      setShowPeriodSelector(false);
                    }}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="chart-loading">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading chart data...</p>
            </div>
          ) : (
            <div className="no-data">
              <TrendingUp size={48} />
              <p>No chart data available</p>
              <small>Try selecting a different time period</small>
            </div>
          )}
        </div>
      </div>
    );
  }

  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const days = CHART_TIME_PERIODS.find(p => p.value === selectedPeriod)?.days || 30;
    
    if (days <= 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } else if (days <= 90) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (days <= 365) {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric' });
    }
  };

  const chartData = {
    labels: data.map(item => formatDateLabel(item.date)),
    datasets: [
      {
        label: `${fromCurrency} to ${toCurrency}`,
        data: data.map(item => item.rate),
        borderColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
        backgroundColor: theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
        pointBorderColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: data.length > 100 ? 0 : 3,
        pointHoverRadius: 6,
        pointHitRadius: 10,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#e2e8f0' : '#374151',
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      title: {
        display: false, // We'll use our custom header instead
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        titleColor: theme === 'dark' ? '#f1f5f9' : '#1f2937',
        bodyColor: theme === 'dark' ? '#e2e8f0' : '#374151',
        borderColor: theme === 'dark' ? '#475569' : '#d1d5db',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `1 ${fromCurrency} = ${value?.toFixed(4) || 'N/A'} ${toCurrency}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
          callback: function(value) {
            return typeof value === 'number' ? value.toFixed(4) : value;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      point: {
        hoverBackgroundColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title">
          <TrendingUp size={20} />
          <h3>{fromCurrency} to {toCurrency} Exchange Rate</h3>
        </div>
        
        <div className="chart-period-selector">
          <button
            className="period-selector-button"
            onClick={() => setShowPeriodSelector(!showPeriodSelector)}
          >
            <Calendar size={16} />
            <span>{CHART_TIME_PERIODS.find(p => p.value === selectedPeriod)?.label || '1 Month'}</span>
          </button>
          
          {showPeriodSelector && (
            <div className="period-selector-dropdown">
              {CHART_TIME_PERIODS.map((period) => (
                <button
                  key={period.value}
                  className={`period-option ${selectedPeriod === period.value ? 'active' : ''}`}
                  onClick={() => {
                    onPeriodChange(period.value);
                    setShowPeriodSelector(false);
                  }}
                >
                  {period.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="chart-wrapper">
        {isLoading ? (
          <div className="chart-loading">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading chart data...</p>
            </div>
          </div>
        ) : (
          <Line ref={chartRef} data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};
