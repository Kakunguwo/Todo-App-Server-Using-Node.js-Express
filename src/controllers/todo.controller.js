import { Todo } from "../models/todo.model.js";
import HttpError from "../models/errorModel.js";

export const getAllTodos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "priority";
    let status = req.query.status || "All";

    const statusOptions = ["pending", "cancelled", "completed"];

    status === "All"
      ? (status = [...statusOptions])
      : (status = req.query.status.split(","));

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};

    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }
    const todos = await Todo.find({
      user: req.user.id,
      title: { $regex: search, $options: "i" },
      description: { $regex: search, $options: "i" },
    })
      .where("status")
      .in([...status])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);
    if (!todos || todos.length === 0) {
      return next(new HttpError("Todos not found", 404));
    }

    const total = await Todo.countDocuments({
      user: req.user.id,
      status: { $in: [...status] },
      title: { $regex: search, $options: "i" },
      description: { $regex: search, $options: "i" },
    });

    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      statuses: statusOptions,
      todos,
    };
    return res.status(200).json({ message: "Todos found", data: response });
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

export const createTodo = async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;
    if ([title, description].some((field) => field.trim() === "")) {
      return next(new HttpError("Fill all the fields", 421));
    }
    if (dueDate && new Date(dueDate) < new Date()) {
      return next(new HttpError("Due date cannot be in the past", 421));
    }
    const todo = await Todo.create({
      title,
      description,
      user: req.user.id,
      dueDate,
    });
    if (!todo) {
      return next(new HttpError("Todo not created", 500));
    }
    return res.status(201).json({ message: "Todo created", data: todo });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        error.message || "Something went wrong, while creating todo",
        500
      )
    );
  }
};

export const getTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return next(new HttpError("Todo not found", 404));
    }
    if (todo.user.toString() !== req.user.id) {
      return next(
        new HttpError("You are not authorized to access this todo", 403)
      );
    }
    return res.status(200).json({ message: "Todo found", data: todo });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        error.message || "Something went wrong, while getting todo",
        500
      )
    );
  }
};

export const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority } = req.body;
    if (
      [title, description, priority, dueDate].some(
        (field) => field.trim() === ""
      )
    ) {
      return next(new HttpError("Fill all the fields", 421));
    }

    if (dueDate && new Date(dueDate) < new Date()) {
      return next(new HttpError("Due date cannot be in the past", 421));
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return next(new HttpError("Todo not found", 404));
    }
    if (todo.user.toString() !== req.user.id) {
      return next(new HttpError("Unauthorized", 401));
    }
    const updatedTodo = await Todo.findByIdAndUpdate(
      todo?._id,
      { title, description, dueDate, priority },
      { new: true }
    );
    if (!updatedTodo) {
      return next(new HttpError("Todo not updated", 500));
    }
    return res.status(200).json({ message: "Todo updated successfully" });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        error.message || "Something went wrong, while updating todo",
        500
      )
    );
  }
};

export const updateTodoStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    const { status } = req.body;
    if (!todo) {
      return next(new HttpError("Todo not found", 404));
    }
    if (todo.user.toString() !== req.user.id) {
      return next(new HttpError("Unauthorized", 401));
    }
    const updatedTodo = await Todo.findByIdAndUpdate(
      todo?._id,
      { status },
      { new: true }
    );
    if (!updatedTodo) {
      return next(new HttpError("Todo not updated", 500));
    }
    return res.status(200).json({ message: "Todo updated successfully" });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        error.message || "Something went wrong, while updating todo status",
        500
      )
    );
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);
    if (!todo) {
      return next(new HttpError("Todo not found", 404));
    }
    if (todo.user.toString() !== req.user.id) {
      return next(new HttpError("Unauthorized", 401));
    }
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return next(new HttpError("Todo not deleted", 500));
    }
    return res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        error.message || "Something went wrong, while deleting todo",
        500
      )
    );
  }
};
