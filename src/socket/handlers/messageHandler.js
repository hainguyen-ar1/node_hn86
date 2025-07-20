import { userManager } from '../models/userModel.js';
import { SOCKET_EVENTS } from '../config/socketConfig.js';
import { MessageModel } from '../../models/schema/message_model.js';
import { RoomModel } from '../../models/schema/room_model.js';

export const handleMessage = async (socket, io, data) => {
    try {
        console.log('Message received:', { socketId: socket.id, data });
        
        if (!socket.userId || !socket.room) {
            console.log('User not properly joined to room');
            return;
        }

        const messageData = {
            sender: {
                _id: socket.userId,
                fullName: socket.fullName,
                email: socket.email
            },
            message: data,
            timestamp: new Date().toISOString()
        };
        
        // Save message to database if room exists
        if (socket.roomId) {
            try {
                const message = await MessageModel.create({
                    roomId: socket.roomId,
                    senderId: socket.userId,
                    content: data,
                    messageType: 'text',
                    timestamp: new Date(),
                    isRead: false,
                    isDeleted: false
                });

                // Populate sender information
                await message.populate('senderId', 'fullName image');
                
                // Add populated sender info to message data
                messageData.sender = {
                    _id: message.senderId._id,
                    fullName: message.senderId.fullName,
                    image: message.senderId.image
                };
                messageData.messageId = message._id;
                
                console.log('Message saved to database:', message._id);
            } catch (error) {
                console.error('Error saving message to database:', error);
            }
        }
        
        // Send message to all users in the room
        io.to(socket.room).emit('message', messageData);
        
        console.log(`Message from ${socket.fullName} in ${socket.room}: ${data}`);
        
    } catch (error) {
        console.error('Error handling message:', error);
        // Still emit the message even if database save fails
        if (socket.userId && socket.room) {
            const messageData = {
                sender: {
                    _id: socket.userId,
                    fullName: socket.fullName,
                    email: socket.email
                },
                message: data,
                timestamp: new Date().toISOString()
            };
            io.to(socket.room).emit('message', messageData);
        }
    }
};
