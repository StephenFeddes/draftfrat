import { StartDraft } from "./StartDraft";
import {
    Draft,
    DraftEvent,
    DraftEventEnum,
    DraftOrderEnum,
    DraftPick,
    DraftSettings,
    FootballDraftSettings,
    ScoringEnum,
    SportEnum,
} from "../../../../domain";
import { PickPlayerFromQueue } from "../pick-queued-player/PickQueuedPlayer";
import { PickPlayer } from "../pick-player/PickPlayer";
import { StartTurnTimer } from "../start-turn-timer/StartTurnTimer";
import { PlayerQueueRepository } from "../../../interfaces/repositories/PlayerQueueRepository";
import { PickRepository } from "../../../interfaces/repositories/PickRepository";
import { DraftRepository } from "../../../interfaces/repositories/DraftRepository";
import { DraftUserRepository } from "../../../interfaces/repositories/DraftUserRepository";
import { Timeouter } from "../../../interfaces/time/Timeouter";
import { PlayerAutoDrafter } from "../../../interfaces/use-cases/commands/PlayerAutoDrafter";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { InMemoryEventBus } from "../../../../infrastructure/event-bus/InMemoryEventBus";

describe("StartDraft", () => {
    let startDraft: StartDraft;
    let playerQueueRepository: jest.Mocked<PlayerQueueRepository>;
    let pickRepository: jest.Mocked<PickRepository>;
    let draftRepository: jest.Mocked<DraftRepository>;
    let draftUserRepository: jest.Mocked<DraftUserRepository>;
    let autoDraftPlayer: jest.Mocked<PlayerAutoDrafter>;
    let pickPlayerFromQueue: PickPlayerFromQueue;
    let pickPlayer: PickPlayer;
    let startTurnTimer: StartTurnTimer;
    let eventBus: EventBus;
    let timeout: Timeouter;

    beforeEach(() => {
        pickRepository = {
            pickPlayer: jest.fn(),
            getPlayerById: jest.fn(),
            getAvailablePlayers: jest.fn(),
            getDraftPicks: jest.fn(),
            getCurrentDraftPick: jest.fn(),
        };
        draftRepository = {
            getDraftByDraftId: jest.fn(),
            createDraft: jest.fn(),
            startDraft: jest.fn(),
            updateDraftSettings: jest.fn(),
            getDrafts: jest.fn(),
            completeDraft: jest.fn(),
        };
        draftUserRepository = {
            getDraftUserByTeamNumber: jest.fn(),
            getDraftUsers: jest.fn(),
            claimTeam: jest.fn(),
            setAutoDraftStatus: jest.fn(),
        };
        playerQueueRepository = {
            enqueuePlayer: jest.fn(),
            dequeuePlayer: jest.fn(),
            swapQueuedPlayerPriorities: jest.fn(),
            getQueuedDraftPlayers: jest.fn(),
            getQueuedDraftPlayersByUserId: jest.fn(),
            removeDraftPlayerFromQueue: jest.fn(),
        };

        timeout = {
            execute: jest.fn(),
        };
        eventBus = new InMemoryEventBus();

        autoDraftPlayer = {
            execute: jest.fn(),
        };
        pickPlayer = new PickPlayer(
            eventBus,
            playerQueueRepository,
            pickRepository,
            draftRepository,
            draftUserRepository,
        );
        pickPlayerFromQueue = new PickPlayerFromQueue(pickPlayer, playerQueueRepository);
        startTurnTimer = new StartTurnTimer(eventBus, timeout);

        startDraft = new StartDraft(
            draftRepository,
            pickRepository,
            draftUserRepository,
            autoDraftPlayer,
            pickPlayerFromQueue,
            startTurnTimer,
            timeout,
        );

        jest.clearAllMocks();
    });

    it("should finish turn when user manually picks a player", async () => {
        // Arrange
        const times: number[] = [];
        const draftId: number = 1;
        const userId: number = 1;
        const teamNumber: number = 1;
        const pickTimeLimitSeconds: number = 10;
        const draftPicks: DraftPick[] = [
            { draftId, pickNumber: 1, teamNumber: 1, player: null },
            { draftId, pickNumber: 2, teamNumber: 2, player: null },
        ];
        draftRepository.getDraftByDraftId.mockResolvedValue({
            id: draftId,
            settings: {
                sport: SportEnum.FOOTBALL,
                draftOrderType: DraftOrderEnum.SNAKE,
                scoringType: ScoringEnum.PPR,
                pickTimeLimitSeconds: pickTimeLimitSeconds,
                teamCount: 2,
            },
            isStarted: true,
            isComplete: false,
            createdAt: null,
        });
        draftUserRepository.getDraftUserByTeamNumber.mockResolvedValue({
            draftId,
            userId: userId,
            teamName: "mockUser1",
            teamNumber: teamNumber,
            isAdmin: false,
            isAutoDrafting: false,
        });
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);
        const startTurnTimerSpy = jest.spyOn(startTurnTimer, "execute");
        const pickPlayerFromQueueSpy = jest.spyOn(pickPlayerFromQueue, "execute");
        const autoDraftPlayerSpy = jest.spyOn(autoDraftPlayer, "execute");

        // Act
        const eventProcessed = new Promise<void>((resolve) => {
            eventBus.subscribe(DraftEventEnum.TURN_TIME_TICKED, (event: DraftEvent) => {
                const time = event.getEventData();
                times.push(time);

                if (time <= 3) {
                    eventBus.publish(new DraftEvent(draftId, DraftEventEnum.PLAYER_PICKED, null));
                    resolve();
                }
            });
        });
        await startDraft.execute(draftId);
        await eventProcessed;

        // Assert
        expect(startTurnTimerSpy).toHaveBeenCalledWith(draftId, userId, pickTimeLimitSeconds);
        expect(autoDraftPlayerSpy).not.toHaveBeenCalled();
        expect(pickPlayerFromQueueSpy).not.toHaveBeenCalled();
        expect(draftRepository.completeDraft).toHaveBeenCalledWith(draftId);
    });

    it("should throw an error if the draft does not exist", async () => {
        // Arrange
        const draftId: number = 1;
        draftRepository.getDraftByDraftId.mockResolvedValue(null);
        const startTurnTimerSpy = jest.spyOn(startTurnTimer, "execute");
        const pickPlayerFromQueueSpy = jest.spyOn(pickPlayerFromQueue, "execute");
        const autoDraftPlayerSpy = jest.spyOn(autoDraftPlayer, "execute");

        // Act & Assert
        await expect(startDraft.execute(draftId)).rejects.toThrow("Draft not found");

        // Assert
        expect(startTurnTimerSpy).not.toHaveBeenCalled();
        expect(autoDraftPlayerSpy).not.toHaveBeenCalled();
        expect(pickPlayerFromQueueSpy).not.toHaveBeenCalled();
        expect(draftRepository.completeDraft).not.toHaveBeenCalled();
    });

    it("should enable auto-drafting and auto-draft a player if timer runs out on user's turn", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;
        const teamNumber: number = 1;
        const pickNumber: number = 1;
        const pickTimeLimitSeconds: number = 10;
        const draftPicks: DraftPick[] = [{ draftId, pickNumber, teamNumber, player: null }];
        draftRepository.getDraftByDraftId.mockResolvedValue({
            id: draftId,
            settings: {
                sport: SportEnum.FOOTBALL,
                draftOrderType: DraftOrderEnum.SNAKE,
                scoringType: ScoringEnum.PPR,
                pickTimeLimitSeconds,
                teamCount: 1,
            },
            isStarted: true,
            isComplete: false,
            createdAt: null,
        });
        draftUserRepository.getDraftUserByTeamNumber.mockResolvedValue({
            draftId,
            userId,
            teamName: "mockUser",
            teamNumber,
            isAdmin: false,
            isAutoDrafting: false,
        });
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);

        const startTurnTimerSpy = jest.spyOn(startTurnTimer, "execute");
        const autoDraftPlayerSpy = jest.spyOn(autoDraftPlayer, "execute");
        const pickPlayerFromQueueSpy = jest.spyOn(pickPlayerFromQueue, "execute");

        // Act
        await startDraft.execute(draftId);

        // Assert
        expect(startTurnTimerSpy).toHaveBeenCalledWith(draftId, userId, pickTimeLimitSeconds);
        expect(draftUserRepository.setAutoDraftStatus).toHaveBeenCalledWith(draftId, userId, true);
        expect(pickPlayerFromQueueSpy).toHaveBeenCalledWith(draftId, userId, teamNumber);
        expect(autoDraftPlayerSpy).toHaveBeenCalledWith(draftId, pickNumber, teamNumber);
        expect(draftRepository.completeDraft).toHaveBeenCalledWith(draftId);
    });

    it("should freeze until a player is picked if the time limit is null", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;
        const teamNumber: number = 1;
        const pickNumber: number = 1;
        const draftPicks: DraftPick[] = [{ draftId, pickNumber, teamNumber, player: null }];
        draftRepository.getDraftByDraftId.mockResolvedValue({
            id: draftId,
            settings: {
                sport: SportEnum.FOOTBALL,
                draftOrderType: DraftOrderEnum.SNAKE,
                scoringType: ScoringEnum.PPR,
                pickTimeLimitSeconds: null, // No time limit
                teamCount: 1,
            },
            isStarted: true,
            isComplete: false,
            createdAt: null,
        });
        draftUserRepository.getDraftUserByTeamNumber.mockResolvedValue({
            draftId,
            userId,
            teamName: "mockUser",
            teamNumber,
            isAdmin: false,
            isAutoDrafting: false,
        });
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);

        const pickPlayerFromQueueSpy = jest.spyOn(pickPlayerFromQueue, "execute");
        const startTurnTimerSpy = jest.spyOn(startTurnTimer, "execute");
        const autoDraftPlayerSpy = jest.spyOn(autoDraftPlayer, "execute");

        // Act
        const eventPublishPromise = new Promise<void>((resolve) => {
            setImmediate(() => {
                eventBus.publish(new DraftEvent(draftId, DraftEventEnum.PLAYER_PICKED, null));
                resolve();
            });
        });
        await startDraft.execute(draftId);
        await eventPublishPromise;

        // Assert
        expect(startTurnTimerSpy).toHaveBeenCalledWith(draftId, userId, null);
        expect(draftUserRepository.setAutoDraftStatus).not.toHaveBeenCalled();
        expect(autoDraftPlayerSpy).not.toHaveBeenCalled();
        expect(pickPlayerFromQueueSpy).not.toHaveBeenCalled();
        expect(draftRepository.completeDraft).toHaveBeenCalledWith(draftId);
    });

    it("Should pick from a user's player queue if players are queued and auto-drafting is enabled", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;
        const teamNumber: number = 1;
        const pickNumber: number = 1;
        const draftPicks: DraftPick[] = [{ draftId, pickNumber, teamNumber, player: null }];
        const draftSettings: FootballDraftSettings = {
            sport: SportEnum.FOOTBALL,
            draftOrderType: DraftOrderEnum.SNAKE,
            scoringType: ScoringEnum.PPR,
            pickTimeLimitSeconds: null,
            teamCount: 1,
            quarterbackSpotsCount: 1,
            runningBackSpotsCount: 0,
            wideReceiverSpotsCount: 0,
            tightEndSpotsCount: 0,
            flexSpotsCount: 0,
            benchSpotsCount: 0,
            kickerSpotsCount: 0,
            defenseSpotsCount: 0,
        };
        draftRepository.getDraftByDraftId.mockResolvedValue({
            id: draftId,
            settings: draftSettings,
            isStarted: true,
            isComplete: false,
            createdAt: null,
        });
        draftUserRepository.getDraftUserByTeamNumber.mockResolvedValue({
            draftId: draftId,
            userId: userId,
            teamName: "mockUser",
            teamNumber,
            isAdmin: false,
            isAutoDrafting: true,
        });
        pickPlayer.execute = jest.fn();
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);
        const pickPlayerFromQueueSpy = jest.spyOn(pickPlayerFromQueue, "execute").mockImplementation(jest.fn());
        const startTurnTimerSpy = jest.spyOn(startTurnTimer, "execute");
        const autoDraftPlayerSpy = jest.spyOn(autoDraftPlayer, "execute");

        // Act
        await startDraft.execute(draftId);

        // Assert
        expect(startTurnTimerSpy).not.toHaveBeenCalled();
        expect(draftUserRepository.setAutoDraftStatus).not.toHaveBeenCalled();
        expect(pickPlayerFromQueueSpy).toHaveBeenCalledWith(draftId, userId, teamNumber);
        expect(autoDraftPlayerSpy).not.toHaveBeenCalledWith(draftId, pickNumber, teamNumber);
        expect(draftRepository.completeDraft).toHaveBeenCalledWith(draftId);
    });

    it("should fallback to auto-drafting if picking from the queue fails", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;
        const teamNumber: number = 1;
        const draftPicks: DraftPick[] = [{ draftId, pickNumber: 1, teamNumber, player: null }];
        draftRepository.getDraftByDraftId.mockResolvedValue({
            id: draftId,
            settings: {
                sport: SportEnum.FOOTBALL,
                draftOrderType: DraftOrderEnum.SNAKE,
                scoringType: ScoringEnum.PPR,
                pickTimeLimitSeconds: 30,
                teamCount: teamNumber,
            },
            isStarted: true,
            isComplete: false,
            createdAt: null,
        });
        draftUserRepository.getDraftUserByTeamNumber.mockResolvedValue({
            draftId,
            userId,
            teamName: "mockUser",
            teamNumber,
            isAdmin: false,
            isAutoDrafting: true,
        });
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);
        const startTurnTimerSpy = jest.spyOn(startTurnTimer, "execute").mockImplementation(jest.fn());
        const pickPlayerFromQueueSpy = jest.spyOn(pickPlayerFromQueue, "execute").mockImplementation(() => {
            throw new Error("Queue picking failed"); // Simulating queue picking failure
        });
        const autoDraftPlayerSpy = jest.spyOn(autoDraftPlayer, "execute").mockImplementation(jest.fn());
        const completeDraftSpy = jest.spyOn(draftRepository, "completeDraft").mockImplementation(jest.fn());

        // Act
        await startDraft.execute(draftId);

        // Assert
        expect(startTurnTimerSpy).not.toHaveBeenCalled();
        expect(draftUserRepository.setAutoDraftStatus).not.toHaveBeenCalled();
        expect(pickPlayerFromQueueSpy).toHaveBeenCalledWith(draftId, userId, teamNumber);
        expect(autoDraftPlayerSpy).toHaveBeenCalledWith(draftId, 1, teamNumber); // Fallback auto-drafting
        expect(completeDraftSpy).toHaveBeenCalledWith(draftId);
    });

    it("should auto-pick player for a team if the team has no user owning it", async () => {
        // Arrange
        const draftId: number = 1;
        const teamNumber: number = 1;
        const draftPicks: DraftPick[] = [{ draftId, pickNumber: 1, teamNumber: teamNumber, player: null }];
        draftRepository.getDraftByDraftId.mockResolvedValue({
            id: draftId,
            settings: {
                sport: SportEnum.FOOTBALL,
                draftOrderType: DraftOrderEnum.SNAKE,
                scoringType: ScoringEnum.PPR,
                pickTimeLimitSeconds: null,
                teamCount: 1,
            },
            isStarted: true,
            isComplete: false,
            createdAt: null,
        });
        draftUserRepository.getDraftUserByTeamNumber.mockResolvedValue(null);
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);
        const pickPlayerFromQueueSpy = jest.spyOn(pickPlayerFromQueue, "execute");
        const startTurnTimerSpy = jest.spyOn(startTurnTimer, "execute");
        const autoDraftPlayerSpy = jest.spyOn(autoDraftPlayer, "execute");
        const completeDraftSpy = jest.spyOn(draftRepository, "completeDraft");

        // Act
        await startDraft.execute(draftId);

        // Assert
        expect(startTurnTimerSpy).not.toHaveBeenCalled();
        expect(draftUserRepository.setAutoDraftStatus).not.toHaveBeenCalled();
        expect(autoDraftPlayerSpy).toHaveBeenCalledWith(draftId, 1, teamNumber);
        expect(pickPlayerFromQueueSpy).not.toHaveBeenCalled();
        expect(completeDraftSpy).toHaveBeenCalledWith(draftId);
    });

    it("should auto-pick player for a team if the team's user has auto-drafting enabled", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;
        const teamNumber: number = 1;
        const draftSettings: DraftSettings = {
            sport: SportEnum.FOOTBALL,
            draftOrderType: DraftOrderEnum.SNAKE,
            scoringType: ScoringEnum.PPR,
            pickTimeLimitSeconds: null,
            teamCount: 1,
        };
        const draft: Draft = {
            id: draftId,
            settings: draftSettings,
            isStarted: true,
            isComplete: false,
            createdAt: null,
        };
        const draftPicks: DraftPick[] = [{ draftId, pickNumber: 1, teamNumber: 1, player: null }];
        draftRepository.getDraftByDraftId.mockResolvedValue(draft);
        draftUserRepository.getDraftUserByTeamNumber.mockResolvedValueOnce({
            draftId,
            userId: userId,
            teamName: "mockUser1",
            teamNumber: teamNumber,
            isAdmin: false,
            isAutoDrafting: true,
        });
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);
        playerQueueRepository.getQueuedDraftPlayersByUserId.mockResolvedValue([]);
        const startTurnTimerSpy = jest.spyOn(startTurnTimer, "execute");
        const pickPlayerFromQueueSpy = jest.spyOn(pickPlayerFromQueue, "execute");
        const autoDraftPlayerSpy = jest.spyOn(autoDraftPlayer, "execute");

        // Act
        await startDraft.execute(draftId);

        // Assert
        expect(startTurnTimerSpy).not.toHaveBeenCalled();
        expect(draftUserRepository.setAutoDraftStatus).not.toHaveBeenCalled();
        expect(autoDraftPlayerSpy).toHaveBeenCalledWith(draftId, 1, teamNumber);
        expect(pickPlayerFromQueueSpy).toHaveBeenCalledWith(draftId, userId, teamNumber);
        expect(draftRepository.completeDraft).toHaveBeenCalledWith(draftId);
    });
});
