import {
    DraftRepository,
    DraftUserRepository,
    PickRepository,
    PlayerQueueRepository,
    EventBus,
} from "../../../../interfaces";
import {
    Draft,
    DraftPick,
    DraftUser,
    RosterPoolFactory,
    Player,
    DraftEvent,
    DraftEventEnum,
    FootballDraftSettings,
    DraftOrderEnum,
    SportEnum,
    ScoringEnum,
    QueuedPlayer,
    RosterPool,
    PlayerQueuePool,
} from "../../../../domain";
import { JoinDraft } from "./JoinDraft";

describe("JoinDraft", () => {
    let draftRepository: jest.Mocked<DraftRepository>;
    let draftUserRepository: jest.Mocked<DraftUserRepository>;
    let pickRepository: jest.Mocked<PickRepository>;
    let playerQueueRepository: jest.Mocked<PlayerQueueRepository>;
    let eventBus: jest.Mocked<EventBus>;
    let joinDraft: JoinDraft;

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

        joinDraft = new JoinDraft(
            eventBus,
            playerQueueRepository,
            pickRepository,
            draftRepository,
            draftUserRepository,
        );
    });

    it("should throw an error if the draft is not found", async () => {
        // Arrange
        draftRepository.getDraftByDraftId.mockResolvedValue(null);

        // Act
        await expect(joinDraft.execute(1)).rejects.toThrow("Draft not found");

        // Assert
        expect(draftRepository.getDraftByDraftId).toHaveBeenCalledWith(1);
    });

    it("should retrieve draft picks, users, and publish an event", async () => {
        // Arrange
        const draftId = 1;
        const draftSettings: FootballDraftSettings = {
            draftOrderType: DraftOrderEnum.SNAKE,
            sport: SportEnum.FOOTBALL,
            scoringType: ScoringEnum.STANDARD,
            teamCount: 1,
            pickTimeLimitSeconds: null,
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
            id: 1,
            settings: draftSettings,
            isStarted: false,
            isComplete: false,
            createdAt: null,
        };
        const draftPicks: DraftPick[] = [{ draftId: draftId, pickNumber: 1, teamNumber: 1, player: null }];
        const draftUsers: DraftUser[] = [
            { draftId: draftId, userId: 1, teamNumber: 1, teamName: "", isAdmin: false, isAutoDrafting: false },
        ];
        const availablePlayers: Player[] = [];
        const queuedPlayers: QueuedPlayer[] = [];
        const draftPlayerQueuePool: PlayerQueuePool = new PlayerQueuePool(draftId, queuedPlayers);
        const rosterPool: RosterPool = RosterPoolFactory.create(draftSettings, draftPicks, draftUsers);
        draftRepository.getDraftByDraftId.mockResolvedValue(draft);
        pickRepository.getDraftPicks.mockResolvedValue(draftPicks);
        draftUserRepository.getDraftUsers.mockResolvedValue(draftUsers);
        pickRepository.getAvailablePlayers.mockResolvedValue(availablePlayers);
        playerQueueRepository.getQueuedDraftPlayers.mockResolvedValue(queuedPlayers);

        // Act
        await joinDraft.execute(draftId);

        // Assert
        expect(draftRepository.getDraftByDraftId).toHaveBeenCalledWith(draftId);
        expect(pickRepository.getDraftPicks).toHaveBeenCalledWith(draftId);
        expect(draftUserRepository.getDraftUsers).toHaveBeenCalledWith(draftId);
        expect(pickRepository.getAvailablePlayers).toHaveBeenCalledWith(draftId);
        expect(playerQueueRepository.getQueuedDraftPlayers).toHaveBeenCalledWith(draftId);
        expect(eventBus.publish).toHaveBeenCalledWith(
            new DraftEvent(draftId, DraftEventEnum.JOINED_DRAFT, {
                draftId,
                settings: draft.settings,
                picks: draftPicks,
                rosters: rosterPool.getRosters(),
                availablePlayers: availablePlayers,
                users: draftUsers,
                queues: draftPlayerQueuePool.getQueues(),
            }),
        );
    });
});
