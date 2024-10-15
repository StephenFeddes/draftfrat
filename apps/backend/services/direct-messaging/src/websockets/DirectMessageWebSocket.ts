import { Server } from "socket.io";
import http from "http";
import { MessageModel } from "../models/Message";
import { MessageService } from "../services/MessageService";
import { MongodbMessageRepository } from "../repositories/MongodbMessageRepository";

export function initializeDirectMessagingWebSocket(server: http.Server) {
    // Initialize the Socket.IO server
    const io = new Server(server, {
        path: "/direct-messaging/socket.io/",
        cors: {
            origin: "*", // Allow all origins for WebSocket
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: [],
            credentials: false,
        },
    });

    const directMessagingNamespace = io.of("/direct-messaging");
    const messageRepository = new MongodbMessageRepository();
    const messageService = new MessageService(messageRepository);

    // Handle Socket.IO connections in the namespace
    directMessagingNamespace.on("connection", (socket) => {
        console.log("User connected to direct messaging namespace:", socket.id);

        socket.on("requestRecentConversations", async (userId) => {
            socket.emit(
                "receiveRecentConversations",
                await messageService.getLastMessagesToUser(userId)
            );
        });

        socket.on("joinChat", async ({ senderId, recipientId }) => {
            socket.join(senderId);
            const messages = await messageService.getMessagesBetweenUsers(
                senderId,
                recipientId
            );
            socket.emit("receiveMessages", messages);
        });

        socket.on(
            "sendMessage",
            async ({ senderId, senderName, recipientId, content, sentAt }) => {
                // Emit the message to the recipient's room
                await messageService.sendMessage({
                    senderId: senderId,
                    senderName: senderName,
                    recipientId: recipientId,
                    content: content,
                    sentAt: sentAt,
                });
                socket.to(recipientId).emit("receiveMessage", {
                    senderId: senderId,
                    senderName: senderName,
                    recipientId: recipientId,
                    content: content,
                    sentAt: sentAt,
                });
            }
        );

        socket.on("disconnect", () => {
            console.log(
                "User disconnected from direct messaging namespace:",
                socket.id
            );
        });
    });
}
