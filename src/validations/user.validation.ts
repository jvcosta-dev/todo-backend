import { isValidObjectId } from "mongoose";
import { IUser, IUserInput } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { isValidEmail, isValidString } from "./helpers.validation";

const doesEmailExist = async (email: string): Promise<boolean> => {
  const user = await User.findOne({ email });
  return user !== null;
};

export const doesUserExist = async (userId: string): Promise<IUser | null> => {
  if (!isValidObjectId(userId)) {
    return null;
  }
  const user = await User.findById(userId);
  if (!user) return null;
  return user;
};

export const validateUserInput = async (userData: IUserInput) => {
  const errors: string[] = [];

  if (!isValidString(userData.name, 3)) {
    errors.push("Name must be at least 3 characters long.");
  }

  if (!isValidEmail(userData.email)) {
    errors.push("Invalid email format.");
  }

  if (!isValidString(userData.password, 8)) {
    errors.push("Password must be at least 8 characters long.");
  }

  return errors;
};
