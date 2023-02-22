import { body, CustomValidator } from 'express-validator';
import prisma from '../prisma';
const isValidUser: CustomValidator = async (userId: number) => {
  return prisma.user.findUnique({ where: { id: userId } }).then((user) => {
    if (user) {
      return Promise.reject('E-mail already in use');
    }
  });
};

// const isCurrency = (value: string) => {
