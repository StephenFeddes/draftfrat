import { PlayerQueueRepository, EventBus } from "../../../../interfaces";
import { DraftEvent, DraftEventEnum, PlayerQueuePool } from "../../../../domain";

/**
 * Enqueue player to a queue of players to be picked in a draft for a user.
 * The player is given the lowest priority when first enqueued.
 */
export class EnqueuePlayer {
    private readonly eventBus: EventBus;

    private readonly playerQueueRepository: PlayerQueueRepository;

    constructor(eventBus: EventBus, playerQueueRepository: PlayerQueueRepository) {
        this.eventBus = eventBus;
        this.playerQueueRepository = playerQueueRepository;
    }

    /**
     * Enqueues a player to a queue of players to be picked in a draft.
     * - The player is given the lowest priority when first enqueued.
     * - If the player is picked by another team before reaching the front of the queue,
     * then they are removed from the it.
     *
     * @param draftId The ID of the draft.
     * @param userId The ID of the user.
     * @param playerId The ID of the player.
     * @returns void
     */
    async execute(draftId: number, userId: number, playerId: number): Promise<void> {
        this.playerQueueRepository.enqueuePlayer(draftId, userId, playerId);

        const queuedPlayers = await this.playerQueueRepository.getQueuedDraftPlayers(draftId);
        const draftPlayerQueuePool = new PlayerQueuePool(draftId, queuedPlayers);

        const queueChangedEvent: DraftEvent = new DraftEvent(draftId, DraftEventEnum.QUEUE_CHANGED, {
            queues: draftPlayerQueuePool.getQueues(),
        });
        this.eventBus.publish(queueChangedEvent);
    }
}
