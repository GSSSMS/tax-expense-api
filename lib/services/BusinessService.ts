import { isValidCurrency } from '../utils/currencyUtils';
import { Business } from '@prisma/client';
import prisma from '../prisma';

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
    if (!isValidCurrency(currency))
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
      !businesses.every((businesses) => isValidCurrency(businesses.currency))
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
}

export default BusinessService;
