import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import AuthRouter from "./routes/auth.route.js";
import UserRouter from "./routes/user.route.js";
import PostRouter from "./routes/post.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/posts", PostRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
})