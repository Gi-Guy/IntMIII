import { Request, Response } from 'express';
import { PostModel } from '../models/post.model';
import { CommentModel } from '../models/comment.model';
import { deleteCommentsByPostId } from './comment.controller';
import { UserModel } from '../models/user.model';
import { Post } from '../types/post.type';
import { randomUUID } from 'crypto';

export async function createPost(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
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
        username: user.username,
      },
      isLocked: false,
    };

    await PostModel.create(post);
    res.status(201).json({ message: 'Post created successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}


export async function getAllPosts(_: Request, res: Response): Promise<void> {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).lean();

    const enriched = await Promise.all(posts.map(async post => {
      const count = await CommentModel.countDocuments({ postId: post.id });
      return { ...post, commentCount: count };
    }));

    res.json(enriched);
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
export async function deletePost(req: Request, res: Response): Promise<void> {
  try {
    const post = await PostModel.findOne({ id: req.params.id });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const user = (req as any).user;
    if (!post.author || post.author.id !== user.id && !user.isAdmin) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    //await CommentModel.deleteMany({ postId: post.id });
    await deleteCommentsByPostId(post.id);
    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}
export async function toggleLockPost(req: Request, res: Response): Promise<void> {
  try {
    const post = await PostModel.findOne({ id: req.params.id });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const user = (req as any).user;
    if (!post.author || post.author.id !== user.id && !user.isAdmin) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    post.isLocked = req.body.isLocked;
    await post.save();

    res.status(200).json({ message: 'Lock state updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}
export async function updatePost(req: Request, res: Response): Promise<void> {
  try {
    const post = await PostModel.findOne({ id: req.params.id });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const user = (req as any).user;
    if (!post.author || post.author.id !== user.id && !user.isAdmin) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();

    res.status(200).json({ message: 'Post updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}
// export async function toggleLike(req: Request, res: Response):Promise<void> {
//   const { id } = req.params;
//   const userId = (req as any).user.id;

//   try {
//     const post = await PostModel.findOne({ id });
//     if (!post) {
//       res.status(404).json({ message: 'Post not found' });
//       return;
//     }

//     const index = post.likes.indexOf(userId);
//     if (index >= 0) {
//       post.likes.splice(index, 1); // unlike
//     } else {
//       post.likes.push(userId); // like
//     }

//     await post.save();
//     res.json({ message: 'Like toggled', likes: post.likes });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });
//   }
// }
export async function toggleLike(req: Request, res: Response): Promise<void> {
  try {
    const post = await PostModel.findOne({ id: req.params.id });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const userId = (req as any).user.id;
    const index = post.likes.indexOf(userId);
    if (index >= 0) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: 'Like toggled', likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}


