import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

export const requireRoleMw =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as Request & { user?: { role: string } }).user;
    if (!user) return next(ApiError.unauthorized());
    if (!roles.includes(user.role)) return next(ApiError.forbidden());
    next();
  };
