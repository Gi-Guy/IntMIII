import { Request, Response, NextFunction } from 'express';

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = (req as any).user;

  if (!user || !user.isAdmin) {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  next();
}