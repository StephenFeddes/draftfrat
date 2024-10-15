import mongoose, { Document, Schema } from "mongoose";

// Define the Message type using TypeScript's `type` alias
export type Message = {
    senderId: number;
    senderName: string;
    recipientId: number;
    content: string;
    sentAt: string;
};

// Create the Mongoose schema
const MessageSchema: Schema = new mongoose.Schema({
    senderId: {
        type: Number,
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    recipientId: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    sentAt: {
        type: Date,
        required: true,
    },
});

// Export the Mongoose model
export const MessageModel = mongoose.model<Message>("Message", MessageSchema);
