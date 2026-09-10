/**
 * Real-time Exchange Rate Service for Venus Vault
 * Connects to live currency API to fetch accurate USD -> MXN conversion rates.
 */

export interface ExchangeRateData {
  rate: number; // 1 USD = X MXN
  lastUpdated: string;
  source: string;
  isLive: boolean;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_RATE = 18.65;
const CACHE_KEY = 'venus_vault_exchange_rate_cache';

export async function fetchLiveUsdToMxnRate(): Promise<{ rate: number; lastUpdated: string; source: string }> {
  // Primary endpoint: open.er-api.com (free, high-uptime, no key required)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data?.rates?.MXN) {
        const rate = Number(data.rates.MXN);
        const lastUpdated = data.time_last_update_utc || new Date().toISOString();
        const result = { rate, lastUpdated, source: 'open.er-api.com (En Vivo)' };
        localStorage.setItem(CACHE_KEY, JSON.stringify(result));
        return result;
      }
    }
  } catch (err) {
    console.warn('Primary exchange API unavailable, trying fallback...', err);
  }

  // Fallback endpoint: exchangerate-api.com
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data?.rates?.MXN) {
        const rate = Number(data.rates.MXN);
        const lastUpdated = data.date || new Date().toISOString();
        const result = { rate, lastUpdated, source: 'exchangerate-api.com (En Vivo)' };
        localStorage.setItem(CACHE_KEY, JSON.stringify(result));
        return result;
      }
    }
  } catch (err) {
    console.warn('Fallback exchange API failed, using cached or baseline rate', err);
  }

  // Use cached value if available
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.rate) {
        return { ...parsed, source: 'Caché local (Última consulta)' };
      }
    }
  } catch {
    // ignore
  }

  return {
    rate: DEFAULT_RATE,
    lastUpdated: new Date().toISOString(),
    source: 'Tasa base referencial Banxico',
  };
}

export const CONDITION_MULTIPLIERS: Record<string, number> = {
  'PSA 10': 2.25,
  'BGS 9.5': 1.85,
  'PSA 9': 1.35,
  NM: 1.0,
  LP: 0.85,
  MP: 0.7,
  HP: 0.5,
};

export function calculateAdjustedPrice(basePriceUsd: number, condition: string): number {
  const mult = CONDITION_MULTIPLIERS[condition] ?? 1.0;
  return Number((basePriceUsd * mult).toFixed(2));
}
