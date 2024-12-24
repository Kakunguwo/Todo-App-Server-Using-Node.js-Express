import HttpError from "../models/errorModel.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    if (
      [name, email, password, confirm_password].some(
        (field) => field.trim() === ""
      )
    ) {
      return next(new HttpError("Fill all the fields", 421));
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(new HttpError("User exists", 421));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least six lettters", 421)
      );
    }

    if (password !== confirm_password) {
      return next(new HttpError("Passwords should match", 421));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return next(new HttpError("Failed to create user", 421));
    }

    return res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Error creating the user" || error.message, 500));
  }
};
