import HttpError from "../models/errorModel.js";

export const getAllTodos = async (req, res, next) => {
  try {
    res.json({
      title: "Get all todos",
      message: "Get all todos",
      description: "Get all todos",
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        error.message || "Something went wrong, while getting todos",
        500
      )
    );
  }
};
