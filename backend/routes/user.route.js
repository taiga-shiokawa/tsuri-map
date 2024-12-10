import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { currentUser, passwordReset, sendEmail, userEdit } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", verifyToken, currentUser);

router.put("/edit", verifyToken, userEdit);
router.put("/password-reset/:token", passwordReset);
router.put("/forget-password", sendEmail);

export default router;