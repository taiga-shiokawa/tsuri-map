import express from "express";
import {
  createPost,
  deletePost,
  editPost,
  getMyPosts,
  getPost,
  getPosts,
  getSavedPosts,
  searchPost,
  searchPostsByMonth,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/search", searchPost);
router.get("/search/month/:month", searchPostsByMonth);
router.get("/myPosts", verifyToken, getMyPosts);
router.get("/:id", getPost);
router.get("/:id", verifyToken, getSavedPosts);
router.post("/create", verifyToken, createPost);
router.put("/edit/:id", verifyToken, editPost);
router.delete("/delete/:id", verifyToken, deletePost);

export default router;
