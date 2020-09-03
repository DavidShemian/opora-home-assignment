import { NextFunction, Request, Response } from 'express';

export const handleError = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error('Unexpected Error caught', err);

    return res.status(500).json({ message: 'Unexpected Error' });
};
