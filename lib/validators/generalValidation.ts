import { body } from 'express-validator';
import { findUniqueById } from '../utils/prismaUtils';
import { ModelName } from '../types/prisma.interfaces';

export const resourceExists = (
  model: ModelName,
  field: string,
  optional = false
) => {
  if (optional) {
    return body(field)
      .optional()
      .custom(async (value) => {
        if (!value) return Promise.reject('No params provided');
        const data = await findUniqueById(model, value);
        if (!data) {
          return Promise.reject(`${model} does not exist`);
        }
      });
  } else {
    return body(field).custom(async (value) => {
      if (!value) return Promise.reject('No params provided');
      const data = await findUniqueById(model, value);
      if (!data) {
        return Promise.reject(`${model} does not exist`);
      }
    });
  }
};

export const resourceBelongsToUser = (
  model: ModelName,
  field: string,
  optional = false
) => {
  if (optional) {
    return body(field)
      .optional()
      .custom(async (value, { req }) => {
        if (!value) return Promise.reject('No params provided');
        const data = await findUniqueById(model, value);
        const userId = req.user?.id;
        if (data?.userId !== userId) {
          return Promise.reject(`${model} does not belong to user`);
        }
      });
  } else {
    return body(field).custom(async (value, { req }) => {
      if (!value) return Promise.reject('No params provided');
      const data = await findUniqueById(model, value);
      const userId = req.user?.id;
      if (data?.userId !== userId) {
        return Promise.reject(`${model} does not belong to user`);
      }
    });
  }
};
