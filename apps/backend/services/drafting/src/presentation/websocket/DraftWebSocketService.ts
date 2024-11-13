import { Server } from "socket.io";
import http from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { redisClient } from "../../infrastructure/database/connection";
import { RedisTurnTimeRepository } from "../../infrastructure/database/repositories/RedisTurnTimeRepository";
import { PostgresFootballDraftRepository } from "../../infrastructure/database/repositories/PostgresFootballDraftRepository";
import { StartDraftUseCase } from "../../application/commands/StartDraftUseCase";
import { StartTurnTimerUseCase } from "../../application/commands/StartTurnTimerUseCase";
import { SocketIOWebSocket } from "../../infrastructure/websocket/SocketIOWebSocket";
import { TurnTimerHandler } from "./handlers/TurnTimerHandler";
import { EventBus } from "../../infrastructure/messaging/InMemoryEventBus";
import { DomainEventEnum } from "../../domain/enums/DomainEventEnum";
import { DomainEvent } from "../../contracts/events/DomainEvent";
import { TurnTimeTickedEvent } from "../../domain/events/TurnTimeTickedEvent";

export class DraftWebSocketService {
    public static async initialize(server: http.Server): Promise<void> {
        // Initialize the Socket.IO server
        const io = new Server(server, {
            path: "/drafting/socket.io/",
            cors: {
                origin: "*",
                methods: ["GET", "POST", "PUT", "DELETE"],
                allowedHeaders: [],
                credentials: false,
            },
        });

        // Apply Redis adapter to Socket.IO
        io.adapter(
            createAdapter(await redisClient.connect(), await redisClient.duplicate().connect()),
        );

        const draftingNamespace = io.of("/drafting");

        const turnTimeRepository = new RedisTurnTimeRepository();
        const draftRepository = new PostgresFootballDraftRepository();
        const eventBus: EventBus = EventBus.getInstance();

        // Handle Socket.IO connections in the namespace
        draftingNamespace.on("connection", (socket) => {
            const webSocket = new SocketIOWebSocket(socket, draftingNamespace as unknown as Server);
            console.log("User connected:", socket.id);

            eventBus.subscribe(DomainEventEnum.TURN_TIME_TICKED, (event: DomainEvent) =>
                new TurnTimerHandler(webSocket).handle(event as TurnTimeTickedEvent),
            );

            socket.on("draft:join", (draftId: number) => socket.join(`draft:${draftId}`));

            socket.on("draft:start", (draftId: number) =>
                new StartDraftUseCase(
                    turnTimeRepository,
                    draftRepository,
                    new StartTurnTimerUseCase(eventBus, turnTimeRepository),
                    webSocket,
                ).execute(draftId),
            );

            socket.on("user:disconnect", () => {
                console.log("User disconnected from drafting namespace:", socket.id);
            });
        });
    }
}
