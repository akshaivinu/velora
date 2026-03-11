import { Router } from "express";
import {
  loginUser,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
