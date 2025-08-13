import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    joinQueue,
    leaveQueue,
    getQueueStatus
} from '../controllers/queue_controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /queue/join:
 *   post:
 *     summary: Tham gia hàng đợi matching
 *     description: Tham gia hàng đợi để tìm người chat phù hợp
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JoinQueueRequest'
 *     responses:
 *       200:
 *         description: Successfully joined queue or found match
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *                     message:
 *                       type: string
 *                       example: Match found!
 *                     data:
 *                       type: object
 *                       properties:
 *                         roomId:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439012
 *                         matchedUser:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 507f1f77bcf86cd799439013
 *                             fullName:
 *                               type: string
 *                               example: Nguyễn Thị B
 *                             image:
 *                               type: string
 *                               example: https://example.com/avatar.jpg
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *                     message:
 *                       type: string
 *                       example: Joined queue successfully. Waiting for match...
 *                     data:
 *                       type: object
 *                       properties:
 *                         queueId:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439011
 *                         estimatedWaitTime:
 *                           type: string
 *                           example: 1-3 minutes
 *       400:
 *         description: Already in queue or already in room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/join', joinQueue);

/**
 * @swagger
 * /queue/leave:
 *   post:
 *     summary: Rời khỏi hàng đợi matching
 *     description: Rời khỏi hàng đợi matching và cập nhật trạng thái
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully left queue
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post('/leave', leaveQueue);

/**
 * @swagger
 * /queue/status:
 *   get:
 *     summary: Lấy trạng thái hàng đợi
 *     description: Lấy thông tin về trạng thái hiện tại trong hàng đợi
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Queue status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Queue status retrieved
 *                 data:
 *                   type: object
 *                   properties:
 *                     queueId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     status:
 *                       type: string
 *                       enum: [waiting, matched, cancelled]
 *                       example: waiting
 *                     joinedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T00:00:00.000Z
 *                     waitTime:
 *                       type: number
 *                       example: 120000
 *       404:
 *         description: Not in queue
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/status', getQueueStatus);

export default router; 