import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/isAdmin.middleware';
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePostById,
  deletePost,
  toggleLockPost,
  updatePost,
  toggleLike
} from '../controllers/post.controller';

const router = Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', authenticate, createPost);
// router.delete('/:id', authenticate, isAdmin, deletePostById);
router.delete('/:id', authenticate, deletePost);
router.put('/:id/lock', authenticate, toggleLockPost);
router.put('/:id', authenticate, updatePost);
router.put('/:id/like', authenticate, toggleLike);




export default router;
