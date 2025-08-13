import { QueueModel } from "../models/schema/queue_model.js";
import { RoomModel } from "../models/schema/room_model.js";
import { UserModel } from "../models/schema/user_model.js";
import expressAsyncHandler from "express-async-handler";
import { getSimpRes, getSimpResData } from "../const/wrap_response.js";
import { StatusRes } from "../const/ResStatus.js";

// @desc Join matching queue
// @route POST /api/queue/join
// @access Private
const joinQueue = expressAsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { gender } = req.body;

        if (!gender) {
            return res.status(400).json(getSimpRes({ 
                status: "error", 
                message: "Gender is required" 
            }));
        }

        // Check if user is already in queue
        const existingQueue = await QueueModel.findOne({
            userId,
            status: { $in: ['waiting', 'matched'] }
        });

        if (existingQueue) {
            return res.status(400).json(getSimpRes({ 
                status: "error", 
                message: "You are already in queue" 
            }));
        }

        // Check if user is already in a room
        const user = await UserModel.findById(userId);
        if (user.currentRoom) {
            return res.status(400).json(getSimpRes({ 
                status: "error", 
                message: "You are already in a room" 
            }));
        }

        // Create queue entry
        const queueEntry = await QueueModel.create({
            userId,
            gender,
            joinedAt: new Date(),
            status: 'waiting'
        });

        // Update user status
        await UserModel.findByIdAndUpdate(userId, {
            isWaiting: true,
            isOnline: true
        });

        // Try to find a match
        const match = await findMatch(userId, gender);
        if (match) {
            // Create room and match users
            const room = await createRoomAndMatch(userId, match.userId);
            
            res.status(200).json(getSimpResData({
                status: StatusRes.SUCCESS,
                message: "Match found!",
                data: {
                    roomId: room._id,
                    matchedUser: {
                        _id: match.userId,
                        fullName: match.fullName,
                        image: match.image
                    }
                }
            }));
        } else {
            res.status(200).json(getSimpResData({
                status: StatusRes.SUCCESS,
                message: "Joined queue successfully. Waiting for match...",
                data: {
                    queueId: queueEntry._id,
                    estimatedWaitTime: "1-3 minutes"
                }
            }));
        }

    } catch (error) {
        console.error('Join queue error:', error);
        res.status(500).json(getSimpRes({ 
            status: "error", 
            message: "Failed to join queue" 
        }));
    }
});

// @desc Leave matching queue
// @route POST /api/queue/leave
// @access Private
const leaveQueue = expressAsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Remove from queue
        await QueueModel.updateMany(
            { userId, status: 'waiting' },
            { status: 'cancelled' }
        );

        // Update user status
        await UserModel.findByIdAndUpdate(userId, {
            isWaiting: false
        });

        res.status(200).json(getSimpResData({
            status: StatusRes.SUCCESS,
            message: "Left queue successfully"
        }));

    } catch (error) {
        console.error('Leave queue error:', error);
        res.status(500).json(getSimpRes({ 
            status: "error", 
            message: "Failed to leave queue" 
        }));
    }
});

// @desc Get queue status
// @route GET /api/queue/status
// @access Private
const getQueueStatus = expressAsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const queueEntry = await QueueModel.findOne({
            userId,
            status: { $in: ['waiting', 'matched'] }
        }).populate('userId', 'fullName image');

        if (!queueEntry) {
            return res.status(404).json(getSimpRes({ 
                status: "error", 
                message: "Not in queue" 
            }));
        }

        res.status(200).json(getSimpResData({
            status: StatusRes.SUCCESS,
            message: "Queue status retrieved",
            data: {
                queueId: queueEntry._id,
                status: queueEntry.status,
                joinedAt: queueEntry.joinedAt,
                waitTime: Date.now() - queueEntry.joinedAt.getTime()
            }
        }));

    } catch (error) {
        console.error('Get queue status error:', error);
        res.status(500).json(getSimpRes({ 
            status: "error", 
            message: "Failed to get queue status" 
        }));
    }
});

// Helper function to find a match
async function findMatch(userId, gender) {
    // Find opposite gender user waiting in queue
    const oppositeGender = gender === 'male' ? 'female' : 'male';
    
    const match = await QueueModel.findOne({
        userId: { $ne: userId },
        gender: oppositeGender,
        status: 'waiting'
    }).populate('userId', 'fullName image');

    if (match) {
        // Update both users' queue status to matched
        await QueueModel.updateMany(
            { userId: { $in: [userId, match.userId] }, status: 'waiting' },
            { status: 'matched' }
        );

        return {
            userId: match.userId._id,
            fullName: match.userId.fullName,
            image: match.userId.image
        };
    }

    return null;
}

// Helper function to create room and match users
async function createRoomAndMatch(userId1, userId2) {
    // Get user details
    const user1 = await UserModel.findById(userId1);
    const user2 = await UserModel.findById(userId2);

    // Create room
    const room = await RoomModel.create({
        participants: [
            {
                userId: userId1,
                joinedAt: new Date(),
                isActive: true
            },
            {
                userId: userId2,
                joinedAt: new Date(),
                isActive: true
            }
        ],
        status: 'active',
        matchingDuration: 0, // Will be calculated
        chatDuration: 0
    });

    // Update users' current room
    await UserModel.updateMany(
        { _id: { $in: [userId1, userId2] } },
        { 
            currentRoom: room._id,
            isWaiting: false,
            isOnline: true
        }
    );

    return room;
}

export {
    joinQueue,
    leaveQueue,
    getQueueStatus
}; 