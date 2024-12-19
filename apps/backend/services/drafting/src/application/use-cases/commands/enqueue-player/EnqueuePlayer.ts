import { DraftEvent, DraftEventEnum, PlayerQueuePool } from "../../../../domain";
import { EventBus } from "../../../interfaces/event-bus/EventBus";
import { PlayerQueueRepository } from "../../../interfaces/repositories/PlayerQueueRepository";
import { PlayerEnqueuer } from "../../../interfaces/use-cases/commands/PlayerEnqueuer";

export class EnqueuePlayer implements PlayerEnqueuer {
    private readonly eventBus: EventBus;

    private readonly playerQueueRepository: PlayerQueueRepository;

    constructor(eventBus: EventBus, playerQueueRepository: PlayerQueueRepository) {
        this.eventBus = eventBus;
        this.playerQueueRepository = playerQueueRepository;
    }

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