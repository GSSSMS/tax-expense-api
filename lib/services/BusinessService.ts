import currencyCodes from '../data/currency';
import { Business } from '@prisma/client';
import prisma from '../prisma';
import { Currency } from '../interfaces/currency.interfaces';
import { createBusinessWithUserDto } from '../dtos/business.dto';
import createHttpError from 'http-errors';
class BusinessService {
  static async createBusiness({
    userId,
    name,
    currency,
  }: createBusinessWithUserDto): Promise<Business> {
    if (!isValidCurrency(currencyCodes, currency))
      throw createHttpError(403, 'Invalid Currency');

    const business = await prisma.business.create({
      data: {
        name,
        currency,
        userId,
      },
    });
    return business;
  }
}
function isValidCurrency(currencies: Currency[], currency: string): boolean {
  return currencies.some((code: Currency) => code.cc === currency);
}

export default BusinessService;
