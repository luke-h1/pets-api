import { NextFunction, Request, Response } from 'express';

const isAuth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
    // eslint-disable-next-line consistent-return, no-useless-return
    return;
  };
};
export default isAuth;
