import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "internal server error";
  err.statusCode ||= 500;
if(err.name ==="castError") err.message="Invalid Id"

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
export const tryCatch =(func :ControllerType)=>(req: Request,
    res: Response,
    next: NextFunction)=>{
        return Promise.resolve(func(req,res,next).catch(next))

}