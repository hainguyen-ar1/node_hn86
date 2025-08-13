import { MessageModel } from "../models/schema/message_model.js";
import { RoomModel } from "../models/schema/room_model.js";
import { UserModel } from "../models/schema/user_model.js";
import expressAsyncHandler from "express-async-handler";
import { getSimpRes, getSimpResData } from "../const/wrap_response.js";
import { StatusRes } from "../const/ResStatus.js";

// @desc Send a message
// @route POST /api/messages/send
// @access Private
const sendMessage = expressAsyncHandler(async (req, res) => {
    try {
        const { roomId, content, messageType = 'text' } = req.body;
        const senderId = req.user._id;

        // Validate required fields
        if (!roomId || !content) {
            return res.status(400).json(getSimpRes({ 
                status: "error", 
                message: "Room ID and content are required" 
            }));
        }

        // Check if room exists and user is a participant
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json(getSimpRes({ 
                status: "error", 
                message: "Room not found" 
            }));
        }

        // Check if user is a participant in the room
        const isParticipant = room.participants.some(
            participant => participant.userId.toString() === senderId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json(getSimpRes({ 
                status: "error", 
                message: "You are not a participant in this room" 
            }));
        }

        // Create the message
        const message = await MessageModel.create({
            roomId,
            senderId,
            content,
            messageType,
            timestamp: new Date()
        });

        // Populate sender information
        await message.populate('senderId', 'fullName image');

        res.status(201).json(getSimpResData({
            status: StatusRes.SUCCESS,
            message: "Message sent successfully",
            data: message
        }));

    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json(getSimpRes({ 
            status: "error", 
            message: "Failed to send message" 
        }));
    }
});

// @desc Get messages by room
// @route GET /api/messages/room/:roomId
// @access Private
const getMessagesByRoom = expressAsyncHandler(async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user._id;
        const { limit = 50, beforeId } = req.query;

        // Kiểm tra quyền truy cập phòng
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json(getSimpRes({ 
                status: "error", 
                message: "Room not found" 
            }));
        }

        const isParticipant = room.participants.some(
            participant => participant.userId.toString() === userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json(getSimpRes({ 
                status: "error", 
                message: "You are not a participant in this room" 
            }));
        }

        // Cursor-based pagination
        let query = {
            roomId,
            isDeleted: false
        };
        if (beforeId) {
            query._id = { $lt: beforeId };
        }

        const messages = await MessageModel.find(query)
            .populate('senderId', 'fullName image')
            .sort({ _id: -1 })
            .limit(parseInt(limit) + 1);

        const hasNext = messages.length > limit;
        if (hasNext) messages.pop();

        const nextCursor = messages.length > 0 
            ? messages[messages.length - 1]._id.toString()
            : null;

        res.status(200).json(getSimpResData({
            status: StatusRes.SUCCESS,
            message: "Messages retrieved successfully",
            data: {
                messages: messages.reverse(),
                pagination: {
                    hasNext,
                    nextCursor,
                    limit: parseInt(limit)
                }
            }
        }));

    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json(getSimpRes({ 
            status: "error", 
            message: "Failed to get messages" 
        }));
    }
});

// @desc Mark messages as read
// @route PUT /api/messages/read
// @access Private
const markMessagesAsRead = expressAsyncHandler(async (req, res) => {
    try {
        const { roomId, messageIds } = req.body;
        const userId = req.user._id;

        if (!roomId || !messageIds || !Array.isArray(messageIds)) {
            return res.status(400).json(getSimpRes({ 
                status: "error", 
                message: "Room ID and message IDs array are required" 
            }));
        }

        // Check if user is a participant in the room
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json(getSimpRes({ 
                status: "error", 
                message: "Room not found" 
            }));
        }

        const isParticipant = room.participants.some(
            participant => participant.userId.toString() === userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json(getSimpRes({ 
                status: "error", 
                message: "You are not a participant in this room" 
            }));
        }

        // Mark messages as read
        const result = await MessageModel.updateMany(
            {
                _id: { $in: messageIds },
                roomId,
                senderId: { $ne: userId }, // Don't mark own messages as read
                isRead: false
            },
            {
                isRead: true
            }
        );

        res.status(200).json(getSimpResData({
            status: StatusRes.SUCCESS,
            message: "Messages marked as read",
            data: {
                updatedCount: result.modifiedCount
            }
        }));

    } catch (error) {
        console.error('Mark messages as read error:', error);
        res.status(500).json(getSimpRes({ 
            status: "error", 
            message: "Failed to mark messages as read" 
        }));
    }
});

// @desc Delete a message (soft delete)
// @route DELETE /api/messages/:messageId
// @access Private
const deleteMessage = expressAsyncHandler(async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await MessageModel.findById(messageId);
        if (!message) {
            return res.status(404).json(getSimpRes({ 
                status: "error", 
                message: "Message not found" 
            }));
        }

        // Only sender can delete their own message
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json(getSimpRes({ 
                status: "error", 
                message: "You can only delete your own messages" 
            }));
        }

        message.isDeleted = true;
        await message.save();

        res.status(200).json(getSimpResData({
            status: StatusRes.SUCCESS,
            message: "Message deleted successfully",
            data: message
        }));

    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json(getSimpRes({ 
            status: "error", 
            message: "Failed to delete message" 
        }));
    }
});

export {
    sendMessage,
    getMessagesByRoom,
    markMessagesAsRead,
    deleteMessage
}; 