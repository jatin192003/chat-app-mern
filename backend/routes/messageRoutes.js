import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { allMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router()

router.post("/sendMessage", isAuthenticated, sendMessage);
router.get("/allMessages/:chatId", isAuthenticated, allMessages)

export default router;