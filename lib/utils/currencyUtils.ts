import { currencyCodes } from '../data/currency';

export const isValidCurrency = (currency: string): boolean =>
  currencyCodes.includes(currency);
