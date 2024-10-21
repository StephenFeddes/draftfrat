import { Server } from "socket.io";
import http from "http";
import { PostgresDraftingRepository } from "../repositories/PostgresDraftingRepository";
import { DraftingService } from "../services/DraftingService";

export function initializeDraftWebSocket(server: http.Server) {
    // Initialize the Socket.IO server
    const io = new Server(server, {
        path: "/drafting/socket.io/",
        cors: {
            origin: "*", // Allow all origins for WebSocket
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: [],
            credentials: false,
        },
    });

    const directMessagingNamespace = io.of("/direct-messaging");
    const draftingRepository = new PostgresDraftingRepository();
    const draftingService = new DraftingService(draftingRepository);

    // Handle Socket.IO connections in the namespace
    directMessagingNamespace.on("connection", (socket) => {
        console.log("User connected to direct messaging namespace:", socket.id);

        socket.on("requestRecentConversations", async (userId) => {
            socket.emit(
                "receiveRecentConversations",
                "Test"
            );
        });

        socket.on("disconnect", () => {
            console.log(
                "User disconnected from direct messaging namespace:",
                socket.id
            );
        });
    });
}
