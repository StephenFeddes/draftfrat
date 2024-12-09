import { PlayerQueueRepository } from "../../../../interfaces";
import { FootballPositionEnum, QueuedPlayer } from "../../../../domain";
import { createFootballPlayer } from "../../../../../tests/test-utils";
import { PickPlayer } from "../pick-player/PickPlayer";
import { PickPlayerFromQueue } from "./PickPlayerFromQueue";

describe("PickPlayerFromQueue", () => {
    let pickPlayerFromQueue: PickPlayerFromQueue;
    let pickPlayer: jest.Mocked<PickPlayer>;
    let playerQueueRepository: jest.Mocked<PlayerQueueRepository>;

    beforeEach(() => {
        playerQueueRepository = {
            enqueuePlayer: jest.fn(),
            dequeuePlayer: jest.fn(),
            swapQueuedPlayerPriorities: jest.fn(),
            getQueuedDraftPlayers: jest.fn(),
            getQueuedDraftPlayersByUserId: jest.fn(),
            removeDraftPlayerFromQueue: jest.fn(),
        };

        pickPlayer = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<PickPlayer>;

        pickPlayerFromQueue = new PickPlayerFromQueue(pickPlayer, playerQueueRepository);
    });

    it("should successfully dequeue a player and draft them.", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;
        const teamNumber: number = 1;
        const playerId: number = 1;
        const priority: number = 1;
        const queuedPlayer: QueuedPlayer = {
            draftId: draftId,
            userId: userId,
            priority: priority,
            player: createFootballPlayer(playerId, [FootballPositionEnum.QUARTERBACK]),
        };
        playerQueueRepository.dequeuePlayer.mockResolvedValue(queuedPlayer);
        playerQueueRepository.getQueuedDraftPlayersByUserId.mockResolvedValue([queuedPlayer]);

        // Act
        await pickPlayerFromQueue.execute(draftId, userId, teamNumber);

        // Assert
        expect(playerQueueRepository.dequeuePlayer).toHaveBeenCalledWith(draftId, userId);
        expect(pickPlayer.execute).toHaveBeenCalledWith(draftId, queuedPlayer.player.id, teamNumber);
    });

    it("should not pick player from queue when the queue is empty.", async () => {
        // Arrange
        const draftId: number = 1;
        const userId: number = 1;
        const teamNumber: number = 1;
        playerQueueRepository.getQueuedDraftPlayersByUserId.mockResolvedValue([]);

        // Act & Assert
        await expect(pickPlayerFromQueue.execute(draftId, userId, teamNumber)).rejects.toThrow(
            "Cannot add player from queue",
        );
        expect(pickPlayer.execute).not.toHaveBeenCalled();
    });
});
