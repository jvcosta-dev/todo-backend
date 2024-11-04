import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth;
  if (!token) {
    res.sendStatus(401);
    return;
  }

  const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  if (!userId) {
    res.sendStatus(401);
    return;
  }
  req.userId = userId;
  next();
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
    sameSite: "none",
    maxAge: 3600000 * 24 * 7,
  });
};

export { authMiddleware, createToken, setTokenCookie };
