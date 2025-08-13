import { userManager } from '../models/userModel.js';
import { SOCKET_EVENTS } from '../config/socketConfig.js';

// Handle general join (for free chat)
export const handleJoin = async (socket, io, userData) => {
    try {
        console.log('User joining general chat:', userData);
        
        // Connect user to socket
        userManager.connectUser(socket.id, userData);
        
        // Store user data in socket
        socket.userId = userData._id;
        socket.fullName = userData.fullName;
        socket.email = userData.email;
        socket.room = 'general-chat';
        
        // Join general chat room
        socket.join('general-chat');
        
        // Notify user of successful join
        socket.emit('join-success', {
            room: 'general-chat',
            message: 'Joined general chat room'
        });
        
        // Notify others in the room
        socket.to('general-chat').emit('user-joined', userData.fullName);
        
        console.log(`${userData.fullName} joined general chat`);
        
    } catch (error) {
        console.error('Error in handleJoin:', error);
        socket.emit('join-failed', 'Failed to join chat');
    }
};

// Handle joining specific room (for matched users)
export const handleJoinRoom = async (socket, io, data) => {
    try {
        const { userId, fullName, email, roomId } = data;
        
        console.log('User joining specific room:', { userId, fullName, roomId });
        
        // Verify user is in the room
        const isInRoom = await userManager.isUserInRoom(userId, roomId);
        if (!isInRoom) {
            socket.emit('join-failed', 'You are not a participant in this room');
            return;
        }
        
        // Connect user to socket
        const userData = { _id: userId, fullName, email };
        userManager.connectUser(socket.id, userData);
        
        // Store user data in socket
        socket.userId = userId;
        socket.fullName = fullName;
        socket.email = email;
        socket.roomId = roomId;
        socket.room = roomId;
        
        // Join the specific room
        socket.join(roomId);
        
        // Get room participants
        const participants = await userManager.getRoomParticipants(roomId);
        const otherParticipants = participants.filter(p => p.userId._id !== userId);
        
        // Notify user of successful join
        socket.emit('join-success', {
            roomId: roomId,
            participants: otherParticipants,
            message: 'Joined matched room successfully'
        });
        
        // Notify other participants in the room
        socket.to(roomId).emit('user-joined', fullName);
        
        console.log(`${fullName} joined room ${roomId}`);
        
    } catch (error) {
        console.error('Error in handleJoinRoom:', error);
        socket.emit('join-failed', 'Failed to join room');
    }
};

// Handle leaving room
export const handleLeaveRoom = async (socket, io, data) => {
    try {
        const { roomId, userId, fullName } = data;
        
        console.log('User leaving room:', { userId, fullName, roomId });
        
        // Leave the socket room
        socket.leave(roomId);
        
        // Notify other participants in the room
        socket.to(roomId).emit('user-left', {
            fullName: fullName,
            userId: userId,
            roomEnded: false // Will be determined by room controller
        });
        
        console.log(`${fullName} left room ${roomId}`);
        
    } catch (error) {
        console.error('Error in handleLeaveRoom:', error);
    }
};
