import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../app';

export const authenticate: RequestHandler = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Missing token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
