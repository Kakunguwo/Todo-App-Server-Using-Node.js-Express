import app from "./app.js";
import { dbConnect } from "./database/dbConnect.js";

import dotenv from "dotenv";
dotenv.config();

dbConnect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
  });
});
