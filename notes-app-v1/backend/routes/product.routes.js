import express from "express";

import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import { validateObjectId } from "../middlewares/validateId.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", validateObjectId, updateProduct);
router.delete("/:id", validateObjectId, deleteProduct);

export default router;