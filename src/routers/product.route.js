import { Router } from "express";
import * as productController from "../controllers/product_controller.js";
import { protect } from "../middleware/auth.js";
import { validateProduct } from "../middleware/validation.js";

const routerProduct = Router();

/**
 * @swagger
 * /product/import/all:
 *   post:
 *     summary: Import tất cả products từ data mẫu
 *     description: Xóa tất cả products hiện tại và import products mới từ data mẫu
 *     tags: [Products]
 *     responses:
 *       201:
 *         description: Products imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerProduct.post('/import/all', productController.importProduct);

/**
 * @swagger
 * /product/insert:
 *   post:
 *     summary: Thêm product mới
 *     description: Tạo product mới với đầy đủ thông tin
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerProduct.post('/insert', protect, validateProduct, productController.insertProduct);

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Lấy danh sách tất cả products
 *     description: Lấy danh sách tất cả products trong hệ thống
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerProduct.get('', protect, productController.getProduct);

/**
 * @swagger
 * /product:
 *   patch:
 *     summary: Cập nhật product
 *     description: Cập nhật thông tin product theo ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['id']
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID của product cần cập nhật
 *                 example: 507f1f77bcf86cd799439011
 *               title:
 *                 type: string
 *                 description: Tiêu đề mới của product
 *                 example: iPhone 15 Pro Max
 *               name:
 *                 type: string
 *                 description: Tên mới của product
 *                 example: iPhone 15 Pro Max 256GB
 *               image:
 *                 type: string
 *                 description: URL hình ảnh mới
 *                 example: https://example.com/new-iphone.jpg
 *               brand:
 *                 type: string
 *                 description: Thương hiệu mới
 *                 example: Apple
 *               category:
 *                 type: string
 *                 description: Danh mục mới
 *                 example: Điện thoại
 *               description:
 *                 type: string
 *                 description: Mô tả mới
 *                 example: iPhone 15 Pro Max với chip A17 Pro mạnh mẽ
 *               price:
 *                 type: number
 *                 description: Giá mới
 *                 example: 34990000
 *               stocck:
 *                 type: number
 *                 description: Số lượng tồn kho mới
 *                 example: 30
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerProduct.patch('', protect, validateProduct, productController.updateProduct);

/**
 * @swagger
 * /product:
 *   delete:
 *     summary: Xóa product
 *     description: Xóa product theo ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['id']
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID của product cần xóa
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerProduct.delete('', protect, productController.deleteProduct);

export default routerProduct;