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

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user details
 *     description: Fetch the details of the currently logged-in user.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully fetched user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User ID
 *                 name:
 *                   type: string
 *                   description: User name
 *                 email:
 *                   type: string
 *                   description: User email
 *       401:
 *         description: Unauthorized
 */
router.route("/me").get(authMiddleware, getUser);

router.route("/logout").post(authMiddleware, logoutUser);
router.route("/update-avatar").patch(authMiddleware, updateAvatar);
router.route("/update-password").patch(authMiddleware, updatePassword);

export default router;
