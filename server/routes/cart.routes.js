import { Router } from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
} from "../controllers/cart.controller.js";
import { authCheck } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authCheck);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/", updateCart);
router.delete("/:productId", removeFromCart);

export default router;
