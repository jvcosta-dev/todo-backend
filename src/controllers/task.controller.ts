import { Request, Response } from "express";
import { validateTaskInput } from "../validations/task.validation";
import { doesUserExist } from "../validations/user.validation";
import { isValidObjectId } from "mongoose";
import { sendErrorResponse } from "../helpers/http";
import { ITask } from "../interfaces/task.interface";
import { isExpiredDate } from "../helpers/date";

const createTask = async (req: Request, res: Response) => {
  const { title, description, tag, initialDate, endDate } = req.body;

  const user = await doesUserExist(req.userId);
  if (!user) return sendErrorResponse(res, 404, "User not found");

  const errors = validateTaskInput({
    title,
    description,
    tag,
    initialDate,
    endDate,
  });
  if (errors.length > 0) return sendErrorResponse(res, 400, errors.join(", "));

  try {
    const newTask = { title, description, tag, initialDate, endDate };
    user.tasks.push(newTask as ITask);
    await user.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error");
  }
};

const getTaskById = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  if (!isValidObjectId(taskId))
    return sendErrorResponse(res, 400, "Invalid ID");

  const user = await doesUserExist(req.userId);
  if (!user) return sendErrorResponse(res, 404, "User not found");

  try {
    const task = user.tasks.find((t) => t._id.toString() === taskId);
    if (!task) return sendErrorResponse(res, 404, "Task not found");
    if (isExpiredDate(task.endDate.toString()) && task.status === 0) {
      task.status = 2;
      await user.save();
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error");
  }
};

const getUserTasks = async (req: Request, res: Response) => {
  try {
    const user = await doesUserExist(req.userId);
    if (!user) return sendErrorResponse(res, 404, "User not found");

    const tasks = user.tasks;
    tasks.map((t) => {
      if (isExpiredDate(t.endDate.toString()) && t.status !== 1) t.status = 2;
    });
    await user.save();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error");
  }
};

const editTask = async (req: Request, res: Response) => {
  const { title, description, tag, initialDate, endDate } = req.body;
  const { taskId } = req.params;

  if (!isValidObjectId(taskId))
    return sendErrorResponse(res, 400, "Invalid ID");

  const user = await doesUserExist(req.userId);
  if (!user) return sendErrorResponse(res, 404, "User not found");

  try {
    const task = user.tasks.find((t) => t._id.toString() === taskId);
    if (!task) return sendErrorResponse(res, 404, "Task not found");

    if (!title && !description && !tag && !initialDate && !endDate) {
      return sendErrorResponse(res, 400, "No data provided");
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (tag) task.tag = tag;
    if (initialDate) task.initialDate = initialDate;
    if (endDate) task.endDate = endDate;

    await user.save();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error");
  }
};

const chechTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  if (!taskId) {
    sendErrorResponse(res, 400, "Missing params");
    return;
  }
  try {
    const user = await doesUserExist(req.userId);
    if (!user) {
      sendErrorResponse(res, 404, "User not foumd");
      return;
    }
    const task = user.tasks.find((t) => t._id.toString() === taskId);
    if (!task) {
      sendErrorResponse(res, 404, "Task not found");
      return;
    }
    if (task.status === 1) {
      if (isExpiredDate(task.endDate.toString())) {
        task.status = 2;
      } else {
        task.status = 0;
      }
    } else {
      task.status = 1;
    }
    await user.save();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error");
  }
};
const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  if (!taskId) {
    sendErrorResponse(res, 400, "Missing params");
    return;
  }
  try {
    const user = await doesUserExist(req.userId);
    if (!user) {
      sendErrorResponse(res, 404, "User not foumd");
      return;
    }
    const task = user.tasks.find((t) => t._id.toString() === taskId);
    if (!task) {
      sendErrorResponse(res, 404, "Task not found");
      return;
    }
    user.tasks = user.tasks.filter((t) => t._id !== task._id);
    await user.save();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error");
  }
};
export {
  createTask,
  getTaskById,
  getUserTasks,
  editTask,
  chechTask,
  deleteTask,
};
