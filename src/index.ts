import e from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import {
  createUser,
  deleteUser,
  getDashboard,
  getUsers,
  loginUser,
} from "./controllers/user.controller";
import {
  chechTask,
  createTask,
  deleteTask,
  editTask,
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
    origin: ["https://jvcosta-dev-task-track.vercel.app/"],
    credentials: true,
  })
);

const router = e.Router();

//router.get("/users", authMiddleware, getUsers);
router.delete("/user", authMiddleware, deleteUser);
router.post("/register", createUser);
router.post("/login", loginUser);

router.get("/dashboard", authMiddleware, getDashboard);

router.post("/task", authMiddleware, createTask);
router.get("/mytasks", authMiddleware, getUserTasks);
router.get("/task/:taskId", authMiddleware, getTaskById);
router.patch("/task/:taskId", authMiddleware, editTask);
router.delete("/task/:taskId", authMiddleware, deleteTask);
router.patch("/check/:taskId", authMiddleware, chechTask);

app.use(router);

mongoose.connect(MONGO_URI).then((database: mongoose.Mongoose) => {
  console.log("connected in mongo:", database.connection.name);
});

app.listen(PORT, () => {
  console.log("running on:", PORT);
});

export default app;
