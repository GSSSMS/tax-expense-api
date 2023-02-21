import currencyCodes from '../data/currency';
class CurrencyService {
  static isValidCurrency(currency: string): boolean {
    return currencyCodes.map(({ cc }) => cc).includes(currency);
  }
}

export default CurrencyService;
