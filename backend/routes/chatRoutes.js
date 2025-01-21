import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from "../controllers/chatController.js";

const router = express.Router()

router.post("/accessChat", isAuthenticated, accessChat)
router.get("/fetchChats", isAuthenticated, fetchChats)
router.post("/createGroup", isAuthenticated, createGroupChat)
router.put("/renameGroup", isAuthenticated, renameGroup)
router.put("addToGroup", isAuthenticated, addToGroup)
router.put("removeFromGroup", isAuthenticated, removeFromGroup)

export default router;