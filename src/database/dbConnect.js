import mongoose from "mongoose";
import { dbName } from "../utils/constants.js";
import dotenv from "dotenv";
dotenv.config();

export const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${dbName}`
    );
    console.log("Database connected");
    console.log(connectionInstance.connection.db.databaseName);

    return connectionInstance;
  } catch (error) {
    console.log(error);
  }
};
