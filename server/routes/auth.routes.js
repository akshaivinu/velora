import { Router } from "express";
import {
  loginUser,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/auth.controller.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authRateLimiter, registerUser);
router.post("/login", authRateLimiter, loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
