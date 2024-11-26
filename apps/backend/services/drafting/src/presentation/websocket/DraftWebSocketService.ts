import { Server } from "socket.io";
import http from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { StartTurnTimerUseCase, StartDraftUseCase, JoinDraftUseCase } from "../../application";
import { InMemoryEventBus, redisClient } from "../../infrastructure";
import { DraftEvent, DraftEventEnum, SportEnum } from "../../domain";
import { DraftRepositoryFactory } from "../../infrastructure/database/factories/DraftRepositoryFactory";
import { DraftPlayerRepositoryFactory } from "../../infrastructure/database/factories/DraftPlayerRepositoryFactory";
import { PostgresDraftUserRepository } from "../../infrastructure/database/repositories/PostgresDraftUserRepository";
import { TimeoutTimer } from "../../domain/services/TimeoutTimer";
import { PickPlayer } from "../../application/services/BasicPickPlayer";

export class DraftWebSocketService {
    public static async initialize(server: http.Server): Promise<void> {
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

        const eventBus = new InMemoryEventBus();

        draftingNamespace.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            eventBus.subscribe(DraftEventEnum.TURN_TIME_TICKED, (event: DraftEvent) =>
                io.to(event.getDraftId().toString()).emit(event.getEventName(), event.getEventData()),
            );

            eventBus.subscribe(DraftEventEnum.PLAYER_PICKED, (event: DraftEvent) =>
                io.to(event.getDraftId().toString()).emit(event.getEventName(), event.getEventData()),
            );

            eventBus.subscribe(DraftEventEnum.JOINED_DRAFT, (event: DraftEvent) =>
                io.to(event.getDraftId().toString()).emit(event.getEventName(), event.getEventData()),
            );

            socket.on("draft:join", (data: { draftId: number; sport: SportEnum }) => {
                new JoinDraftUseCase(eventBus, DraftRepositoryFactory.create(data.sport)).execute(data.draftId);
                socket.join(data.draftId.toString());
            });

            socket.on(
                "draft:pick-player",
                (data: {
                    draftId: number;
                    sport: SportEnum;
                    playerId: number;
                    pickNumber: number;
                    teamNumber: number;
                }) =>
                    new PickPlayer(
                        eventBus,
                        DraftPlayerRepositoryFactory.create(data.sport),
                        DraftRepositoryFactory.create(data.sport),
                        new PostgresDraftUserRepository(),
                    ).execute(data.draftId, data.playerId, data.pickNumber, data.teamNumber),
            );

            socket.on("draft:start", (data: { draftId: number; sport: SportEnum }) =>
                new StartDraftUseCase(
                    DraftRepositoryFactory.create(data.sport),
                    new StartTurnTimerUseCase(eventBus, new TimeoutTimer()),
                ).execute(data.draftId),
            );

            socket.on("user:disconnect", () => {
                console.log("User disconnected from drafting namespace:", socket.id);
            });
        });
    }
}
