import { User } from "../models/user.model";
import { Request, Response } from "express";
import { validateUserInput } from "../validations/user.validation";
import { createToken, setTokenCookie } from "../middlewares/auth.middleware";
import { isValidObjectId } from "mongoose";

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
    const newUser = new User({ name, email, password });
    await newUser.save();
    const token = createToken(newUser._id.toString());
    setTokenCookie(res, token);
    res.status(201).json(newUser);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.sendStatus(400);
    return;
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.sendStatus(404);
    return;
  }
  try {
    const match = await user.comparePassword(password);
    if (!match) {
      res.sendStatus(401);
      return;
    }
    const token = createToken(user._id.toString());
    setTokenCookie(res, token);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

export { getUsers, createUser, loginUser };
