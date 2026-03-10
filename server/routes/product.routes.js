import { Router } from "express";
import { deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";
import { authCheck } from '../middleware/auth.middleware.js'


const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authCheck);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct)

export default router;