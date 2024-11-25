import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { currentUser, userEdit } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", verifyToken, currentUser);
router.put("/edit", verifyToken, userEdit);

export default router;