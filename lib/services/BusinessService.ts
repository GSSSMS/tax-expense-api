import currencyCodes from '../data/currency';
import { Business } from '@prisma/client';
import prisma from '../prisma';
import { Currency } from '../types/currency.interfaces';
import {
  createBusinessDto,
  createBusinessWithUserDto,
} from '../types/business.dto';
import createHttpError from 'http-errors';
import { Prisma } from '@prisma/client';
class BusinessService {
  static async createBusiness({
    userId,
    name,
    currency,
  }: createBusinessWithUserDto): Promise<Business> {
    if (!this.isValidCurrency(currencyCodes, currency))
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

  static async createManyBusinesses(
    userId: number,
    businesses: createBusinessDto[]
  ): Promise<Prisma.BatchPayload> {
    if (
      !businesses.every((businesses) =>
        this.isValidCurrency(currencyCodes, businesses.currency)
      )
    ) {
      throw createHttpError(403, 'Invalid Currency');
    }

    const businessesWithUserIds = businesses.map((business) => ({
      ...business,
      userId,
    }));
    const newBusinesses = await prisma.business.createMany({
      data: businessesWithUserIds,
    });

    return newBusinesses;
  }

  // static async updateBusiness(id: number, data: ): Promise<Business> {
  //   if (
  //     'currency' in data &&
  //     !this.isValidCurrency(currencyCodes, data.currency)
  //   )
  //     throw createHttpError(403, 'Invalid Currency');

  //   const updatedBusiness = await prisma.business.update({
  //     where: { id: Number(id) },
  //     data,
  //   });

  //   return updatedBusiness;
  // }

  static isValidCurrency(currencies: Currency[], currency: string): boolean {
    return currencies.some((code: Currency) => code.cc === currency);
  }
}

export default BusinessService;
