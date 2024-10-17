// src/models/content.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { IContent } from "../interfaces/content.interface";

const contentSchema = new Schema<IContent>({
  "task.completed-label": { type: String, required: true },
  "taks.mark-label": { type: String, required: true },
  "task.delete-label": { type: String, required: true },
});

export const Content: Model<IContent> = mongoose.model<IContent>(
  "Content",
  contentSchema
);
