import { NextFunction, Request, Response } from "express";
type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const catchErrors =
  (controller: AsyncController): AsyncController =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      // Pass the error to the next middleware (error handler)
      next(error);
    }
  };

export default catchErrors;
