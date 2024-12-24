import HttpError from "../models/errorModel.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if ([email, password].some((field) => field.trim() === "")) {
      return next(new HttpError("Fill all the fields", 421));
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return next(new HttpError("Invalid Password", 401));
    }

    const { email: userEmail, _id: id } = user;

    const token = jwt.sign({ email: userEmail, id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const optins = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("todo-token", token, optins)
      .json({ message: "Login successful", data: user });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Error logging in", 500));
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie("todo-token")
      .json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Error logging out", 500));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    return res.status(200).json({ message: "User found", data: user });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Error getting user", 500));
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return next(new HttpError("Invalid Password", 401));
    }
    if (newPassword.trim().length < 6) {
      return next(
        new HttpError("Password must be at least 6 characters long", 400)
      );
    }
    if (newPassword !== confirmPassword) {
      return next(new HttpError("Passwords do not match", 400));
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return next(new HttpError(error.message, 400));
    } else {
      return next(new HttpError("Error updating password", 500));
    }
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { avatarUrl } = req.body;
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    user.avatarUrl = avatarUrl;
    const updatedUser = await user.save();
    if (!updatedUser) {
      return next(new HttpError("Error updating avatar", 500));
    }
    return res.status(200).json({ message: "Avatar updated successfully" });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Error updating avatar", 500));
  }
};
