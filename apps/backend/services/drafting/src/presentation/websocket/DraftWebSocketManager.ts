import { Pool } from "pg";
import {
    ClaimDraftTeam,
    EnqueuePlayer,
    JoinDraft,
    PickPlayer,
    PickPlayerFromQueue,
    RandomAutoDraftPlayer,
    RemovePlayerFromQueue,
    StartDraft,
    StartTurnTimer,
    SwapPlayerQueuePriority,
    ToggleAutoDrafting,
    UpdateDraftSettings,
} from "../../application";
import { DraftEvent, DraftEventEnum, DraftSettings, SportEnum } from "../../domain";
import { PlayerQueueRepositoryFactory } from "../../infrastructure/persistence/factories/PlayerQueueRepositoryFactory";
import { EventBus, WebSocket } from "../../interfaces";
import { PickRepositoryFactory } from "../../infrastructure/persistence/factories/PickRepositoryFactory";
import { DraftRepositoryFactory } from "../../infrastructure";
import { PostgresDraftUserRepository } from "../../infrastructure/persistence/repositories/PostgresDraftUserRepository";
import { MathRandomIndexGenerator } from "../../domain/services/math-random-index-generator/MathRandomIndexGenerator";
import { TimeoutTimer } from "../../domain/services/timeout-timer/TimeoutTimer";

export class DraftWebSocketManager {
    private readonly websocket: WebSocket;

    private readonly eventBus: EventBus;

    private readonly databaseConnectionPool: Pool;

    constructor(websocket: WebSocket, eventBus: EventBus, databaseConnectionPool: Pool) {
        this.websocket = websocket;
        this.eventBus = eventBus;
        this.databaseConnectionPool = databaseConnectionPool;
    }

    public start(): void {
        // Subscribe to draft events
        this.eventBus.subscribe(DraftEventEnum.TURN_TIME_TICKED, (event: DraftEvent) =>
            this.websocket.broadcastToRoom(event.getDraftId().toString(), event.getEventName(), event.getEventData()),
        );

        this.eventBus.subscribe(DraftEventEnum.PLAYER_PICKED, (event: DraftEvent) =>
            this.websocket.broadcastToRoom(event.getDraftId().toString(), event.getEventName(), event.getEventData()),
        );

        this.eventBus.subscribe(DraftEventEnum.JOINED_DRAFT, (event: DraftEvent) =>
            this.websocket.broadcastToRoom(event.getDraftId().toString(), event.getEventName(), event.getEventData()),
        );

        this.eventBus.subscribe(DraftEventEnum.AUTO_DRAFTING_CHANGED, (event: DraftEvent) =>
            this.websocket.broadcastToRoom(event.getDraftId().toString(), event.getEventName(), event.getEventData()),
        );

        this.eventBus.subscribe(DraftEventEnum.DRAFT_SETTINGS_UPDATED, (event: DraftEvent) =>
            this.websocket.broadcastToRoom(event.getDraftId().toString(), event.getEventName(), event.getEventData()),
        );

        this.eventBus.subscribe(DraftEventEnum.QUEUE_CHANGED, (event: DraftEvent) =>
            this.websocket.broadcastToRoom(event.getDraftId().toString(), event.getEventName(), event.getEventData()),
        );

        this.eventBus.subscribe(DraftEventEnum.TEAM_CLAIMED, (event: DraftEvent) =>
            this.websocket.broadcastToRoom(event.getDraftId().toString(), event.getEventName(), event.getEventData()),
        );

        // Publish draft events
        this.websocket.on("draft:join", (data: { draftId: number; sport: SportEnum }) => {
            new JoinDraft(
                this.eventBus,
                PlayerQueueRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                PickRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                DraftRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                new PostgresDraftUserRepository(this.databaseConnectionPool),
            ).execute(data.draftId);
            this.websocket.join(data.draftId.toString());
        });

        this.websocket.on(
            "draft:pick-player",
            (data: { draftId: number; sport: SportEnum; playerId: number; pickNumber: number; teamNumber: number }) =>
                new PickPlayer(
                    this.eventBus,
                    PlayerQueueRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                    PickRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                    DraftRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                    new PostgresDraftUserRepository(this.databaseConnectionPool),
                ).execute(data.draftId, data.playerId, data.teamNumber),
        );

        this.websocket.on("draft:start", (data: { draftId: number; sport: SportEnum }) => {
            const pickPlayer = new PickPlayer(
                this.eventBus,
                PlayerQueueRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                PickRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                DraftRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                new PostgresDraftUserRepository(this.databaseConnectionPool),
            );
            new StartDraft(
                DraftRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                PickRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                new PostgresDraftUserRepository(this.databaseConnectionPool),
                new RandomAutoDraftPlayer(
                    pickPlayer,
                    PickRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                    DraftRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                    new PostgresDraftUserRepository(this.databaseConnectionPool),
                    new MathRandomIndexGenerator(),
                ),
                new PickPlayerFromQueue(
                    pickPlayer,
                    PlayerQueueRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                ),
                new StartTurnTimer(this.eventBus, new TimeoutTimer()),
                new TimeoutTimer(),
            ).execute(data.draftId);
        });

        this.websocket.on(
            "draft:claim-team",
            (data: { draftId: number; sport: SportEnum; teamNumber: number; teamName: string; userId: number }) =>
                new ClaimDraftTeam(
                    this.eventBus,
                    DraftRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                    PickRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                    new PostgresDraftUserRepository(this.databaseConnectionPool),
                ).execute(data.draftId, data.teamNumber, data.teamName, data.userId),
        );

        this.websocket.on(
            "draft:enqueue-player",
            (data: { draftId: number; sport: SportEnum; playerId: number; userId: number }) =>
                new EnqueuePlayer(
                    this.eventBus,
                    PlayerQueueRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                ).execute(data.draftId, data.userId, data.playerId),
        );

        this.websocket.on(
            "draft:remove-player-from-queue",
            (data: { draftId: number; sport: SportEnum; userId: number; playerId: number }) =>
                new RemovePlayerFromQueue(
                    this.eventBus,
                    PlayerQueueRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                ).execute(data.draftId, data.userId, data.playerId),
        );

        this.websocket.on(
            "draft:swap-player-queue-priority",
            (data: { draftId: number; sport: SportEnum; userId: number; playerId1: number; playerId2: number }) =>
                new SwapPlayerQueuePriority(
                    this.eventBus,
                    PlayerQueueRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                ).execute(data.draftId, data.userId, data.playerId1, data.playerId2),
        );

        this.websocket.on(
            "draft:update-settings",
            (data: { draftId: number; sport: SportEnum; settings: DraftSettings }) =>
                new UpdateDraftSettings(
                    this.eventBus,
                    DraftRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                    PickRepositoryFactory.create(data.sport, this.databaseConnectionPool),
                    new PostgresDraftUserRepository(this.databaseConnectionPool),
                ).execute(data.draftId, data.settings),
        );

        this.websocket.on(
            "draft:toggle-auto-drafting",
            (data: { draftId: number; sport: SportEnum; userId: number; isAutoDrafting: boolean }) =>
                new ToggleAutoDrafting(
                    this.eventBus,
                    new PostgresDraftUserRepository(this.databaseConnectionPool),
                ).execute(data.draftId, data.userId, data.isAutoDrafting),
        );
    }
}
