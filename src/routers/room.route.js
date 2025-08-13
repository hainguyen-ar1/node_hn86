import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    leaveRoom,
    getRoomInfo
} from '../controllers/room_controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /room/leave:
 *   post:
 *     summary: Rời khỏi phòng chat
 *     description: Rời khỏi phòng chat hiện tại và cập nhật trạng thái
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeaveRoomRequest'
 *     responses:
 *       200:
 *         description: Successfully left the room
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
 *                   example: Successfully left the room
 *                 data:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     leftAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T00:00:00.000Z
 *                     leavingUser:
 *                       $ref: '#/components/schemas/User'
 *                     remainingParticipants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     roomEnded:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Missing room ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: User not a participant in room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/leave', leaveRoom);

/**
 * @swagger
 * /room/{roomId}:
 *   get:
 *     summary: Lấy thông tin phòng chat
 *     description: Lấy thông tin chi tiết về phòng chat và người tham gia
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phòng chat
 *     responses:
 *       200:
 *         description: Room info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: User not a participant in room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:roomId', getRoomInfo);

export default router; 