import { NextFunction, Request, Response } from "express";

export const handleError = (
  _err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res.status(500).end();
};
