import { Request, Response } from 'express';
import { PostModel } from '../models/post.model';
import { Post } from '../types/post.type';
import { randomUUID } from 'crypto';

export async function createPost(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { title, content } = req.body;

    const post: Post = {
      id: randomUUID(),
      title,
      content,
      createdAt: Date.now(),
      author: {
        id: user.id,
        username: user.username
      }
    };

    await PostModel.create(post);
    res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}

export async function getAllPosts(req: Request, res: Response): Promise<void> {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}

export async function getPostById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const post = await PostModel.findOne({ id });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}

export async function deletePostById(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const post = await PostModel.findOne({ id });

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (!post.author || post.author.id !== user.id && !user.isAdmin) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    await PostModel.deleteOne({ id });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}
