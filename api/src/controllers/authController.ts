import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appErrors';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  } as jwt.SignOptions);
};

const signrenewToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  } as jwt.SignOptions);
}

const sendAuthResponse = (userId: string, statusCode: number, res: Response, userData: object) => {
  const accessToken = signToken(userId);
  const refreshToken = signrenewToken(userId);

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    refreshToken,
    data: { user: userData },
  });
};

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, userName, email, phone, password } = req.body;

    if (!userName || !password) {
      return next(new AppError('Username and password are required', 400));
    }

    const existingUser = await prisma.user.findUnique({ where: { userName } });
    if (existingUser) {
      return next(new AppError('That username is already taken', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { userName, name, email, phone, password: hashedPassword, role: 'USER' },
    });

    sendAuthResponse(newUser.userId, 201, res, {
      userId: newUser.userId, userName: newUser.userName, name: newUser.userName,
      phone: newUser.phone, role: newUser.role,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return next(new AppError('Username and password are required', 400));
    }

    const user = await prisma.user.findUnique({ where: { userName } });
    if (!user) {
      return next(new AppError('Incorrect username or password', 401));
    }

    const correct = await bcrypt.compare(password, user.password);
    if (!correct) {
      return next(new AppError('Incorrect username or password', 401));
    }

    sendAuthResponse(user.userId, 200, res, {
      userId: user.userId, userName: user.userName, name: user.userName,
      phone: user.phone, role: user.role,
    });
  }
);

// POST /api/v1/users/renewtoken
export const refreshAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token is required', 400));
    }

    let decoded: { id: string };
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string };
    } catch (err) {
      return next(new AppError('Invalid or expired refresh token. Please log in again.', 401));
    }

    const user = await prisma.user.findUnique({ where: { userId: decoded.id } });
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    const newAccessToken = signToken(decoded.id);

    res.status(200).json({
      status: 'success',
      accessToken: newAccessToken,
    });
  }
);