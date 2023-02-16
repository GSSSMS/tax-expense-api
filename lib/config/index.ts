import dotenv from 'dotenv';
dotenv.config();

export const { COOKIE_NAME } = process.env;
export const { SALT_ROUNDS } = process.env;
export const { NODE_ENV } = process.env || 'development';
export const { JWT_SECRET } = process.env;
export const { PORT } = process.env || '8000';
