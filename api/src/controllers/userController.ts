import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appErrors';

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || '';

    const users = await prisma.user.findMany({
      where: search
        ? { userName: { contains: search, mode: 'insensitive' } }
        : undefined,
      select: { userId: true, userName: true, role: true, phone: true, createdAt: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count({
      where: search
        ? { userName: { contains: search, mode: 'insensitive' } }
        : undefined,
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: { users },
    });
  }
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;

    const user = await prisma.user.findUnique({
      where: { userId },
      select: { userId: true, userName: true, role: true, phone: true, createdAt: true },
    });

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({ status: 'success', data: { user } });
  }
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;

    if (req.user!.userId !== userId && req.user!.role !== 'ADMIN') {
      return next(new AppError('You can only update your own account', 403));
    }

    const { phone } = req.body;

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { phone },
      select: { userId: true, userName: true, role: true, phone: true, updatedAt: true },
    });

    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  }
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;

    await prisma.user.delete({ where: { userId } });

    res.status(204).json({ status: 'success', data: null });
  }
);