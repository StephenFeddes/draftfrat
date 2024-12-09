import { PlayerQueueRepository, EventBus } from "../../../../interfaces";
import { DraftEvent, DraftEventEnum, PlayerQueuePool } from "../../../../domain";

/**
 * Removes a player from a user's draft queue
 */
export class RemovePlayerFromQueue {
    private readonly eventBus: EventBus;

    private readonly playerQueueRepository: PlayerQueueRepository;

    constructor(eventBus: EventBus, playerQueueRepository: PlayerQueueRepository) {
        this.eventBus = eventBus;
        this.playerQueueRepository = playerQueueRepository;
    }

    /**
     * Removes a player from a user's draft queue.
     * - The player is removed from the draft queue and added back to the available player pool.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param playerId The ID of the player.
     * @returns void
     */
    async execute(draftId: number, userId: number, playerId: number): Promise<void> {
        this.playerQueueRepository.removeDraftPlayerFromQueue(draftId, userId, playerId);

        const queuedPlayers = await this.playerQueueRepository.getQueuedDraftPlayers(draftId);
        const draftPlayerQueuePool = new PlayerQueuePool(draftId, queuedPlayers);

        const queueChangedEvent: DraftEvent = new DraftEvent(draftId, DraftEventEnum.QUEUE_CHANGED, {
            queues: draftPlayerQueuePool.getQueues(),
        });
        this.eventBus.publish(queueChangedEvent);
    }
}
