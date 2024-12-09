import { Server } from "socket.io";
import http from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { Pool } from "pg";
import { redisClient } from "../../infrastructure";
import { SocketIOWebSocket } from "../../infrastructure/services/SocketIOWebSocket";
import { DraftWebSocketManager } from "./DraftWebSocketManager";
import { InMemoryEventBus } from "../../domain";

export class InitializeDraftWebSocketManager {
    public static async execute(server: http.Server, databaseConnectionPool: Pool): Promise<void> {
        const io = new Server(server, {
            path: "/drafting/socket.io/",
            cors: {
                origin: "*",
                methods: ["GET", "POST", "PUT", "DELETE"],
                allowedHeaders: [],
                credentials: false,
            },
        });

        io.adapter(createAdapter(await redisClient.connect(), await redisClient.duplicate().connect()));

        const draftingNamespace = io.of("/drafting");

        draftingNamespace.on("connection", (socket) => {
            const socketIOWebSocket = new SocketIOWebSocket(socket, draftingNamespace);
            const eventBus = new InMemoryEventBus();
            const draftWebSocketManager = new DraftWebSocketManager(
                socketIOWebSocket,
                eventBus,
                databaseConnectionPool,
            );
            draftWebSocketManager.start();
        });
    }
}
