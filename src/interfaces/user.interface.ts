import { Date, Document, ObjectId } from "mongoose";
import { ITask } from "./task.interface";

export interface IMember extends Document {
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWorkspace extends Document {
  tasks: ITask[];
  members: IMember[];
}

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  workspace?: IWorkspace;
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
