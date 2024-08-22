//middleware to make sure only admin is allowed

import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { tryCatch } from "./error.js";

export const adminOnly = tryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("login first", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("not a vaild user", 401));

  if (user.role !== "admin") return next(new ErrorHandler("not an admin", 403));


next()

});
