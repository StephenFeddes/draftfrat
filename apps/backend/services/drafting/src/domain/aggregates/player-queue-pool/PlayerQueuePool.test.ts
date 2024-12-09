import { FootballPositionEnum, PlayerQueuePool, QueuedPlayer } from "../..";
import { createFootballPlayer } from "../../../../tests/test-utils";

describe("PlayerQueuePool", () => {
    test("should instantiate ordered draft queues for multiple teams in a draft", () => {
        // Arrange
        const draftId: number = 1;
        const userId1: number = 1;
        const userId2: number = 2;
        const queuedPlayer1: QueuedPlayer = {
            draftId: draftId,
            userId: userId1,
            priority: 2,
            player: createFootballPlayer(1, [FootballPositionEnum.QUARTERBACK]),
        };
        const queuedPlayer2: QueuedPlayer = {
            draftId: draftId,
            userId: userId2,
            priority: 2,
            player: createFootballPlayer(2, [FootballPositionEnum.RUNNING_BACK]),
        };
        const queuedPlayer3: QueuedPlayer = {
            draftId: draftId,
            userId: userId1,
            priority: 1,
            player: createFootballPlayer(3, [FootballPositionEnum.RUNNING_BACK]),
        };

        // Act
        const draftPlayerQueuePool = new PlayerQueuePool(draftId, [queuedPlayer1, queuedPlayer2, queuedPlayer3]);

        // Assert
        expect(draftPlayerQueuePool.getQueues()).toEqual({
            [userId1]: [queuedPlayer3, queuedPlayer1],
            [userId2]: [queuedPlayer2],
        });
    });
});
