import {
    Draft,
    DraftEventEnum,
    DraftOrderEnum,
    DraftPick,
    DraftUser,
    FootballDraftSettings,
    FootballPlayer,
    FootballPositionEnum,
    Player,
    RosterPoolFactory,
    ScoringEnum,
    SportEnum,
} from "../../../../domain";
import { createFootballPlayer } from "../../../../../tests/test-utils";
import { PickPlayer } from "./PickPlayer";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { PlayerQueueRepository } from "../../../interfaces/repositories/PlayerQueueRepository";
import { PickRepository } from "../../../interfaces/repositories/PickRepository";
import { DraftUserRepository } from "../../../interfaces/repositories/DraftUserRepository";
import { DraftRepository } from "../../../interfaces/repositories/DraftRepository";

describe("PickPlayer", () => {
    let pickPlayer: PickPlayer;
    let eventBus: jest.Mocked<EventBus>;
    let playerQueueRepository: jest.Mocked<PlayerQueueRepository>;
    let pickRepository: jest.Mocked<PickRepository>;
    let draftUserRepository: jest.Mocked<DraftUserRepository>;
    let draftRepository: jest.Mocked<DraftRepository>;

    beforeEach(() => {
        pickRepository = {
            pickPlayer: jest.fn(),
            getDraftPicks: jest.fn(),
            getAvailablePlayers: jest.fn(),
            getPlayerById: jest.fn(),
            getCurrentDraftPick: jest.fn(),
        };
        draftUserRepository = {
            getDraftUsers: jest.fn(),
            claimTeam: jest.fn(),
            getDraftUserByTeamNumber: jest.fn(),
            setAutoDraftStatus: jest.fn(),
        };
        draftRepository = {
            getDraftByDraftId: jest.fn(),
            createDraft: jest.fn(),
            startDraft: jest.fn(),
            updateDraftSettings: jest.fn(),
            getDrafts: jest.fn(),
            completeDraft: jest.fn(),
        };
        playerQueueRepository = {
            enqueuePlayer: jest.fn(),
            dequeuePlayer: jest.fn(),
            swapQueuedPlayerPriorities: jest.fn(),
            getQueuedDraftPlayers: jest.fn(),
            getQueuedDraftPlayersByUserId: jest.fn(),
            removeDraftPlayerFromQueue: jest.fn(),
        };

        eventBus = {
            publish: jest.fn(),
            publishAll: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        };

        pickPlayer = new PickPlayer(
            eventBus,
            playerQueueRepository,
            pickRepository,
            draftRepository,
            draftUserRepository,
        );

        jest.clearAllMocks();
    });

    it("should successfully publish to the event bus when the player is picked", async () => {
        // Arrange
        const draftId = 1;
        const playerId = 101;
        const pickNumber = 1;
        const teamNumber = 1;
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
        const draft: Draft = {
            id: draftId,
            settings: draftSettings,
            isStarted: true,
            isComplete: false,
            createdAt: null,
        };
        const draftPicks: DraftPick[] = [
            { draftId: draftId, pickNumber: pickNumber, teamNumber: teamNumber, player: null },
        ];
        const draftUsers: DraftUser[] = [
            {
                draftId: draftId,
                userId: 1,
                teamNumber: teamNumber,
                teamName: "mockUser",
                isAdmin: false,
                isAutoDrafting: false,
            },
        ];
        const pickedPlayer: FootballPlayer = createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]);
        draftRepository.getDraftByDraftId.mockResolvedValue(draft);
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);
        draftUserRepository.getDraftUsers.mockResolvedValue(draftUsers);
        pickRepository.getPlayerById.mockResolvedValue(pickedPlayer);
        pickRepository.getAvailablePlayers.mockResolvedValue([]);
        playerQueueRepository.getQueuedDraftPlayers.mockResolvedValue([]);

        // Act
        await pickPlayer.execute(draftId, playerId, teamNumber);

        // Assert
        expect(pickRepository.pickPlayer).toHaveBeenCalledWith(draftId, playerId, pickNumber, teamNumber);
        expect(eventBus.publish).toHaveBeenCalledWith({
            draftId,
            eventName: DraftEventEnum.PLAYER_PICKED,
            eventData: {
                picks: [{ draftId: draftId, pickNumber: pickNumber, teamNumber: teamNumber, player: pickedPlayer }],
                rosters: RosterPoolFactory.create(
                    draftSettings,
                    [{ draftId: draftId, pickNumber: pickNumber, teamNumber: teamNumber, player: pickedPlayer }],
                    draftUsers,
                ).getRosters(),
                availablePlayers: [],
                queues: {},
            },
        });
        expect(pickRepository.getAvailablePlayers).toHaveBeenCalledWith(draftId);
        expect(playerQueueRepository.getQueuedDraftPlayers).toHaveBeenCalledWith(draftId);
    });

    it("should not pick the player if the draft has not started", async () => {
        // Arrange
        const draftId: number = 1;
        const playerId: number = 101;
        const teamNumber: number = 1;
        const pickNumber: number = 1;
        const draft: Draft = {
            id: draftId,
            settings: {
                sport: SportEnum.FOOTBALL,
                draftOrderType: DraftOrderEnum.SNAKE,
                scoringType: ScoringEnum.PPR,
                pickTimeLimitSeconds: null,
                teamCount: 1,
            },
            isStarted: false,
            isComplete: false,
            createdAt: null,
        };
        const draftPicks = [{ draftId: draftId, pickNumber: pickNumber, teamNumber: teamNumber, player: null }];
        const draftUsers = [
            {
                draftId: draftId,
                userId: 1,
                teamNumber: teamNumber,
                teamName: "mockUser",
                isAdmin: false,
                isAutoDrafting: false,
            },
        ];
        const pickedPlayer = createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]);
        draftRepository.getDraftByDraftId.mockResolvedValue(draft);
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);
        draftUserRepository.getDraftUsers.mockResolvedValue(draftUsers);
        pickRepository.getPlayerById.mockResolvedValue(pickedPlayer);
        pickRepository.getAvailablePlayers.mockResolvedValue([]);
        playerQueueRepository.getQueuedDraftPlayers.mockResolvedValue([]);

        // Act & Assert
        await expect(pickPlayer.execute(draftId, playerId, teamNumber)).rejects.toThrow("Draft has not started");
    });

    it("should throw an error if draft settings are not found", async () => {
        // Arrange
        const draftId = 1;
        const playerId = 101;
        const teamNumber = 1;
        const player: Player = createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]);
        draftRepository.getDraftByDraftId.mockResolvedValue(null);
        pickRepository.getDraftPicks.mockResolvedValue([]);
        pickRepository.getPlayerById.mockResolvedValue(player);

        // Act & Assert
        await expect(pickPlayer.execute(draftId, playerId, teamNumber)).rejects.toThrow("Draft settings not found");
    });

    it("should throw an error if the player is not found", async () => {
        // Arrange
        const draftId = 1;
        const playerId = 101;
        const teamNumber = 1;
        const draft: Draft = {
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
        };
        pickRepository.getDraftPicks.mockResolvedValue([]);
        draftRepository.getDraftByDraftId.mockResolvedValue(draft);
        pickRepository.getPlayerById.mockResolvedValue(null);

        // Act & Assert
        await expect(pickPlayer.execute(draftId, playerId, teamNumber)).rejects.toThrow("Player not found");
    });

    it("should throw an error if there are no available picks", async () => {
        // Arrange
        const draftId = 1;
        const playerId = 101;
        const teamNumber = 1;
        const player: Player = createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]);
        const draft: Draft = {
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
        };
        draftRepository.getDraftByDraftId.mockResolvedValue(draft);
        pickRepository.getDraftPicks.mockResolvedValue([]);
        pickRepository.getPlayerById.mockResolvedValue(player);

        // Act & Assert
        await expect(pickPlayer.execute(draftId, playerId, teamNumber)).rejects.toThrow("No pick available");
    });

    it("should throw an error if it's not the team's turn", async () => {
        // Arrange
        const draftId: number = 1;
        const playerId: number = 101;
        const teamNumber: number = 1;
        const player: Player = createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]);
        const draft: Draft = {
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
        };
        const draftPicks = [{ draftId: draftId, pickNumber: 1, teamNumber: 2, player: null }];
        draftRepository.getDraftByDraftId.mockResolvedValue(draft);
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);
        pickRepository.getPlayerById.mockResolvedValue(player);

        // Act & Assert
        await expect(pickPlayer.execute(draftId, playerId, teamNumber)).rejects.toThrow(
            `It is not team ${teamNumber}'s turn`,
        );
    });
});
