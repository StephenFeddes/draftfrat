import { QueuedPlayer } from "../../../../domain";
import { PlayerQueueRepository } from "../../../interfaces/repositories/PlayerQueueRepository";
import { QueuedPlayerPicker } from "../../../interfaces/use-cases/commands/QueuedPlayerPicker";
import { PickPlayer } from "../pick-player/PickPlayer";

export class PickPlayerFromQueue implements QueuedPlayerPicker {
    private readonly pickPlayer: PickPlayer;

    private readonly playerQueueRepository: PlayerQueueRepository;

    constructor(pickPlayer: PickPlayer, playerQueueRepository: PlayerQueueRepository) {
        this.pickPlayer = pickPlayer;
        this.playerQueueRepository = playerQueueRepository;
    }

    async execute(draftId: number, userId: number, teamNumber: number): Promise<void> {
        const queuedPlayers = await this.playerQueueRepository.getQueuedDraftPlayersByUserId(draftId, userId);
        for (let i = 0; i < queuedPlayers.length; i++) {
            const dequeuedPlayer: QueuedPlayer | null = await this.playerQueueRepository.dequeuePlayer(draftId, userId);
            try {
                if (dequeuedPlayer !== null) {
                    this.pickPlayer.execute(draftId, dequeuedPlayer.player.id, teamNumber);
                    return;
                }
            } catch {
                continue;
            }
        }
        throw new Error("Cannot add player from queue");
    }
}
