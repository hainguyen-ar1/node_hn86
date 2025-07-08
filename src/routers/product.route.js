import { Router } from "express";
import * as productController from "../controllers/product_controller.js";
import { protect } from "../middleware/auth.js";
import { validateProduct } from "../middleware/validation.js";

const routerProduct = Router();

// Import data route (no validation needed)
routerProduct.post('/import/all', productController.importProduct);

// CRUD routes with validation
routerProduct.post('/insert', protect, validateProduct, productController.insertProduct);
routerProduct
    .get('', protect, productController.getProduct)
    .patch('', protect, validateProduct, productController.updateProduct)
    .delete('', protect, productController.deleteProduct);

export default routerProduct;