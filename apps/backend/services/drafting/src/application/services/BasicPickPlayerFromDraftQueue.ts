import { DraftPlayerQueueRepository, PickPlayerFromDraftQueue, PickPlayer } from "../../contracts";
import { Player, QueuedDraftPlayer } from "../../domain";

export class BasicPickPlayerFromDraftQueue implements PickPlayerFromDraftQueue {
    private readonly pickPlayer: PickPlayer;

    private readonly draftPlayerQueueRepository: DraftPlayerQueueRepository;

    constructor(pickPlayer: PickPlayer, draftPlayerQueueRepository: DraftPlayerQueueRepository) {
        this.pickPlayer = pickPlayer;
        this.draftPlayerQueueRepository = draftPlayerQueueRepository;
    }

    async execute(draftId: number, userId: number, teamNumber: number): Promise<void> {
        let queuedPlayers = await this.draftPlayerQueueRepository.getQueuedDraftPlayersByUserId(draftId, userId);
        for (let i = 0; i < queuedPlayers.length; i++) {
            const deqeuedPlayer: QueuedDraftPlayer = this.draftPlayerQueueRepository.dequeuePlayer(draftId, userId);
            try {
                this.pickPlayer.execute(draftId, queuedPlayers[i].player.id, teamNumber);
                return;
            } catch {
                continue;
            }
        }
        throw new Error("Unabled to add player from queue");
    }
}
