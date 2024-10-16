import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import { IMember, IUser, IWorkspace } from "../interfaces/user.interface";
import { ITask } from "../interfaces/task.interface";

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tag: { type: String, required: true },
    initialDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
  },
  { timestamps: true }
);

const memberSchema = new mongoose.Schema<IMember>(
  {
    username: { type: String, required: true },
  },
  { timestamps: true }
);

const workspaceSchema = new mongoose.Schema<IWorkspace>({
  tasks: { type: [taskSchema], default: [] },
  members: { type: [memberSchema], default: [] },
});

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String },
    workspace: {
      type: workspaceSchema,
      default: () => ({ tasks: [], members: [] }),
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

userSchema.set("toObject", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);
