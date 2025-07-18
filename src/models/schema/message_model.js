import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomModel",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'audio', 'file', 'system'],
        default: 'text',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true,
    }
},
{
    timestamps: true,
});

export const MessageModel = mongoose.model('MessageModel', MessageSchema); 