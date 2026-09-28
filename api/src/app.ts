import express, { Application } from 'express';
import courseRouter from './routes/courseRoutes';
import userRouter from './routes/userRoutes';
import globalErrorHandler from './controllers/errorController';
import AppError from './utils/appErrors';
import imageRouter from './routes/imageRoutes';

const app: Application = express();

app.use(express.json());

app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/images', imageRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;