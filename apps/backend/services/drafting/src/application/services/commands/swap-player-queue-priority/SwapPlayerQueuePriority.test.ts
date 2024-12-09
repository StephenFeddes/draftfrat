import { SwapPlayerQueuePriority } from "../../..";
import { PlayerQueueRepository, EventBus } from "../../../../interfaces";
import { DraftEventEnum, FootballPlayer, FootballPositionEnum, QueuedPlayer } from "../../../../domain";
import { createFootballPlayer } from "../../../../../tests/test-utils";

describe("SwapPlayerQueuePriorities", () => {
    let swapPlayerQueuePriority: SwapPlayerQueuePriority;
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

        swapPlayerQueuePriority = new SwapPlayerQueuePriority(eventBus, playerQueueRepository);
    });

    it("should swap player priorities in the queue", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;
        const playerId1: number = 1;
        const playerId2: number = 2;
        const player1: FootballPlayer = createFootballPlayer(playerId1, [FootballPositionEnum.QUARTERBACK]);
        const player2: FootballPlayer = createFootballPlayer(playerId2, [FootballPositionEnum.RUNNING_BACK]);
        const queuedPlayer1: QueuedPlayer = { draftId: draftId, userId: userId, priority: 1, player: player1 };
        const queuedPlayer2: QueuedPlayer = { draftId: draftId, userId: userId, priority: 2, player: player2 };
        playerQueueRepository.getQueuedDraftPlayers.mockResolvedValue([queuedPlayer1, queuedPlayer2]);

        // Act
        await swapPlayerQueuePriority.execute(draftId, userId, playerId1, playerId2);

        // Assert
        expect(playerQueueRepository.swapQueuedPlayerPriorities).toHaveBeenCalledWith(
            draftId,
            userId,
            playerId1,
            playerId2,
        );
        expect(eventBus.publish).toHaveBeenCalledWith({
            draftId: draftId,
            eventName: DraftEventEnum.QUEUE_CHANGED,
            eventData: {
                queues: {
                    [userId]: [queuedPlayer1, queuedPlayer2],
                },
            },
        });
    });
});
