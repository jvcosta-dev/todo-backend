import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth;
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, userId: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.userId = userId;
    next();
  });
};

const createToken = (userId: string) => {
  const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  return token;
};

const setTokenCookie = (res: Response, token: string) => {
  res.cookie("auth", token, {
    httpOnly: true,
    secure: process.env.ENV === "production",
    maxAge: 3600000 * 24 * 7,
  });
};

export { authMiddleware, createToken, setTokenCookie };
