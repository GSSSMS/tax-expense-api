import cookieParser from 'cookie-parser';
import express, {Express} from 'express';
import morgan from 'morgan';
import { notFoundHandler } from './middleware/not-found';
import { errorHandler } from './middleware/error';
import usersController from './controllers/usersController';

const app: Express = express();


// Built in middleware
app.use(express.json());
app.use(morgan('combined'));
app.use(cookieParser());

// App routes
app.use('/users', usersController)

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
