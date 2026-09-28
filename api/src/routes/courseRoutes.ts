import express from 'express';
import { getAllCourses, getCourse, createCourse } from '../controllers/courseController';
import { protect, restrictTo } from '../controllers/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getAllCourses)
  .post(protect, restrictTo('ADMIN'), createCourse);

router.route('/:id')
  .get(getCourse);

export default router;