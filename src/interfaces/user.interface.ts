import { Date, Document, ObjectId } from "mongoose";
import { ITask } from "./task.interface";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  tasks: ITask[];
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
}
