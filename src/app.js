import express from "express";
import cors from "cors";
import { errorHandler, notFould } from "./middlewares/errror.middleware.js";
import todoRoutes from "./routes/todo.route.js";
import userRoutes from "./routes/user.route.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import { swaggerSpec } from "./swagger.js";
import swaggerUi from "swagger-ui-express";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

app.use(limiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/todos", todoRoutes);

app.use(notFould);
app.use(errorHandler);

export default app;
