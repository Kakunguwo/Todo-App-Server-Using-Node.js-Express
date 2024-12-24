import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import HttpError from "../models/errorModel.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies["todo-token"];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Error authenticating user", 500));
  }
};
