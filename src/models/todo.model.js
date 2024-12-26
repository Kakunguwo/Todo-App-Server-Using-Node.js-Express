import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
  },
  { timestamps: true }
);

todoSchema.index({ title: "text", description: "text" });
todoSchema.index({ status: 1 });
todoSchema.index({ priority: 1, dueDate: 1 });

export const Todo = model("Todo", todoSchema);
