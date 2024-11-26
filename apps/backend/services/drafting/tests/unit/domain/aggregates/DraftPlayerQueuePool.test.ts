import { FootballPositionEnum, DraftPlayerQueuePool, QueuedDraftPlayer } from "../../../../src/domain";
import { createFootballPlayer } from "../../../test-utils";

describe("DraftPlayerQueuePool", () => {
    test("should instantiate ordered draft queues for multiple teams in a draft", () => {
        const draftId: number = 1;
        const userId1: number = 1;
        const userId2: number = 2;
        const priority1: number = 1;
        const priority2: number = 2;
        const queuedPlayer1: QueuedDraftPlayer = new QueuedDraftPlayer(
            draftId,
            userId1,
            priority2,
            createFootballPlayer(1, [FootballPositionEnum.QUARTERBACK]),
        );
        const queuedPlayer2: QueuedDraftPlayer = new QueuedDraftPlayer(
            draftId,
            userId2,
            priority2,
            createFootballPlayer(2, [FootballPositionEnum.RUNNING_BACK]),
        );
        const queuedPlayer3: QueuedDraftPlayer = new QueuedDraftPlayer(
            draftId,
            userId1,
            priority1,
            createFootballPlayer(3, [FootballPositionEnum.WIDE_RECEIVER]),
        );
        const draftPlayerQueuePool = new DraftPlayerQueuePool(draftId, [
            queuedPlayer1,
            queuedPlayer2,
            queuedPlayer3,
        ]);
        expect(draftPlayerQueuePool.toJSON()).toEqual({
            [userId1]: [
                queuedPlayer3.toJSON(),
                queuedPlayer1.toJSON(),
            ],
            [userId2]: [queuedPlayer2.toJSON()],
        });
    });
});
