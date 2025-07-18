import { userManager } from '../models/userModel.js';
import { SOCKET_EVENTS } from '../config/socketConfig.js';
import { handleJoin } from './roomHandler.js';
import { handleMessage } from './messageHandler.js';

export const handleConnection = (socket, io) => {
    console.log('User connected:', socket.id);
    
    // Gửi danh sách users có thể chọn
    socket.emit(SOCKET_EVENTS.AVAILABLE_USERS, userManager.getUsers());
    
    // Register event handlers
    socket.on(SOCKET_EVENTS.JOIN, (username) => handleJoin(socket, io, username));
    socket.on(SOCKET_EVENTS.MESSAGE, (data) => handleMessage(socket, io, data));
    socket.on(SOCKET_EVENTS.DISCONNECT, () => handleDisconnect(socket, io));
};

const handleDisconnect = (socket, io) => {
    if (socket.username) {
        userManager.disconnectUser(socket.username);
        socket.to(socket.room).emit(SOCKET_EVENTS.USER_LEFT, socket.username);
        console.log(`${socket.username} left ${socket.room}`);
    }
};
