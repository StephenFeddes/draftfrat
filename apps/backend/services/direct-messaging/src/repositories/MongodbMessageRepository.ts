import { Collection, Document, Db } from "mongodb";
import { Message, MessageModel } from "../models/Message";
import { MessageRepository } from "../interfaces/MessageRepository";

export class MongodbMessageRepository implements MessageRepository {
    // Insert a single message
    async insertMessage(message: Message): Promise<void> {
        try {
            const newMessage = new MessageModel({
                senderId: message.senderId,
                senderName: message.senderName,
                recipientId: message.recipientId,
                content: message.content,
                sentAt: message.sentAt,
            });
            await newMessage.save();
        } catch (error) {
            console.error("Error inserting message:", error);
            throw error;
        }
    }

    async getLastMessagesToUser(userId: number): Promise<Message[]> {
        try {
            return await MessageModel.aggregate([
                {
                    $match: {
                        recipientId: userId,
                    },
                },
                {
                    $sort: {
                        sentAt: -1,
                    },
                },
                {
                    $group: {
                        _id: "$senderId",
                        lastMessage: { $first: "$$ROOT" },
                    },
                },
                {
                    $replaceRoot: { newRoot: "$lastMessage" },
                },
            ]);
        } catch (error) {
            console.error("Error fetching last messages:", error);
            throw error;
        }
    }

    async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
        try {
            return await MessageModel.find({
                $or: [
                    { senderId: user1Id, recipientId: user2Id },
                    { senderId: user2Id, recipientId: user1Id },
                ]
            }).sort({ sentAt: 1 });
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }
}
