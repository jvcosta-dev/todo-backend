import { Response } from "express";

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message?: string
) => {
  res.status(statusCode).json({ message });
};
