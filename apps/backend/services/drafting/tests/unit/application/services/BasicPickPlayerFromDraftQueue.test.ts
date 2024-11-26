import { BasicPickPlayerFromDraftQueue } from "../../../../src/application";
import {
    DraftPlayerQueueRepository,
    DraftPlayerRepository,
    DraftRepository,
    DraftUserRepository,
    EventBus,
    PickPlayer,
} from "../../../../src/contracts";
import { FootballPositionEnum, QueuedDraftPlayer } from "../../../../src/domain";
import { InMemoryEventBus } from "../../../../src/infrastructure";
import { createFootballPlayer } from "../../../test-utils";

describe("BasicPickPlayerFromDraftQueue", () => {
    let mockedPickPlayer: jest.Mocked<PickPlayer>;
    let mockedEventBus: EventBus;
    let mockedDraftPlayerQueueRepository: jest.Mocked<DraftPlayerQueueRepository>;
    let mockedDraftPlayerRepository: jest.Mocked<DraftPlayerRepository>;
    let mockedDraftRepository: jest.Mocked<DraftRepository>;
    let mockedDraftUserRepository: jest.Mocked<DraftUserRepository>;

    beforeEach(() => {
        mockedDraftPlayerRepository = {
            pickPlayer: jest.fn(),
            getDraftPicks: jest.fn(),
            getAvailablePlayers: jest.fn(),
            getPlayerById: jest.fn(),
            getCurrentDraftPick: jest.fn(),
        };
        mockedDraftUserRepository = {
            getDraftUsers: jest.fn(),
            claimTeam: jest.fn(),
            getDraftUserByTeamNumber: jest.fn(),
            setAutoDraftStatus: jest.fn(),
        };
        mockedDraftRepository = {
            getDraftSettings: jest.fn(),
            createDraft: jest.fn(),
            startDraft: jest.fn(),
            updateDraftSettings: jest.fn(),
        };
        mockedDraftPlayerQueueRepository = {
            enqueuePlayer: jest.fn(),
            dequeuePlayer: jest.fn(),
            swapQueuedPlayerPriorities: jest.fn(),
            removePlayerFromQueue: jest.fn(),
            getQueuedDraftPlayers: jest.fn(),
            getQueuedDraftPlayersByUserId: jest.fn(),
            removePlayersFromQueue: jest.fn(),
        };

        mockedEventBus = new InMemoryEventBus();
        mockedPickPlayer = {
            execute: jest.fn(),
        };
    });

    it("should successfully dequeue a player and draft them.", async () => {
        const draftId: number = 1;
        const userId: number = 1;
        const pickNumber: number = 1;
        const teamNumber: number = 1;
        const playerId: number = 1;
        const queuedPlayer = createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]);
        mockedDraftPlayerQueueRepository.dequeuePlayer.mockResolvedValue(queuedPlayer);
        const pickPlayerFromDraftQueue = new BasicPickPlayerFromDraftQueue(
            mockedEventBus,
            mockedPickPlayer,
            mockedDraftPlayerQueueRepository,
        );
        await pickPlayerFromDraftQueue.execute(draftId, userId, teamNumber);

        // Expect the player with the highest priority to be dequeued and picked.
        expect(mockedDraftPlayerQueueRepository.dequeuePlayer).toHaveBeenCalledWith(draftId, userId);
        expect(mockedPickPlayer.execute).toHaveBeenCalledWith(draftId, queuedPlayer.id, pickNumber, teamNumber);
    });
});
