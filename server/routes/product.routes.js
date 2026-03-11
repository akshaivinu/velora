import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import { authCheck } from "../middleware/auth.middleware.js";
import { adminCheck } from "../middleware/admin.middleware.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", authCheck, adminCheck, createProduct);
router.put("/:id", authCheck, adminCheck, updateProduct);
router.delete("/:id", authCheck, adminCheck, deleteProduct);

export default router;
