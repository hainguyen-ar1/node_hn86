import { userManager } from '../models/userModel.js';
import { SOCKET_EVENTS } from '../config/socketConfig.js';

export const handleJoin = (socket, io, username) => {
    if (userManager.isUserAvailable(username)) {
        // Connect user
        userManager.connectUser(username);
        
        // Set socket properties
        socket.username = username;
        socket.room = userManager.getUserRoom(username);
        
        // Join room
        socket.join(socket.room);
        
        // Emit success
        socket.emit(SOCKET_EVENTS.JOIN_SUCCESS, {
            username: username,
            room: socket.room
        });
        
        // Notify others in room
        socket.to(socket.room).emit(SOCKET_EVENTS.USER_JOINED, username);
        
        console.log(`${username} joined ${socket.room}`);
    } else {
        socket.emit(SOCKET_EVENTS.JOIN_FAILED, 'User không tồn tại hoặc đã được sử dụng');
    }
};
