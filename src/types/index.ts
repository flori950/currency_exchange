export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ExchangeRate {
  [key: string]: number;
}

export interface ExchangeRateResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: ExchangeRate;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export interface CacheEntry {
  data: ExchangeRateResponse;
  timestamp: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export type Theme = 'light' | 'dark';

export type DesignStyle = 'glass' | 'minimal' | 'classic';

export interface DesignSettings {
  style: DesignStyle;
  glassmorphismIntensity: number;
  borderRadius: number;
  shadowIntensity: number;
}

export type ChartTimePeriod = '1d' | '7d' | '1m' | '3m' | '6m' | '1y' | '2y' | '5y' | '10y' | '30y';

export interface ChartPeriodOption {
  value: ChartTimePeriod;
  label: string;
  days: number;
}

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForOperand: boolean;
}
