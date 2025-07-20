import { UserModel } from '../../models/schema/user_model.js';
import { RoomModel } from '../../models/schema/room_model.js';

class UserManager {
    constructor() {
        this.connectedUsers = new Map(); // socketId -> userData
        this.userSockets = new Map(); // userId -> socketId
    }

    // Get all online users for display
    async getOnlineUsers() {
        try {
            const onlineUsers = await UserModel.find({ isOnline: true })
                .select('fullName email image gender isOnline currentRoom')
                .lean();
            
            return onlineUsers.map(user => ({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                image: user.image,
                gender: user.gender,
                isOnline: user.isOnline,
                currentRoom: user.currentRoom
            }));
        } catch (error) {
            console.error('Error getting online users:', error);
            return [];
        }
    }

    // Get user by ID from database
    async getUserById(userId) {
        try {
            return await UserModel.findById(userId)
                .select('fullName email image gender isOnline currentRoom isWaiting')
                .lean();
        } catch (error) {
            console.error('Error getting user by ID:', error);
            return null;
        }
    }

    // Check if user is available for matching
    async isUserAvailable(userId) {
        try {
            const user = await UserModel.findById(userId);
            return user && !user.currentRoom && !user.isWaiting;
        } catch (error) {
            console.error('Error checking user availability:', error);
            return false;
        }
    }

    // Connect user to socket
    connectUser(socketId, userData) {
        this.connectedUsers.set(socketId, userData);
        this.userSockets.set(userData._id, socketId);
        
        // Update user status in database
        UserModel.findByIdAndUpdate(userData._id, {
            isOnline: true
        }).catch(error => {
            console.error('Error updating user online status:', error);
        });
    }

    // Disconnect user from socket
    async disconnectUser(socketId) {
        const userData = this.connectedUsers.get(socketId);
        if (userData) {
            this.connectedUsers.delete(socketId);
            this.userSockets.delete(userData._id);
            
            // Update user status in database
            await UserModel.findByIdAndUpdate(userData._id, {
                isOnline: false
            });
        }
    }

    // Get user by socket ID
    getUserBySocketId(socketId) {
        return this.connectedUsers.get(socketId);
    }

    // Get socket ID by user ID
    getSocketByUserId(userId) {
        return this.userSockets.get(userId);
    }

    // Get user's current room
    async getUserRoom(userId) {
        try {
            const user = await UserModel.findById(userId);
            return user?.currentRoom;
        } catch (error) {
            console.error('Error getting user room:', error);
            return null;
        }
    }

    // Get all users in a room
    async getRoomParticipants(roomId) {
        try {
            const room = await RoomModel.findById(roomId)
                .populate('participants.userId', 'fullName email image gender')
                .lean();
            
            return room?.participants || [];
        } catch (error) {
            console.error('Error getting room participants:', error);
            return [];
        }
    }

    // Check if user is in room
    async isUserInRoom(userId, roomId) {
        try {
            const room = await RoomModel.findById(roomId);
            if (!room) return false;
            
            return room.participants.some(
                participant => participant.userId.toString() === userId.toString()
            );
        } catch (error) {
            console.error('Error checking if user is in room:', error);
            return false;
        }
    }

    // Get connected users count
    getConnectedUsersCount() {
        return this.connectedUsers.size;
    }

    // Get all connected users data
    getConnectedUsers() {
        return Array.from(this.connectedUsers.values());
    }

    // Update user's current room
    async updateUserRoom(userId, roomId) {
        try {
            await UserModel.findByIdAndUpdate(userId, {
                currentRoom: roomId,
                isWaiting: false
            });
        } catch (error) {
            console.error('Error updating user room:', error);
        }
    }

    // Remove user from room
    async removeUserFromRoom(userId) {
        try {
            await UserModel.findByIdAndUpdate(userId, {
                currentRoom: null,
                isWaiting: false
            });
        } catch (error) {
            console.error('Error removing user from room:', error);
        }
    }
}

export const userManager = new UserManager();
