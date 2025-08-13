
import { Router } from 'express';
import * as userController from '../controllers/user_controller.js';
import { protect } from '../middleware/auth.js';
import { validateUser, validateLogin } from '../middleware/validation.js';

const routerUser = Router();

/**
 * @swagger
 * /user/import/all:
 *   post:
 *     summary: Import tất cả users từ data mẫu
 *     description: Xóa tất cả users hiện tại và import users mới từ data mẫu
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: Users imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
routerUser.post('/import/all', userController.importUsers);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Đăng nhập user
 *     description: Xác thực user bằng email và password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerUser.post('/login', validateLogin, userController.loginUser);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Đăng ký user mới
 *     description: Tạo tài khoản user mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: User already exists or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerUser.post('/register', validateUser, userController.registerUser);

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Cập nhật profile user
 *     description: Cập nhật thông tin profile của user đang đăng nhập
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerUser.put('/', protect, userController.updateProfile);

/**
 * @swagger
 * /user/delete:
 *   post:
 *     summary: Xóa user
 *     description: Xóa tài khoản user đang đăng nhập
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerUser.post('/delete', protect, userController.deleteUser);

/**
 * @swagger
 * /user/update_password:
 *   post:
 *     summary: Thay đổi password
 *     description: Thay đổi password của user đang đăng nhập
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Invalid old password or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerUser.post('/update_password', protect, userController.changePassword);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Lấy thông tin profile user
 *     description: Lấy thông tin profile của user đang đăng nhập
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routerUser.get('/profile', protect, userController.getUserProfile);

export default routerUser;

