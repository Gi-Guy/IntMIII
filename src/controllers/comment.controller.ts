import { Request, Response } from 'express';
import { CommentModel } from '../models/comment.model';
import { Comment } from '../types/comment.type';
import { randomUUID } from 'crypto';

export async function createComment(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { postId, content } = req.body;

    const comment: Comment = {
      id: randomUUID(),
      postId,
      content,
      createdAt: Date.now(),
      author: {
        id: user.id,
        username: user.username
      }
    };

    await CommentModel.create(comment);
    res.status(201).json({ message: 'Comment added' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}

export async function getCommentsByPostId(req: Request, res: Response): Promise<void> {
  try {
    const { postId } = req.params;
    const comments = await CommentModel.find({ postId }).sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}

export async function deleteComment(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const comment = await CommentModel.findOne({ id });
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (!comment.author || comment.author.id !== user.id && !user.isAdmin) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    await CommentModel.deleteOne({ id });
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}

export async function updateComment(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { content } = req.body;

    const comment = await CommentModel.findOne({ id });
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (!comment.author || (comment.author.id !== user.id && !user.isAdmin)) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    comment.content = content;
    comment.createdAt = Date.now();
    await comment.save();

    res.status(200).json({ message: 'Comment updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}
