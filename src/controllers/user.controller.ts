import { User } from "../models/user.model";
import { Request, Response } from "express";
import {
  doesUserExist,
  validateUserInput,
} from "../validations/user.validation";
import { createToken, setTokenCookie } from "../middlewares/auth.middleware";
import { isValidObjectId } from "mongoose";
import { sendErrorResponse } from "../helpers/http";

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  const errors = await validateUserInput({ name, email, password });
  if (errors.length > 0) {
    res.status(400).json({ messages: errors });
    return;
  }

  try {
    const user = await User.find({ email });
    if (user) {
      sendErrorResponse(res, 404, "Email already in use");
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    const token = createToken(newUser._id.toString());
    setTokenCookie(res, token);
    res.status(200).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    sendErrorResponse(res, 400, "Inputs are required");
    return;
  }
  const user = await User.findOne({ email });
  if (!user) {
    sendErrorResponse(res, 404, "Email not registred");
    return;
  }
  try {
    const match = await user.comparePassword(password);
    if (!match) {
      sendErrorResponse(res, 401, "Invalid email or password");
      return;
    }
    const token = createToken(user._id.toString());
    setTokenCookie(res, token);
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    sendErrorResponse(res, 500, "Internal server error");
    console.error(error);
  }
};

const getDashboard = async (req: Request, res: Response) => {
  const { init, end } = req.query;
  if (!init || !end) {
    return sendErrorResponse(res, 400, "No init or end params");
  }
  const user = await doesUserExist(req.userId);
  if (!user) {
    return sendErrorResponse(res, 404, "User not found");
  }

  try {
    const initDate = new Date(init as string);
    const endDate = new Date(end as string);

    if (isNaN(initDate.getTime()) || isNaN(endDate.getTime())) {
      return sendErrorResponse(
        res,
        400,
        "Invalid date format for init or end params"
      );
    }
    const completedTasks = user.tasks.filter((t) => {
      return (
        t.status === 1 && t.initialDate >= initDate && t.endDate <= endDate
      );
    });
    const pendingTasks = user.tasks.filter((t) => {
      return (
        t.status === 2 && t.initialDate >= initDate && t.endDate <= endDate
      );
    }).length;
    const activeTasks = user.tasks.filter((t) => {
      return (
        t.status === 0 && t.initialDate >= initDate && t.endDate <= endDate
      );
    }).length;

    const tasksByDay = completedTasks.reduce((acc, task) => {
      const day = task.updatedAt.toISOString().split("T")[0];
      if (!acc[day]) {
        acc[day] = { count: 0, tasks: [] };
      }
      acc[day].count += 1;
      acc[day].tasks.push(task);
      return acc;
    }, {} as Record<string, { count: number; tasks: any[] }>);

    const tasksPerDayArray = Object.entries(tasksByDay).map(
      ([date, { count, tasks }]) => ({
        date,
        count,
        tasks,
      })
    );

    const nextPendingTask = user.tasks.find((t) => t.status === 2);
    const nextTask = user.tasks.find((t) => t.status === 0);
    const recentCompletedTask = user.tasks.find((t) => t.status === 1);
    res.status(200).json({
      completedTasks: completedTasks.length,
      pendingTasks,
      activeTasks,
      nextPendingTask,
      nextTask,
      recentCompletedTask,
      tasksPerDayArray,
    });
  } catch (error) {
    sendErrorResponse(res, 500, "Internal server error");
    console.error(error);
  }
};

export { getUsers, createUser, loginUser, getDashboard };
