import { Business } from '@prisma/client';
import prisma from '../prisma';

import {
  createBusinessDto,
  createBusinessWithUserDto,
} from '../types/business.dto';
import { Prisma } from '@prisma/client';
import CurrencyService from './CurrencyService';
class BusinessService {
  static async createBusiness({
    userId,
    name,
    currency,
  }: createBusinessWithUserDto): Promise<Business> {
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
    // if (
    //   !businesses.every((businesses) => isValidCurrency(businesses.currency))
    // ) {
    //   throw createHttpError(403, 'Invalid Currency');
    // }

    const businessesWithUserIds = this.addUserToBusinesses(businesses, userId);

    const newBusinesses = await prisma.business.createMany({
      data: businessesWithUserIds,
    });

    return newBusinesses;
  }

  static addUserToBusinesses(businesses: createBusinessDto[], userId: number) {
    const businessesWithUserIds = businesses.map((business) => ({
      ...business,
      userId,
    }));
    return businessesWithUserIds;
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
