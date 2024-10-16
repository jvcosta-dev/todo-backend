import e from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createUser, getUsers, loginUser } from "./controllers/user.controller";
import { createTask, getTaskById } from "./controllers/task.controller";
const MONGO_URI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || "";

const app = e();
app.use(e.json());
app.use(
  cors({
    origin: ["localhost", "*"],
    credentials: true,
  })
);

const router = e.Router();
router.get("/users", getUsers);
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/task", createTask);
router.get("/task/:userId/:taskId", getTaskById);

app.use(router);

mongoose.connect(MONGO_URI).then((database: mongoose.Mongoose) => {
  console.log("connected in mongo:", database.connection.name);
});

app.listen(PORT, () => {
  console.log("running on:", PORT);
});

export default app;
