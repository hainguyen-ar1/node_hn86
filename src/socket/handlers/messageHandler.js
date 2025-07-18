import { userManager } from '../models/userModel.js';
import { SOCKET_EVENTS } from '../config/socketConfig.js';

export const handleMessage = (socket, io, data) => {
    if (socket.username && socket.room) {
        const messageData = {
            username: socket.username,
            message: data,
            color: userManager.getUserColor(socket.username),
            room: socket.room,
            timestamp: new Date().toISOString()
        };
        
        // Gửi tin nhắn chỉ cho users trong cùng room
        io.to(socket.room).emit(SOCKET_EVENTS.MESSAGE, messageData);
        
        // Log message (có thể save vào database)
        console.log(`Message from ${socket.username} in ${socket.room}: ${data}`);
    }
};
