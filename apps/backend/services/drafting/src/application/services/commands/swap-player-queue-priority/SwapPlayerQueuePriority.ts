import { PlayerQueueRepository, EventBus } from "../../../../interfaces";
import { DraftEvent, DraftEventEnum, PlayerQueuePool } from "../../../../domain";

/**
 * Joins a user to a draft and sends the current draft state to the user.
 */
export class SwapPlayerQueuePriority {
    private readonly eventBus: EventBus;

    private readonly playerQueueRepository: PlayerQueueRepository;

    constructor(eventBus: EventBus, playerQueueRepository: PlayerQueueRepository) {
        this.eventBus = eventBus;
        this.playerQueueRepository = playerQueueRepository;
    }

    /**
     * Swaps the priority of two players in a user's player queue within a draft.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param playerId1 The ID of the first player.
     * @param playerId2 The ID of the second player.
     * @returns void
     */
    async execute(draftId: number, userId: number, playerId1: number, playerId2: number): Promise<void> {
        this.playerQueueRepository.swapQueuedPlayerPriorities(draftId, userId, playerId1, playerId2);

        const queuedPlayers = await this.playerQueueRepository.getQueuedDraftPlayers(draftId);
        const playerQueuePool: PlayerQueuePool = new PlayerQueuePool(draftId, queuedPlayers);

        const queueChangedEvent: DraftEvent = new DraftEvent(draftId, DraftEventEnum.QUEUE_CHANGED, {
            queues: playerQueuePool.getQueues(),
        });
        this.eventBus.publish(queueChangedEvent);
    }
}
