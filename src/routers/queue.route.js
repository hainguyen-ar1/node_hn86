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

// @route   POST /api/queue/join
// @desc    Join matching queue
// @access  Private
router.post('/join', joinQueue);

// @route   POST /api/queue/leave
// @desc    Leave matching queue
// @access  Private
router.post('/leave', leaveQueue);

// @route   GET /api/queue/status
// @desc    Get queue status
// @access  Private
router.get('/status', getQueueStatus);

export default router; 