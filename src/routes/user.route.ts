import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { getAllUsers, logoutUser } from '../controllers/user.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getCurrentUser);
router.get('/', getAllUsers);
router.get('/logout', authenticate, logoutUser);
  

export default router;
