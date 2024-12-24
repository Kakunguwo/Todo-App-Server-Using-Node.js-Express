import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "the name is required"],
    },
    email: {
      type: String,
      required: [true, "the email is required"],
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default:
        "https://static-00.iconduck.com/assets.00/profile-default-icon-1024x1023-4u5mrj2v.png",
    },
    todos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Todo",
      },
    ],
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
