// SAR to USD conversion at fixed rate of 3.75
export const SAR_TO_USD_RATE = 3.75;

export function sarToUsd(sarAmount: number): number {
  return Math.round((sarAmount / SAR_TO_USD_RATE) * 100) / 100;
}

export function usdToSar(usdAmount: number): number {
  return Math.round((usdAmount * SAR_TO_USD_RATE) * 100) / 100;
}

export function formatSAR(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseSARAmount(sarString: string): number {
  // Remove currency symbols and parse
  const cleanString = sarString.replace(/[^\d.-]/g, '');
  return parseFloat(cleanString) || 0;
}