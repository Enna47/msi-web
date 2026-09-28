import express from 'express';
import { register, login } from '../controllers/authController';
import { getAllUsers, getUser, updateUser, deleteUser } from '../controllers/userController';
import { protect, restrictTo } from '../controllers/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', protect, (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

router.route('/')
  .get(protect, restrictTo('ADMIN'), getAllUsers);

router.route('/:id')
  .get(protect, restrictTo('ADMIN'), getUser)
  .patch(protect, updateUser)
  .delete(protect, restrictTo('ADMIN'), deleteUser);

export default router;