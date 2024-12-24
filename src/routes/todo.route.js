import { Router } from "express";
import {
  createTodo,
  getAllTodos,
  getTodo,
  updateTodo,
  updateTodoStatus,
} from "../controllers/todo.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);
router.route("/").get(getAllTodos);
router.route("/").get(getTodo);
router.route("/create").post(createTodo);
router.route("/:id/update-todo-status").patch(updateTodoStatus);
router.route("/update/:id").patch(updateTodo);
router.route("/delete/:id").delete(deleteTodo);

export default router;
