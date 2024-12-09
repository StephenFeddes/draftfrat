import { EnqueuePlayer } from "../../..";
import { PlayerQueueRepository, EventBus } from "../../../../interfaces";
import { DraftEventEnum, FootballPlayer, FootballPositionEnum, QueuedPlayer } from "../../../../domain";
import { createFootballPlayer } from "../../../../../tests/test-utils";

describe("EnqueuePlayer", () => {
    let enqueuePlayer: EnqueuePlayer;
    let draftPlayerQueueRepository: jest.Mocked<PlayerQueueRepository>;
    let eventBus: jest.Mocked<EventBus>;

    beforeEach(() => {
        draftPlayerQueueRepository = {
            enqueuePlayer: jest.fn(),
            dequeuePlayer: jest.fn(),
            swapQueuedPlayerPriorities: jest.fn(),
            getQueuedDraftPlayers: jest.fn(),
            getQueuedDraftPlayersByUserId: jest.fn(),
            removeDraftPlayerFromQueue: jest.fn(),
        };

        eventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
            publishAll: jest.fn(),
        };

        enqueuePlayer = new EnqueuePlayer(eventBus, draftPlayerQueueRepository);

        jest.clearAllMocks();
    });

    it("should enqueue a player", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;
        const playerId: number = 1;
        const priority: number = 1;
        const player: FootballPlayer = createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]);
        const queuedPlayer: QueuedPlayer = { draftId: draftId, userId: userId, priority: priority, player: player };
        draftPlayerQueueRepository.getQueuedDraftPlayers.mockResolvedValue([queuedPlayer]);

        // Act
        await enqueuePlayer.execute(draftId, userId, playerId);

        // Assert
        expect(draftPlayerQueueRepository.enqueuePlayer).toHaveBeenCalledWith(draftId, userId, playerId);
        expect(eventBus.publish).toHaveBeenCalledWith({
            draftId: draftId,
            eventName: DraftEventEnum.QUEUE_CHANGED,
            eventData: {
                queues: {
                    [userId]: [queuedPlayer],
                },
            },
        });
    });
});
