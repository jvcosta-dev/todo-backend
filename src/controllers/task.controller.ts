import { Task, User } from "../models/user.model";
import { Request, Response } from "express";
import { validateTaskInput } from "../validations/task.validation";
import { doesUserExist } from "../validations/user.validation";
import { isValidObjectId } from "mongoose";

const createTask = async (req: Request, res: Response) => {
  const { title, description, tag, initialDate, endDate } = req.body;

  const user = await doesUserExist(req.userId);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  const errors = validateTaskInput({
    title,
    description,
    tag,
    initialDate,
    endDate,
  });

  if (errors.length > 0) {
    res.status(400).json({ messages: errors });
    return;
  }

  try {
    const newTask = new Task({
      title,
      description,
      tag,
      initialDate,
      endDate,
    });

    user.workspace?.tasks.push(newTask);
    await user.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

const getTaskById = async (req: Request, res: Response) => {
  const { userId, taskId } = req.params;

  const user = await doesUserExist(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  if (!isValidObjectId(taskId)) {
    res.sendStatus(400);
    return;
  }

  try {
    const isOwner = req.userId === userId;
    const hasAccess = user.workspace.members.find(
      (m) => m.userId === req.userId
    );
    console.log(hasAccess);
    if (!hasAccess && !isOwner) {
      res.sendStatus(401);
      return;
    }
    const task = user.workspace?.tasks.find((t) => t._id.toString() === taskId);
    if (!task) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

const getUserTasks = async (req: Request, res: Response) => {
  try {
    const user = await doesUserExist(req.userId);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    const tasks = user.workspace.tasks;
    res.status(200).json(tasks);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};
export { createTask, getTaskById, getUserTasks };
