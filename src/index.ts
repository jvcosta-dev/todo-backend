import e from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import {
  createUser,
  getUsers,
  joinWorkspace,
  leaveWorkspace,
  loginUser,
} from "./controllers/user.controller";
import {
  createTask,
  getTaskById,
  getUserTasks,
} from "./controllers/task.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
const MONGO_URI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || "";

const app = e();
app.use(e.json());
app.use(cookieparser());
app.use(
  cors({
    origin: ["localhost", "*"],
    credentials: true,
  })
);

const router = e.Router();

router.get("/users", authMiddleware, getUsers);
router.post("/register", createUser);
router.post("/login", loginUser);

router.post("/task", authMiddleware, createTask);
router.get("/task/:userId/:taskId", authMiddleware, getTaskById);
router.get("/task/mytasks", authMiddleware, getUserTasks);

router.put("/workspace/join/:userId", authMiddleware, joinWorkspace);
router.patch("/workspace/leave/:userId", authMiddleware, leaveWorkspace);

app.use(router);

mongoose.connect(MONGO_URI).then((database: mongoose.Mongoose) => {
  console.log("connected in mongo:", database.connection.name);
});

app.listen(PORT, () => {
  console.log("running on:", PORT);
});

export default app;
