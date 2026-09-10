import { USD_TO_MXN_RATE } from '../data/cards';
import { Currency } from '../types';

export const formatPrice = (
  priceUsd: number,
  currency: Currency = 'USD',
  showDual: boolean = true,
  customRate?: number
): { primary: string; secondary?: string } => {
  const activeRate = customRate && customRate > 0 ? customRate : USD_TO_MXN_RATE;

  const usdFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceUsd);

  const priceMxn = priceUsd * activeRate;
  const mxnFormatted = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceMxn);

  if (currency === 'DUAL') {
    return {
      primary: `${usdFormatted} / ${mxnFormatted}`,
      secondary: showDual ? `(Tasa: 1 USD = $${activeRate.toFixed(2)} MXN)` : undefined,
    };
  }

  if (currency === 'MXN') {
    return {
      primary: mxnFormatted,
      secondary: showDual ? `(${usdFormatted})` : undefined,
    };
  }

  return {
    primary: usdFormatted,
    secondary: showDual ? `(~${mxnFormatted})` : undefined,
  };
};

export const toMxn = (priceUsd: number, customRate?: number): number => {
  const activeRate = customRate && customRate > 0 ? customRate : USD_TO_MXN_RATE;
  return priceUsd * activeRate;
};

export const formatChange = (percentage: number): { text: string; isPositive: boolean; isNeutral: boolean } => {
  if (Math.abs(percentage) < 0.01) {
    return { text: '0.00%', isPositive: false, isNeutral: true };
  }
  const isPositive = percentage > 0;
  return {
    text: `${isPositive ? '+' : ''}${percentage.toFixed(2)}%`,
    isPositive,
    isNeutral: false,
  };
};
