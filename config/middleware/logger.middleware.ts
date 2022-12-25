import { Request, Response, NextFunction } from 'express';

export function LOGGER(req: Request, res: Response, next: NextFunction) {
  console.log('LOGGER');
  next();
}
