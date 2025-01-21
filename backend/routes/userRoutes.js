import express from "express";
import { allUsers, getUser, login, logout, refreshAccessToken, register,  } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/logout", isAuthenticated, logout)
router.get("/getuser", isAuthenticated, getUser)
router.get("/", isAuthenticated, allUsers )
router.post("/refreshAccessToken", refreshAccessToken)


export default router;