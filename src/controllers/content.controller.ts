import { Request, Response } from "express";
import { Content } from "../models/content.model";
import { sendErrorResponse } from "../helpers/http";

const getContent = async (req: Request, res: Response) => {
  try {
    const content = await Content.findOne();
    if (!content) {
      sendErrorResponse(res, 404, "Content not found");
    }
    res.json(content);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error");
  }
};

export { getContent };
