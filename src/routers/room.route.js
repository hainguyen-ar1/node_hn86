import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    leaveRoom,
    getRoomInfo
} from '../controllers/room_controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/room/leave
// @desc    Leave a room
// @access  Private
router.post('/leave', leaveRoom);

// @route   GET /api/room/:roomId
// @desc    Get room info
// @access  Private
router.get('/:roomId', getRoomInfo);

export default router; 