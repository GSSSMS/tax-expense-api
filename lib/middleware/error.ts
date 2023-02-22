import { ErrorRequestHandler } from 'express';
// eslint-disable-next-line no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err.status || 500;

  res.status(status);

  console.error(err);

  res.send({
    status,
    message: err.message,
  });
};
