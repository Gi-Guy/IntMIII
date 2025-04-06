import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createComment, getCommentsByPostId, deleteComment, updateComment } from '../controllers/comment.controller';
const router = Router();
router.get('/post/:postId', getCommentsByPostId);
router.post('/', authenticate, createComment);
router.delete('/:id', authenticate, deleteComment);
router.put('/:id', authenticate, updateComment);
export default router;
