import { Todo } from "../models/todo.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { dbConnect } from "../database/dbConnect.js";

dotenv.config();

const seedTodos = async () => {
  try {
    await dbConnect();

    // Find the user

    const userId = "67694f55462d7a8f2e9c358c"; // Replace with the actual user ID
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return;
    }

    // Prepare the todo documents
    const todos = [
      {
        user: user._id,
        title: "Finish project proposal",
        description: "Complete the final draft for the project proposal.",
        status: "pending",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        priority: "high",
      },
      {
        user: user._id,
        title: "Team meeting",
        description: "Organize a meeting with the project team.",
        status: "completed",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        priority: "medium",
      },
      {
        user: user._id,
        title: "Grocery shopping",
        description: "Buy groceries for the week.",
        status: "cancelled",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        priority: "low",
      },
      {
        user: user._id,
        title: "Update resume",
        description: "Add recent projects to the resume.",
        status: "pending",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        priority: "medium",
      },
      {
        user: user._id,
        title: "Prepare presentation",
        description: "Create slides for the upcoming client meeting.",
        status: "pending",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        priority: "high",
      },
    ];

    // Insert the todos into the database
    await Todo.insertMany(todos);
    console.log("Todos seeded successfully");

    // Disconnect from the database
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

//Now lets Run the function
seedTodos();
