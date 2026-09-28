import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appErrors';

export const createImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { url, key } = req.body;

    if (!url) {
      return next(new AppError('An image URL is required', 400));
    }

    const newImage = await prisma.image.create({ data: { url, key } });

    res.status(201).json({
      status: 'success',
      data: { image: newImage },
    });
  }
);