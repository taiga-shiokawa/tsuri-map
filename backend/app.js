import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import prisma from "./lib/prisma.js";

import AuthRouter from "./routes/auth.route.js";
import UserRouter from "./routes/user.route.js";
import PostRouter from "./routes/post.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/posts", PostRouter);

if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "/frontend/dist"), {
      etag: false,
      maxAge: 0,
      lastModified: false,
    })
  );

  app.get("*", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
  console.log(`Server running on port ${PORT}`);
});
