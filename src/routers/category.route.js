
import { Router } from 'express';
import * as categoryController from '../controllers/category_controller.js';
import { protect } from '../middleware/auth.js';
const routerCategory = Router();

/**
 * @swagger
 * /category/import/all:
 *   post:
 *     summary: Import tất cả categories từ data mẫu
 *     description: Xóa tất cả categories hiện tại và import categories mới từ data mẫu
 *     tags: [Categories]
 *     responses:
 *       201:
 *         description: Categories imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
routerCategory.post('/import/all', categoryController.importCategory);

/**
 * @swagger
 * /category/insert:
 *   post:
 *     summary: Thêm category mới
 *     description: Tạo category mới với tên và hình ảnh
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryRequest'
 *     responses:
 *       200:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerCategory.post('/insert', protect, categoryController.insertCategory);

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Lấy danh sách tất cả categories
 *     description: Lấy danh sách tất cả categories trong hệ thống
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerCategory.get('', protect, categoryController.getCategory);

/**
 * @swagger
 * /category/update:
 *   post:
 *     summary: Cập nhật category
 *     description: Cập nhật thông tin category theo ID
 *     tags: [Categories]
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
 *                 description: ID của category cần cập nhật
 *                 example: 507f1f77bcf86cd799439011
 *               name:
 *                 type: string
 *                 description: Tên mới của category
 *                 example: Điện thoại thông minh
 *               image:
 *                 type: string
 *                 description: URL hình ảnh mới
 *                 example: https://example.com/new-image.jpg
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Category not found
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
routerCategory.post('/update', protect, categoryController.updateCategory);

export default routerCategory;