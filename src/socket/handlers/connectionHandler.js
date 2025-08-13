import { userManager } from '../models/userModel.js';
import { SOCKET_EVENTS } from '../config/socketConfig.js';
import { handleJoin, handleJoinRoom, handleLeaveRoom } from './roomHandler.js';
import { handleMessage } from './messageHandler.js';

export const handleConnection = async (socket, io) => {
    console.log('User connected:', socket.id);
    
    // Get online users from database
    const onlineUsers = await userManager.getOnlineUsers();
    socket.emit(SOCKET_EVENTS.AVAILABLE_USERS, onlineUsers);
    
    // Register event handlers
    socket.on(SOCKET_EVENTS.JOIN, (userData) => handleJoin(socket, io, userData));
    socket.on('join-room', (data) => handleJoinRoom(socket, io, data));
    socket.on('leave-room', (data) => handleLeaveRoom(socket, io, data));
    socket.on(SOCKET_EVENTS.MESSAGE, (data) => handleMessage(socket, io, data));
    socket.on(SOCKET_EVENTS.DISCONNECT, () => handleDisconnect(socket, io));
};

const handleDisconnect = async (socket, io) => {
    console.log('User disconnected:', socket.id);
    await userManager.disconnectUser(socket.id);
};
