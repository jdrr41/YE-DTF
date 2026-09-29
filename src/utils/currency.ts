export const DEFAULT_BCV_EUR_RATE = 976.90;
export const BCV_OFFICIAL_URL = 'https://www.bcv.org.ve/glosario/cambio-oficial';

/**
 * Formats a number to Venezuelan Bolívares (Bs.) string:
 * e.g. 1234.56 -> "1.234,56 Bs."
 */
export const formatBs = (amount: number): string => {
  if (isNaN(amount) || amount === 0) return '0,00 Bs.';
  const formatted = new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} Bs.`;
};

/**
 * Formats a number to Euros (€) string:
 * e.g. 15.5 -> "15.50 €"
 */
export const formatEur = (amount: number): string => {
  if (isNaN(amount) || amount === 0) return '0,00 €';
  return `${amount.toFixed(2)} €`;
};

/**
 * Attempts to fetch the latest official BCV Euro exchange rate.
 * Tries public BCV rate endpoints with timeout and fallback.
 */
export const fetchBcvEuroRate = async (): Promise<{ rate: number; date?: string }> => {
  // Provider 1: ve.dolarapi.com/v1/euros/oficial
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://ve.dolarapi.com/v1/euros/oficial', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.promedio === 'number' && data.promedio > 0) {
        return {
          rate: Number(data.promedio.toFixed(4)),
          date: data.fechaActualizacion || new Date().toISOString().split('T')[0],
        };
      }
    }
  } catch (err) {
    console.warn('Error fetching BCV rate from provider 1, trying provider 2:', err);
  }

  // Provider 2: bcv.today/api/v1/rate.json
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://bcv.today/api/v1/rate.json', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.EUR === 'number' && data.EUR > 0) {
        return {
          rate: Number(data.EUR.toFixed(4)),
          date: data.effective_date || data.date || new Date().toISOString().split('T')[0],
        };
      }
    }
  } catch (err) {
    console.warn('Error fetching BCV rate from provider 2:', err);
  }

  return { rate: DEFAULT_BCV_EUR_RATE };
};
