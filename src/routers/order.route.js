import { Router } from "express";
import * as orderController from "../controllers/order_controller.js";
import { protect } from "../middleware/auth.js";
const routerOrder = Router();

/**
 * @swagger
 * /order/import/all:
 *   post:
 *     summary: Import tất cả orders từ data mẫu
 *     description: Xóa tất cả orders hiện tại và import orders mới từ data mẫu
 *     tags: [Orders]
 *     responses:
 *       201:
 *         description: Orders imported successfully
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
routerOrder.post('/import/all', orderController.importOrder);

/**
 * @swagger
 * /order/insert:
 *   post:
 *     summary: Tạo order mới
 *     description: Tạo order mới với thông tin sản phẩm, địa chỉ giao hàng và thanh toán
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderRequest'
 *     responses:
 *       200:
 *         description: Order created successfully
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
routerOrder.post('/insert', protect, orderController.insertOrder);

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Lấy danh sách orders của user
 *     description: Lấy danh sách tất cả orders của user đang đăng nhập
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
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
routerOrder.get('', protect, orderController.getOrder);

export default routerOrder;