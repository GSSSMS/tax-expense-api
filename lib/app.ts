import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import morgan from 'morgan';
import { notFoundHandler } from './middleware/not-found';
import { errorHandler } from './middleware/error';
import usersController from './controllers/usersController';
import businessController from './controllers/businessController';
import expenseController from './controllers/expenseController';

const app: Express = express();

// Built in middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

// App routes
app.use('/users', usersController);
app.use('/businesses', businessController);
app.use('/expenses', expenseController);
// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
