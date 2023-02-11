// eslint-disable-next-line no-unused-vars
import { ErrorRequestHandler } from 'express';
export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const status = err.status || 500;

  res.status(status);

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.send({
    status,
    message: err.message,
  });
};
