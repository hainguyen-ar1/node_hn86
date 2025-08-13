import mongoose from "mongoose";

const QueueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    status: {
        type: String,
        enum: ['waiting', 'matched', 'cancelled', 'completed'],
        default: 'waiting',
        required: true,
    }
},
{
    timestamps: true,
});

export const QueueModel = mongoose.model('QueueModel', QueueSchema); 