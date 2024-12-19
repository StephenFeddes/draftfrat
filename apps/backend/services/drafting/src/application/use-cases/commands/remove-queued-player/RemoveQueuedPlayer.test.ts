import { RemovePlayerFromQueue } from "../../..";
import { DraftEventEnum } from "../../../../domain";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { PlayerQueueRepository } from "../../../interfaces/repositories/PlayerQueueRepository";

describe("RemoveQueuedPlayer", () => {
    let removePlayerFromQueue: RemovePlayerFromQueue;
    let playerQueueRepository: jest.Mocked<PlayerQueueRepository>;
    let eventBus: jest.Mocked<EventBus>;

    beforeEach(() => {
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
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
            publishAll: jest.fn(),
        };

        removePlayerFromQueue = new RemovePlayerFromQueue(eventBus, playerQueueRepository);
    });

    it("should remove a player from the queue", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;
        const playerId: number = 1;
        playerQueueRepository.getQueuedDraftPlayers.mockResolvedValue([]);

        // Act
        await removePlayerFromQueue.execute(draftId, userId, playerId);

        // Assert
        expect(playerQueueRepository.removeDraftPlayerFromQueue).toHaveBeenCalledWith(draftId, userId, playerId);
        expect(eventBus.publish).toHaveBeenCalledWith({
            draftId: draftId,
            eventName: DraftEventEnum.QUEUE_CHANGED,
            eventData: {
                queues: {},
            },
        });
    });
});
