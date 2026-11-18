const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  SGD: 'S$',
};

const ESTIMATED_RATES_TO_INR: Record<string, number> = {
  INR: 1,
  USD: 86.5,
  EUR: 91.2,
  GBP: 109.8,
  AED: 23.5,
  SGD: 64.2,
};

/**
 * Formats a numeric amount with appropriate currency symbols and separators.
 * Defaults to INR Indian numbering system (Lakhs/Crores) if currency is INR.
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = 'INR',
  options?: { hideDecimals?: boolean; compact?: boolean }
): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;
  if (isNaN(numeric)) return `${CURRENCY_SYMBOLS[currency] || currency + ' '}0`;

  const isINR = currency.toUpperCase() === 'INR';
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] || `${currency.toUpperCase()} `;

  if (options?.compact) {
    if (Math.abs(numeric) >= 10000000) {
      return `${symbol}${(numeric / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(numeric) >= 100000) {
      return `${symbol}${(numeric / 100000).toFixed(2)} L`;
    }
    if (Math.abs(numeric) >= 1000) {
      return `${symbol}${(numeric / 1000).toFixed(1)}k`;
    }
  }

  const fractionDigits = options?.hideDecimals
    ? 0
    : Number.isInteger(numeric)
    ? 0
    : 2;

  try {
    const formatted = new Intl.NumberFormat(isINR ? 'en-IN' : 'en-US', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(numeric);

    return `${symbol}${formatted}`;
  } catch {
    return `${symbol}${numeric.toFixed(fractionDigits)}`;
  }
}

/**
 * Parses user input string (handling commas, currency symbols, whitespace) into a clean number.
 */
export function parseCurrencyInput(input: string): number {
  if (!input) return 0;
  // Remove currency symbols, commas, spaces
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Simple estimated currency converter based on standard rates.
 */
export function convertCurrency(
  amount: number,
  from: string = 'INR',
  to: string = 'USD'
): number {
  const fromRate = ESTIMATED_RATES_TO_INR[from.toUpperCase()] || 1;
  const toRate = ESTIMATED_RATES_TO_INR[to.toUpperCase()] || 1;

  // Convert to INR first, then to target currency
  const inINR = amount * fromRate;
  const converted = inINR / toRate;

  return Math.round(converted * 100) / 100;
}
