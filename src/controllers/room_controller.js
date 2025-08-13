import { RoomModel } from "../models/schema/room_model.js";
import { UserModel } from "../models/schema/user_model.js";
import { QueueModel } from "../models/schema/queue_model.js";
import expressAsyncHandler from "express-async-handler";
import { getSimpRes, getSimpResData } from "../const/wrap_response.js";
import { StatusRes } from "../const/ResStatus.js";

// @desc Leave a room
// @route POST /api/room/leave
// @access Private
const leaveRoom = expressAsyncHandler(async (req, res) => {
    try {
        const { roomId } = req.body;
        const userId = req.user._id;

        if (!roomId) {
            return res.status(400).json(getSimpRes({
                status: "error",
                message: "Room ID is required"
            }));
        }

        // Check if room exists
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json(getSimpRes({
                status: "error",
                message: "Room not found"
            }));
        }

        // Check if user is a participant in the room
        const isParticipant = room.participants.some(
            participant => participant.userId.toString() === userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json(getSimpRes({
                status: "error",
                message: "You are not a participant in this room"
            }));
        }

        // Update user's current room to null and remove from queue
        await UserModel.findByIdAndUpdate(userId, {
            currentRoom: null,
            isWaiting: false
        });

        // Remove user from queue collection completely
        await QueueModel.deleteMany(
            { userId: userId }
        );

        // Update room participant status (mark as inactive but keep in room for history)
        await RoomModel.updateOne(
            { _id: roomId, 'participants.userId': userId },
            {
                $set: {
                    'participants.$.leftAt': new Date(),
                    'participants.$.isActive': false
                }
            }
        );

        // Get updated room info for socket notification
        const updatedRoom = await RoomModel.findById(roomId)
            .populate('participants.userId', 'fullName email image gender')
            .lean();

        // Get the user who left for socket notification
        const leavingUser = updatedRoom.participants.find(p => p.userId._id.toString() === userId.toString());

        // Get remaining active participants
        const activeParticipants = updatedRoom.participants.filter(p => p.isActive);

        // If no active participants left, mark room as ended but keep it for history
        if (activeParticipants.length === 0) {
            await RoomModel.findByIdAndUpdate(roomId, {
                status: 'ended',
                endedAt: new Date(),
                endedBy: userId
            });
        }

        // Return room info for socket handling
        res.status(200).json(getSimpResData({
            status: StatusRes.SUCCESS,
            message: "Successfully left the room",
            data: {
                roomId: roomId,
                leftAt: new Date(),
                leavingUser: leavingUser?.userId,
                remainingParticipants: activeParticipants,
                roomEnded: activeParticipants.length === 0
            }
        }));

    } catch (error) {
        console.error('Leave room error:', error);
        res.status(500).json(getSimpRes({
            status: "error",
            message: "Failed to leave room"
        }));
    }
});

// @desc Get room info
// @route GET /api/room/:roomId
// @access Private
const getRoomInfo = expressAsyncHandler(async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user._id;

        // Check if room exists and user is a participant
        const room = await RoomModel.findById(roomId)
            .populate('participants.userId', 'fullName email image gender')
            .lean();

        if (!room) {
            return res.status(404).json(getSimpRes({
                status: "error",
                message: "Room not found"
            }));
        }

        const isParticipant = room.participants.some(
            participant => participant.userId._id.toString() === userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json(getSimpRes({
                status: "error",
                message: "You are not a participant in this room"
            }));
        }

        res.status(200).json(getSimpResData({
            status: StatusRes.SUCCESS,
            message: "Room info retrieved successfully",
            data: room
        }));

    } catch (error) {
        console.error('Get room info error:', error);
        res.status(500).json(getSimpRes({
            status: "error",
            message: "Failed to get room info"
        }));
    }
});

export {
    leaveRoom,
    getRoomInfo
}; 