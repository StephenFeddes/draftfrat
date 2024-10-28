import { Server } from "socket.io";
import http from "http";

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

    const draftingNamespace = io.of("/drafting");

    // Handle Socket.IO connections in the namespace
    draftingNamespace.on("connection", (socket) => {
        console.log("User connected to direct messaging namespace:", socket.id);

        socket.on("requestRecentConversations", async () => {
            socket.emit("receiveRecentConversations", "Test");
        });

        socket.on("disconnect", () => {
            console.log("User disconnected from drafting namespace:", socket.id);
        });
    });
}
