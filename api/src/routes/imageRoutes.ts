import express from 'express';
import { createImage } from '../controllers/imageController';
import { protect, restrictTo } from '../controllers/authMiddleware';

const router = express.Router();

router.post('/', protect, restrictTo('ADMIN'), createImage);

export default router;