import { DraftEvent, DraftEventEnum, PlayerQueuePool } from "../../../../domain";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { PlayerQueueRepository } from "../../../interfaces/repositories/PlayerQueueRepository";
import { QueuedPlayerPrioritySwapper } from "../../../interfaces/use-cases/commands/QueuedPlayerPrioritySwapper";

export class SwapQueuedPlayerPriority implements QueuedPlayerPrioritySwapper {
    private readonly eventBus: EventBus;

    private readonly playerQueueRepository: PlayerQueueRepository;

    constructor(eventBus: EventBus, playerQueueRepository: PlayerQueueRepository) {
        this.eventBus = eventBus;
        this.playerQueueRepository = playerQueueRepository;
    }

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
