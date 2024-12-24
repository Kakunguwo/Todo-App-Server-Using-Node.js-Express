import express from "express";
import cors from "cors";
import { errorHandler, notFould } from "./middlewares/errror.middleware.js";
import todoRoutes from "./routes/todo.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/todos", todoRoutes);

app.use(notFould);
app.use(errorHandler);

export default app;
