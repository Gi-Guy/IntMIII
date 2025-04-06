// src/controllers/user.controller.ts

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { User } from '../types/user.type';
import { randomUUID } from 'crypto';
import { JWT_SECRET_KEY } from '../app';

export async function registerUser(req: Request, res: Response): Promise<void> {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      birthDate,
      gender
    } = req.body;

    const existing = await UserModel.findOne({ username });
    if (existing) {
      res.status(409).json({ message: 'Username already exists' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    const user: User = {
      id: randomUUID(),
      username,
      password: hashed,
      firstName,
      lastName,
      birthDate: new Date(birthDate),
      gender,
      isAdmin: false,
      registeredAt: Date.now()
    };

    await UserModel.create(user);
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET_KEY, {
      expiresIn: '1h'
    });

    res.status(200).json({ token });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await UserModel.findOne({ id: userId }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}
export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}