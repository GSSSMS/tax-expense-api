import { Currency } from '../types/currency.interfaces';
import currencies from '../data/currency';

export const isValidCurrency = (currency: string): boolean =>
  currencies.some((code: Currency) => code.cc === currency);
