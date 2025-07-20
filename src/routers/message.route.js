import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    sendMessage,
    getMessagesByRoom,
    markMessagesAsRead,
    deleteMessage
} from '../controllers/message_controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/messages/send
// @desc    Send a message
// @access  Private
router.post('/send', sendMessage);

// @route   GET /api/messages/room/:roomId
// @desc    Get messages by room with pagination
// @access  Private
router.get('/room/:roomId', getMessagesByRoom);

// @route   PUT /api/messages/read
// @desc    Mark messages as read
// @access  Private
router.put('/read', markMessagesAsRead);

// @route   DELETE /api/messages/:messageId
// @desc    Delete a message (soft delete)
// @access  Private
router.delete('/:messageId', deleteMessage);

export default router; 