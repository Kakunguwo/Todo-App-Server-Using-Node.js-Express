import { Router } from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateAvatar,
  updatePassword,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// protected routes
router.route("/me").get(authMiddleware, getUser);
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/update-avatar").patch(authMiddleware, updateAvatar);
router.route("/update-password").patch(authMiddleware, updatePassword);

export default router;
