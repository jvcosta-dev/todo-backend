import { Task, User } from "../models/user.model";
import { Request, Response } from "express";
import { validateTaskInput } from "../validations/task.validation";
import { doesUserExist } from "../validations/user.validation";
import { isValidObjectId } from "mongoose";
import { IUser } from "../interfaces/user.interface";
import { sendErrorResponse } from "../helpers/http";

const hasPermission = (user: IUser, reqUserId: string, userId: string) => {
  const isOwner = reqUserId === userId;
  const hasAccess = user.workspace.members.find((m) => m.userId === reqUserId);
  return isOwner || hasAccess;
};

const createTask = async (req: Request, res: Response) => {
  const { title, description, tag, initialDate, endDate } = req.body;
  const { userId } = req.params;

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
    if (!hasPermission(user, req.userId, userId))
      return sendErrorResponse(res, 401, "Unauthorized");

    const newTask = new Task({ title, description, tag, initialDate, endDate });
    user.workspace?.tasks.push(newTask);
    await user.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error");
  }
};

const getTaskById = async (req: Request, res: Response) => {
  const { userId, taskId } = req.params;

  if (!isValidObjectId(taskId) || !isValidObjectId(userId))
    return sendErrorResponse(res, 400, "Invalid ID");

  const user = await doesUserExist(userId);
  if (!user) return sendErrorResponse(res, 404, "User not found");

  try {
    if (!hasPermission(user, req.userId, userId))
      return sendErrorResponse(res, 401, "Unauthorized");

    const task = user.workspace?.tasks.find((t) => t._id.toString() === taskId);
    if (!task) return sendErrorResponse(res, 404, "Task not found");

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

    const tasks = user.workspace?.tasks;
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error");
  }
};

const editTask = async (req: Request, res: Response) => {
  const { title, description, tag, initialDate, endDate } = req.body;
  const { userId, taskId } = req.params;

  if (!isValidObjectId(taskId) || !isValidObjectId(userId))
    return sendErrorResponse(res, 400, "Invalid ID");

  const user = await doesUserExist(userId);
  if (!user) return sendErrorResponse(res, 404, "User not found");

  try {
    if (!hasPermission(user, req.userId, userId))
      return sendErrorResponse(res, 401, "Unauthorized");

    const task = user.workspace?.tasks.find((t) => t._id.toString() === taskId);
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

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error");
  }
};
export { createTask, getTaskById, getUserTasks, editTask };
