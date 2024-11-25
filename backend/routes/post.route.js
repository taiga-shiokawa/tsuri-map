import express from "express";
import {
  createPost,
  deletePost,
  editPost,
  getPost,
  getPosts,
  getSavedPosts,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/:id", verifyToken, getSavedPosts);
router.post("/create", verifyToken, createPost);
router.put("/edit/:id", verifyToken, editPost);
router.delete("/delete/:id", verifyToken, deletePost);

export default router;
