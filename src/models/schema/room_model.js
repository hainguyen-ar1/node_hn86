import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    leftAt: {
        type: Date,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    }
}, { _id: false });

const RoomSchema = new mongoose.Schema({
    participants: {
        type: [ParticipantSchema],
        required: true,
        validate: {
            validator: function(participants) {
                return participants && participants.length >= 2;
            },
            message: 'Room must have at least 2 participants'
        }
    },
    status: {
        type: String,
        enum: ['active', 'ended', 'paused'],
        default: 'active',
        required: true,
    },
    endedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        default: null,
    },
    matchingDuration: {
        type: Number, // in seconds
        default: 0,
    },
    chatDuration: {
        type: Number, // in seconds
        default: 0,
    },
    endedAt: {
        type: Date,
        default: null,
    }
},
{
    timestamps: true,
});

export const RoomModel = mongoose.model('RoomModel', RoomSchema); 