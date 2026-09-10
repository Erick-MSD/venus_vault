import { useState, useEffect, useCallback } from 'react';
import { fetchLiveUsdToMxnRate, ExchangeRateData } from '../services/currencyService';

export function useLiveExchangeRate() {
  const [exchangeData, setExchangeData] = useState<ExchangeRateData>({
    rate: 18.65,
    lastUpdated: 'Cargando...',
    source: 'Consultando API...',
    isLive: false,
    isLoading: true,
    error: null,
  });

  const refreshRate = useCallback(async () => {
    setExchangeData((prev) => ({ ...prev, isLoading: true }));
    try {
      const data = await fetchLiveUsdToMxnRate();
      setExchangeData({
        rate: data.rate,
        lastUpdated: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        source: data.source,
        isLive: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      setExchangeData((prev) => ({
        ...prev,
        isLoading: false,
        isLive: false,
        error: 'No se pudo conectar con la API de divisas',
      }));
    }
  }, []);

  useEffect(() => {
    refreshRate();
    // Auto refresh every 10 minutes
    const interval = setInterval(refreshRate, 600000);
    return () => clearInterval(interval);
  }, [refreshRate]);

  return {
    exchangeData,
    refreshRate,
  };
}
