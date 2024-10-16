import { ObjectId } from "mongoose";

export interface ITask extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  tag: string;
  initialDate: Date;
  endDate: Date;
  status?: 0 | 1 | 2;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITaskInput {
  title: string;
  description: string;
  tag: string;
  initialDate: string;
  endDate: string;
}
