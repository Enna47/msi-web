import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appErrors';

export const getAllCourses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const courses = await prisma.course.findMany({
      include: { image: true },
    });

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: { courses },
    });
  }
);

export const getCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id as string;

    const course = await prisma.course.findUnique({
      where: { courseId },
      include: { image: true, outlines: true, prerequisites: true, batches: true },
    });

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { course },
    });
  }
);

export const createCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, level, duration, depositFees, fees, imageId } = req.body;

    if (!title || !level || !imageId) {
      return next(new AppError('Title, level, and imageId are required', 400));
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        level,
        duration,
        depositFees,
        fees,
        imageId,
        createdBy: req.user!.userId,
      },
    });

    res.status(201).json({
      status: 'success',
      data: { course: newCourse },
    });
  }
);