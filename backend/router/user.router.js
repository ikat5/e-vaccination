import { Router } from "express";
import { loginUser, logoutUser, signUp } from "../controller/user.controller.js";
import { verifyUser } from "../middleware/auth-middleware.js";
const router = Router();


router.post("/signup",signUp)
router.post("/login",loginUser)
router.post("/logout",verifyUser,logoutUser)

export default router;